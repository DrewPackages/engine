import { BaseConfigResolver, IEnvironmentResolver } from "../resolve";
import { EvmConfig } from "./type";
import { Inject, Service } from "typedi";
import {
  CONFIG_RESOLVER_TOKEN,
  CONFIG_STORAGE_TOKEN,
  ENVIRONMENT_RESOLVER_TOKEN,
} from "../constants";
import { IConfigStorage } from "../config-storage";

@Service(CONFIG_RESOLVER_TOKEN)
export class EvmConfigResolver extends BaseConfigResolver<EvmConfig> {
  constructor(
    @Inject(ENVIRONMENT_RESOLVER_TOKEN)
    private readonly env: IEnvironmentResolver,
    @Inject(CONFIG_STORAGE_TOKEN)
    storage: IConfigStorage
  ) {
    super("evm", storage);
  }

  async readConfig(): Promise<EvmConfig> {
    const { RPC_URL, PRIVATE_KEY } = await this.env.getEnvBatch(
      "RPC_URL",
      "PRIVATE_KEY"
    );

    return {
      privateKey: PRIVATE_KEY,
      rpcUrl: RPC_URL,
    };
  }
}
