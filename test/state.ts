import { IStateStorage, ScheduleOutput } from "../src";

export class TestStorage implements IStateStorage {
  public readonly registered: Set<string> = new Set();

  public readonly resolved: Map<string, any> = new Map();

  registerOutputs(outputs: ScheduleOutput[]) {
    for (let index = 0; index < outputs.length; index++) {
      const output = outputs[index];
      this.registered.add(output.id);
    }
  }

  getOutputValue<T>(outputId: string): T {
    return this.resolved.get(outputId);
  }

  isOutputResolved(outputId: string): boolean {
    return this.resolved.has(outputId);
  }
}
