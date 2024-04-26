import { IQueue, QUEUE_TOKEN } from "../../queue/types";
import { IApiScheduler } from "../types";
import { BaseScheduler } from "../scheduler";
import { Inject, Service } from "typedi";

export type ScriptRequest = {
  path: string;
  account?: number;
  envs?: Record<string, string>;
  workdir?: string;
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
