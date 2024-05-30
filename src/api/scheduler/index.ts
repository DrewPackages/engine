import { ApiMethodContext } from "../types";
import { IQueue } from "../../queue/types";
import { type ScheduleOutput } from "../../state";

export class BaseScheduler implements ApiMethodContext {
  private scheduledCounter: number = 0;
  constructor(
    readonly queue: IQueue,
    readonly group: string,
    readonly defaultStage: string,
    readonly version: number = 1
  ) {}

  private getCallOutputIds(
    method: string,
    outputNames: Array<string>
  ): Array<string> {
    const callTypePrefix = `${this.group}/${this.version}/${method}:${this.scheduledCounter}`;
    this.scheduledCounter += 1;

    return outputNames.map((o) => `${callTypePrefix}:${o}`);
  }

  protected schedule(
    method: string,
    args: Array<any>,
    metadata: object,
    stage?: string,
    outputNames?: Array<string>
  ): Array<ScheduleOutput> {
    const outputs: Array<ScheduleOutput> = outputNames
      ? this.getCallOutputIds(method, outputNames).map((id) => ({
          type: "scheduler-output",
          id,
        }))
      : [];

    this.queue.schedule({
      group: this.group,
      version: this.version,
      method,
      args,
      metadata,
      stage: stage || this.defaultStage,
      outputs,
    });

    return outputs;
  }
}
