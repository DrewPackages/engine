import { Token } from "typedi";
import { BaseConfigResolver } from "./resolve";
import { EvmConfig } from "./evm";

export const ENVIRONMENT_RESOLVER_TOKEN = new Token("ENVIRONMENT_RESOLVER");
export const CONFIG_RESOLVER_TOKEN = new Token<BaseConfigResolver<EvmConfig>>(
  "CONFIG_RESOLVER"
);
