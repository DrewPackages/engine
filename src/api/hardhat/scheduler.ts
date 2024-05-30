import { IQueue, QUEUE_TOKEN } from "../../queue/types";
import { IApiScheduler } from "../types";
import { BaseScheduler } from "../scheduler";
import { Inject, Service } from "typedi";
import { ValueRef } from "../../interpretator";

export type ScriptRequest = {
  path: ValueRef<string>;
  account?: number;
  envs?: Record<string, ValueRef<string>>;
  workdir?: ValueRef<string>;
};

@Service("api-hardhat")
export class HardhatScheduler
  extends BaseScheduler
  implements IApiScheduler<"script">
{
  constructor(@Inject(QUEUE_TOKEN) queue: IQueue) {
    super(queue, "hardhat", "onchain");
  }

  script(arg: ScriptRequest) {
    this.schedule("script", [arg.path, arg.account || 1, arg.envs || {}], {
      workdir: arg.workdir,
    });
  }
}
