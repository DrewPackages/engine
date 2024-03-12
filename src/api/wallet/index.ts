import { IQueue, QUEUE_TOKEN } from "@src/queue/types";
import { IApiScheduler } from "../types";
import { BaseScheduler } from "../scheduler";
import { Inject, Service } from "typedi";

type SignRequest = {
  msg: string;
  account?: number;
};

@Service("api-wallet")
export class WalletScheduler
  extends BaseScheduler
  implements IApiScheduler<"sign">
{
  constructor(@Inject(QUEUE_TOKEN) queue: IQueue) {
    super(queue, "wallet", "onchain");
  }

  sign(arg: SignRequest) {
    this.schedule("sign", [arg.msg, arg.account || 1], {}, "preparements");
  }
}
