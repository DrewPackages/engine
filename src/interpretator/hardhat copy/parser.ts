import { Inject, Container } from "typedi";
import { API_PARSER_TOKEN, BaseApiParser } from "../parser";
import { ApiCall } from "../../api";
import { ApiCallDescriptor, isCall } from "../../api/types";
import { StageInstruction, ValueRef } from "../types";
import { CommonConfig, ConfigStorage } from "../config";
import { IStateStorageFetcher, STATE_STORAGE_TOKEN } from "../../state";

type ScriptCall = ApiCall<
  [ValueRef<string>, ValueRef<number>, Record<string, ValueRef<string>>],
  { workdir?: ValueRef<string> }
>;

function isScriptCall(call: ApiCallDescriptor): call is ScriptCall {
  return isCall("hardhat", 1, "script", call);
}

export class HardhatParser extends BaseApiParser {
  constructor(
    @Inject()
    configs: ConfigStorage,
    @Inject(STATE_STORAGE_TOKEN)
    state: IStateStorageFetcher
  ) {
    super("hardhat", 1, configs, state);
  }

  public async parse<T extends ApiCallDescriptor>(
    call: T
  ): Promise<StageInstruction> {
    const config: CommonConfig = await this.configs.get("common");

    if (isScriptCall(call)) {
      return this.parseScript(call, config);
    }

    throw new Error("Unknown api call");
  }

  private parseScript(
    call: ScriptCall,
    { privateKey, rpcUrl }: CommonConfig
  ): StageInstruction {
    const envs = Object.fromEntries(
      Object.entries(call.args[2]).map(([name, val]) => [name, this.value(val)])
    );

    return {
      type: "task",
      image: "ghcr.io/drewpackages/engine/workers/hardhat",
      envs: { ...envs, RPC_URL: rpcUrl, PRIVATE_KEY: privateKey },
      workdir: this.value(call.metadata.workdir) || ".",
      cmd: ["run", this.value(call.args[0]), "--network", "drew"],
      outputIds: call.outputs.map((o) => o.id),
    };
  }
}

Container.set({
  multiple: true,
  type: HardhatParser,
  id: API_PARSER_TOKEN,
});
