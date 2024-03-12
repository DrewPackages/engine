import { ApiCall } from "@src/api/types";
import { IQueue, QUEUE_TOKEN } from "./types";
import { UnknownStageError } from "@src/errors/index";
import { Service } from "typedi";

function checkStages(items: Array<ApiCall>, stages: Array<string>) {
  for (let callIndex = 0; callIndex < items.length; callIndex++) {
    const call = items[callIndex];

    if (!stages.includes(call.stage)) {
      throw new UnknownStageError(call.stage);
    }
  }
}

function sortStages(
  items: Array<ApiCall>,
  stages: Array<string>
): Array<ApiCall> {
  const result: Array<ApiCall> = [];

  for (let stageNum = 0; stageNum < stages.length; stageNum++) {
    const stage = stages[stageNum];

    for (let callIndex = 0; callIndex < items.length; callIndex++) {
      const call = items[callIndex];

      if (call.stage === stage) {
        result.push(call);
      }
    }
  }

  return result;
}

@Service(QUEUE_TOKEN)
export class QueueImpl implements IQueue {
  private items: Array<ApiCall> = [];

  schedule(call: ApiCall) {
    this.items.push(call);
  }

  executionScript(stagesOrder: Array<string>): ApiCall[] {
    checkStages(this.items, stagesOrder);
    return sortStages(this.items, stagesOrder);
  }
}
