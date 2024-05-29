import { Inject, Service } from "typedi";
import { API_PARSER_TOKEN, BaseApiParser } from "../../interpretator/parser";
import { ApiCall } from "../../api";
import { ApiCallDescriptor, isCall } from "../../api/types";
import { StageInstruction } from "../types";
import { CommonConfig, ConfigStorage } from "../config";
import { ValueOrConfigRef, isConfigRef } from "../../params";

type ScriptCall = ApiCall<
  [
    ValueOrConfigRef<string>,
    ValueOrConfigRef<number>,
    Record<string, ValueOrConfigRef<string>>
  ],
  { workdir?: ValueOrConfigRef<string> }
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

  value(valueOrRef?: ValueOrConfigRef<string>): string | undefined {
    if (valueOrRef == null) {
      return undefined;
    }

    if (isConfigRef(valueOrRef)) {
      return this.configs.resolve(valueOrRef);
    } else {
      return valueOrRef;
    }
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
    };
  }
}
