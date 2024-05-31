import { ConfigRef } from "../params/config-refs";
import { ScheduleOutput } from "../state";

type TaskStageInstruction = {
  type: "task";
  workdir: ValueOrOutput<string>;
  image: string;
  cmd: Array<ValueOrOutput<string>>;
  envs: Record<string, ValueOrOutput<string>>;
  outputs: Array<Pick<ScheduleOutput, "id" | "extract">>;
};

type OffchainStageInstruction = {
  type: "offchain";
  workdir: ValueOrOutput<string>;
  image: string;
  cmd: Array<ValueOrOutput<string>>;
  envs: Record<string, ValueOrOutput<string>>;
  dind?: boolean;
};

export type StageInstruction = TaskStageInstruction | OffchainStageInstruction;

export type ValueRef<T> = T | ConfigRef | ScheduleOutput;

export type ValueOrOutput<T> = T | ScheduleOutput;
