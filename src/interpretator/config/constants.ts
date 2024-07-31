import { Token } from "typedi";
import { BaseConfigResolver } from "./resolve";
import { EvmConfig } from "./evm";
import { IConfigStorage } from "./config-storage";

export const ENVIRONMENT_RESOLVER_TOKEN = new Token("ENVIRONMENT_RESOLVER");
export const CONFIG_RESOLVER_TOKEN = new Token<BaseConfigResolver<EvmConfig>>(
  "CONFIG_RESOLVER"
);
export const CONFIG_STORAGE_TOKEN = new Token<IConfigStorage>(
  "CONFIG_STORAGE_TOKEN"
);
