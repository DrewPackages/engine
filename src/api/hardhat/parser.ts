import { Inject, Service } from "typedi";
import { API_PARSER_TOKEN, BaseApiParser } from "../parser";
import { ApiCall, ApiCallDescriptor, StageInstruction, isCall } from "../types";
import {
  HARDHAT_CONFIG_PROVIDER_TOKEN,
  HardhatConfig,
  HardhatConfigProvider,
} from "./config";

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
    @Inject(HARDHAT_CONFIG_PROVIDER_TOKEN)
    private readonly configProvider: HardhatConfigProvider
  ) {
    super("hardhat", 1);
  }

  public async parse<T extends ApiCallDescriptor>(
    call: T
  ): Promise<StageInstruction> {
    const config = await this.configProvider.resolve();

    if (isScriptCall(call)) {
      return this.parseScript(call, config);
    }

    throw new Error("Unknown api call");
  }

  private parseScript(
    call: ScriptCall,
    { privateKey, rpcUrl }: HardhatConfig
  ): StageInstruction {
    return {
      image: "ghcr.io/DrewPackages/engine/workers/hardhat",
      envs: { ...call.args[2], RPC_URL: rpcUrl, PRIVATE_KEY: privateKey },
      workdir: call.metadata.workdir || ".",
      cmd: ["run", call.args[0], "--network", "drew"],
    };
  }
}
