import { Inject, Container } from "typedi";
import { API_PARSER_TOKEN, BaseApiParser } from "../parser";
import { ApiCall } from "../../api";
import { ApiCallDescriptor, isCall } from "../../api/types";
import { StageInstruction, ValueRef } from "../types";
import { CONFIG_STORAGE_TOKEN, EvmConfig, IConfigStorage } from "../config";
import { IStateStorageFetcher, STATE_STORAGE_TOKEN } from "../../state";

type UpCall = ApiCall<
  [ValueRef<string>, Record<string, ValueRef<string>>],
  { build?: boolean }
>;

function isUpCall(call: ApiCallDescriptor): call is UpCall {
  return isCall("dockerCompose", 1, "up", call);
}

export class DockerComposeParser extends BaseApiParser {
  constructor(
    @Inject(CONFIG_STORAGE_TOKEN)
    configs: IConfigStorage<EvmConfig>,
    @Inject(STATE_STORAGE_TOKEN)
    state: IStateStorageFetcher
  ) {
    super("dockerCompose", 1, configs, state);
  }

  public async parse<T extends ApiCallDescriptor>(
    call: T
  ): Promise<StageInstruction> {
    if (isUpCall(call)) {
      return this.parseUp(call);
    }

    throw new Error("Unknown api call");
  }

  private parseUp(call: UpCall): StageInstruction {
    const envs = Object.fromEntries(
      Object.entries(call.args[1]).map(([name, val]) => [name, this.value(val)])
    );

    const cmd = ["-f", this.value(call.args[0]), "up", "-d"];

    if (call.metadata.build) {
      cmd.push("--build");
    }

    return {
      type: "offchain",
      image: "ghcr.io/drewpackages/engine/workers/docker-compose",
      envs: envs,
      workdir: ".",
      cmd,
      dind: true,
    };
  }
}

Container.set({
  multiple: true,
  type: DockerComposeParser,
  id: API_PARSER_TOKEN,
});
