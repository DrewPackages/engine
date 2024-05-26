import { Inject, Service } from "typedi";
import { API_PARSER_TOKEN, BaseApiParser } from "../../interpretator/parser";
import { ApiCall } from "../../api";
import { ApiCallDescriptor, isCall } from "../../api/types";
import { StageInstruction } from "../types";
import { CommonConfig, ConfigStorage } from "../config";

type ScriptCall = ApiCall<
  [string, number, Record<string, string>],
  { workdir?: string }
>;

function isScriptCall(call: ApiCallDescriptor): call is ScriptCall {
  return isCall("hardhat", 1, "script", call);
}

@Service(API_PARSER_TOKEN)
export class HardhatParser extends BaseApiParser {
  constructor(
    @Inject()
    private readonly configs: ConfigStorage
  ) {
    super("hardhat", 1);
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
    return {
      type: "task",
      image: "ghcr.io/drewpackages/engine/workers/hardhat",
      envs: { ...call.args[2], RPC_URL: rpcUrl, PRIVATE_KEY: privateKey },
      workdir: call.metadata.workdir || ".",
      cmd: ["run", call.args[0], "--network", "drew"],
    };
  }
}
