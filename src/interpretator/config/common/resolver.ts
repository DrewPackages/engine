import { BaseConfigResolver, IEnvironmentResolver } from "../resolve";
import { CommonConfig } from "./type";
import { Inject, Service } from "typedi";
import {
  CONFIG_RESOLVER_TOKEN,
  ENVIRONMENT_RESOLVER_TOKEN,
} from "../constants";
import { ConfigStorage } from "../config-storage";

@Service(CONFIG_RESOLVER_TOKEN)
export class CommonConfigResolver extends BaseConfigResolver<CommonConfig> {
  constructor(
    @Inject(ENVIRONMENT_RESOLVER_TOKEN)
    private readonly env: IEnvironmentResolver,
    @Inject()
    storage: ConfigStorage
  ) {
    super("common", storage);
  }

  async readConfig(): Promise<CommonConfig> {
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
