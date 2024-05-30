import { Inject, Container } from "typedi";
import { API_PARSER_TOKEN, BaseApiParser } from "../parser";
import { ApiCall } from "../../api";
import { ApiCallDescriptor, isCall } from "../../api/types";
import { StageInstruction, ValueRef } from "../types";
import { CommonConfig, ConfigStorage } from "../config";
import { IStateStorageFetcher, STATE_STORAGE_TOKEN } from "../../state";

type SignCall = ApiCall<[ValueRef<string>, ValueRef<number>], {}>;

function isSignCall(call: ApiCallDescriptor): call is SignCall {
  return isCall("foundry", 1, "sign", call);
}

export class FoundryParser extends BaseApiParser {
  private static image = "ghcr.io/drewpackages/engine/workers/foundry";

  constructor(
    @Inject()
    configs: ConfigStorage,
    @Inject(STATE_STORAGE_TOKEN)
    state: IStateStorageFetcher
  ) {
    super("foundry", 1, configs, state);
  }

  public async parse<T extends ApiCallDescriptor>(
    call: T
  ): Promise<StageInstruction> {
    const config: CommonConfig = await this.configs.get("common");

    if (isSignCall(call)) {
      return this.parseSign(call, config);
    }

    throw new Error("Unknown api call");
  }

  private parseSign(
    call: SignCall,
    { privateKey, rpcUrl }: CommonConfig
  ): StageInstruction {
    return {
      type: "task",
      image: FoundryParser.image,
      envs: { PRIVATE_KEY: privateKey },
      workdir: ".",
      cmd: [
        "cast",
        "wallet",
        "sign",
        "--private-key",
        "$PRIVATE_KEY",
        this.value(call.args[0]),
      ],
      outputIds: call.outputs.map((o) => o.id),
    };
  }
}

Container.set({
  multiple: true,
  type: FoundryParser,
  id: API_PARSER_TOKEN,
});
