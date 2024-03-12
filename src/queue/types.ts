import { ApiCall } from "@src/api/types";
import { Token } from "typedi";

export interface IQueue {
  schedule(call: ApiCall): void;
  executionScript(stagesOrder: Array<string>): Array<ApiCall>;
}

export const QUEUE_TOKEN = new Token<IQueue>("QUEUE_TOKEN");
