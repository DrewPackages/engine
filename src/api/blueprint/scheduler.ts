import { IQueue, QUEUE_TOKEN } from "../../queue/types";
import { IApiScheduler, OutputInfo } from "../types";
import { BaseScheduler } from "../scheduler";
import { Inject, Service } from "typedi";
import { ValueRef } from "../../interpretator";

export type BlueprintScriptRequest = {
  path: ValueRef<string>;
  account?: number;
  envs?: Record<string, ValueRef<string>>;
  workdir?: ValueRef<string>;
  outputs?: Array<OutputInfo>;
};

@Service("api-blueprint")
export class BlueprintScheduler
  extends BaseScheduler
  implements IApiScheduler<"script">
{
  constructor(@Inject(QUEUE_TOKEN) queue: IQueue) {
    super(queue, "blueprint", "onchain");
  }

  script(arg: BlueprintScriptRequest) {
    return this.schedule(
      "script",
      [arg.path, arg.account || 1, arg.envs || {}],
      {
        workdir: arg.workdir,
      },
      "onchain",
      arg.outputs
    );
  }
}
