import { IQueue, QUEUE_TOKEN } from "../../queue/types";
import { IApiScheduler } from "../types";
import { BaseScheduler } from "../scheduler";
import { Inject, Service } from "typedi";
import { ScheduleOutput } from "../../state";
import { ValueRef } from "../../interpretator";

type SignRequest = {
  msg: ValueRef<string>;
  account?: number;
};

@Service("api-foundry")
export class FoundryScheduler
  extends BaseScheduler
  implements IApiScheduler<"sign">
{
  constructor(@Inject(QUEUE_TOKEN) queue: IQueue) {
    super(queue, "foundry", "onchain");
  }

  sign(arg: SignRequest): ScheduleOutput {
    const [signatureOutput] = this.schedule(
      "sign",
      [arg.msg, arg.account || 1],
      {},
      "preparements",
      ["signature"]
    );

    return signatureOutput;
  }
}
