import { ApiMethodContext, OutputInfo } from "../types";
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
    outputNames: Array<OutputInfo>
  ): Array<Omit<OutputInfo, "name"> & { id: string }> {
    const callTypePrefix = `${this.group}/${this.version}/${method}:${this.scheduledCounter}`;
    this.scheduledCounter += 1;

    return outputNames.map(({ name, ...o }) => ({
      id: `${callTypePrefix}:${name}`,
      ...o,
    }));
  }

  protected schedule(
    method: string,
    args: Array<any>,
    metadata: object,
    stage?: string,
    outputNames?: Array<OutputInfo>
  ): Array<ScheduleOutput> {
    const outputs: Array<ScheduleOutput> = outputNames
      ? this.getCallOutputIds(method, outputNames).map((o) => ({
          type: "scheduler-output",
          ...o,
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
