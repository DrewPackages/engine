import { Inject, Service } from "typedi";
import {
  CommonConfig,
  ENVIRONMENT_RESOLVER_TOKEN,
  IConfigProvider,
  IEnvironmentResolver,
} from "../config";

export interface HardhatConfig extends CommonConfig {}

export const HARDHAT_CONFIG_PROVIDER_TOKEN = "config-hardhat";

@Service(HARDHAT_CONFIG_PROVIDER_TOKEN)
export class HardhatConfigProvider implements IConfigProvider<HardhatConfig> {
  constructor(
    @Inject(ENVIRONMENT_RESOLVER_TOKEN)
    private readonly env: IEnvironmentResolver
  ) {}

  async resolve(): Promise<HardhatConfig> {
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
