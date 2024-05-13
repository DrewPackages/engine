import { CommonConfig } from "./type";

export interface IEnvironmentResolver {
  getEnv(name: string): Promise<string>;
  getEnvBatch(...names: Array<string>): Promise<Record<string, string>>;
}

export interface IConfigProvider<T extends CommonConfig> {
  resolve(): Promise<T>;
}
