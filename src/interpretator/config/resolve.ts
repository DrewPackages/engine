import { ConfigStorage } from "./config-storage";
import { CommonConfig } from "./common/type";
import { Container } from "typedi";
import { CONFIG_RESOLVER_TOKEN } from "./constants";

export interface IEnvironmentResolver {
  getEnv(name: string): Promise<string>;
  getEnvBatch(...names: Array<string>): Promise<Record<string, string>>;
}

export interface IConfigProvider<T extends CommonConfig> {
  resolve(): Promise<T>;
}

export abstract class BaseConfigResolver<T extends CommonConfig>
  implements IConfigProvider<T>
{
  constructor(
    public readonly group: string,
    private readonly storage: ConfigStorage
  ) {}

  abstract readConfig(): Promise<T>;

  async resolve(): Promise<T> {
    const config = await this.readConfig();

    this.storage.set(this.group, config);

    return config;
  }
}

export async function resolveConfigs() {
  const resolvers = Container.getMany(CONFIG_RESOLVER_TOKEN);

  await Promise.all(resolvers.map((r) => r.resolve()));
}
