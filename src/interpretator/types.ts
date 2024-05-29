type TaskStageInstruction = {
  type: "task";
  workdir: string;
  image: string;
  cmd: Array<string>;
  envs: Record<string, string>;
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
