import { ApiMethodContext } from "../types";
import { IQueue } from "@src/queue/types";

export class BaseScheduler implements ApiMethodContext {
  constructor(
    readonly queue: IQueue,
    readonly group: string,
    readonly defaultStage: string,
    readonly version: number = 1
  ) {}

  protected schedule(
    method: string,
    args: Array<any>,
    metadata: object,
    stage?: string
  ) {
    this.queue.schedule({
      group: this.group,
      version: this.version,
      method,
      args,
      metadata,
      stage: stage || this.defaultStage,
    });
  }
}
