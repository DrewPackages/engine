export type StageInstruction = {
  type: "task" | "offchain";
  workdir: string;
  image: string;
  cmd: Array<string>;
  envs: Record<string, string>;
};
