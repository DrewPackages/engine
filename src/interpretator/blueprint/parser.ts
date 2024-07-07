import { Inject, Container } from "typedi";
import { API_PARSER_TOKEN, BaseApiParser } from "../../interpretator/parser";
import { ApiCall } from "../../api";
import { ApiCallDescriptor, isCall } from "../../api/types";
import { StageInstruction, ValueRef } from "../types";
import { ConfigStorage } from "../config";
import { IStateStorageFetcher, STATE_STORAGE_TOKEN } from "../../state";

type ScriptCall = ApiCall<
  [ValueRef<string>, ValueRef<number>, Record<string, ValueRef<string>>],
  { workdir?: ValueRef<string> }
>;

function isScriptCall(call: ApiCallDescriptor): call is ScriptCall {
  return isCall("blueprint", 1, "script", call);
}

export class BlueprintParser extends BaseApiParser {
  constructor(
    @Inject()
    configs: ConfigStorage,
    @Inject(STATE_STORAGE_TOKEN)
    state: IStateStorageFetcher
  ) {
    super("blueprint", 1, configs, state);
  }

  public async parse<T extends ApiCallDescriptor>(
    call: T
  ): Promise<StageInstruction> {
    if (isScriptCall(call)) {
      return this.parseScript(call);
    }

    throw new Error("Unknown api call");
  }

  private parseScript(call: ScriptCall): StageInstruction {
    const envs = Object.fromEntries(
      Object.entries(call.args[2]).map(([name, val]) => [name, this.value(val)])
    );

    return {
      type: "task",
      image: "ghcr.io/drewpackages/engine/workers/blueprint",
      envs: { ...envs },
      workdir: this.value(call.metadata.workdir) || ".",
      // cmd: ["run", this.value(call.args[0]), "--network", "drew"],
      cmd: ["run"],
      outputs: call.outputs.map(({ type, ...rest }) => rest),
      interactive: true,
    };
  }
}

Container.set({
  multiple: true,
  type: BlueprintParser,
  id: API_PARSER_TOKEN,
});
