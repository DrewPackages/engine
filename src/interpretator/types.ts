import { ConfigRef } from "../params/config-refs";
import { ScheduleOutput } from "../state";

type TaskStageInstruction = {
  type: "task";
  workdir: string;
  image: string;
  cmd: Array<string>;
  envs: Record<string, string>;
  outputIds: Array<string>;
};

type OffchainStageInstruction = {
  type: "offchain";
  workdir: string;
  image: string;
  cmd: Array<string>;
  envs: Record<string, string>;
  dind?: boolean;
};

export type StageInstruction = TaskStageInstruction | OffchainStageInstruction;

export type ValueRef<T> = T | ConfigRef | ScheduleOutput;
