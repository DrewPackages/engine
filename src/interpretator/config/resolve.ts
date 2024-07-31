import { IConfigStorage } from "./config-storage";
import { EvmConfig } from "./evm/type";
import { Container } from "typedi";
import { CONFIG_RESOLVER_TOKEN } from "./constants";

export interface IEnvironmentResolver {
  getEnv(name: string): Promise<string>;
  getEnvBatch(...names: Array<string>): Promise<Record<string, string>>;
}

export interface IConfigProvider<T extends EvmConfig> {
  resolve(): Promise<T>;
}

export abstract class BaseConfigResolver<T extends EvmConfig>
  implements IConfigProvider<T>
{
  constructor(
    public readonly group: string,
    private readonly storage: IConfigStorage
  ) {}

  abstract readConfig(): Promise<T>;

  async resolve(): Promise<T> {
    const config = await this.readConfig();

    this.storage.set(this.group, config);

    return config;
  }
}

export async function resolveConfigs(requiredConfigGroups: Set<string>) {
  const resolvers = Container.getMany(CONFIG_RESOLVER_TOKEN);

  await Promise.all(
    resolvers.map((r) => {
      if (requiredConfigGroups.has(r.group)) {
        return r.resolve();
      }
    })
  );
}
