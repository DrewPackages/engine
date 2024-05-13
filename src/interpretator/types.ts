export type StageInstruction = {
  workdir: string;
  image: string;
  cmd: Array<string>;
  envs: Record<string, string>;
};
