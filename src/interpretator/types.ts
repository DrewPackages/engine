import { ConfigRef } from "../params/config-refs";
import { ScheduleOutput } from "../state";

export type TaskStageInstruction = {
  type: "task";
  interactive?: boolean;
};

export type OffchainStageInstruction = {
  type: "offchain";
  dind?: boolean;
};

export type StageInstructionCommon = {
  workdir: ValueOrOutput<string>;
  image: string;
  cmd: Array<ValueOrOutput<string>>;
  envs: Record<string, ValueOrOutput<string>>;
  outputs: Array<Pick<ScheduleOutput, "id" | "extract">>;
};

export type StageInstruction = (
  | TaskStageInstruction
  | OffchainStageInstruction
) &
  StageInstructionCommon;

export type ValueRef<T> = T | ConfigRef | ScheduleOutput;

export type ValueOrOutput<T> = T | ScheduleOutput;
