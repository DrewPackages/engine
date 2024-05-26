import { Token } from "typedi";
import { IConfigProvider } from "./resolve";
import { CommonConfig } from "./common";

export const ENVIRONMENT_RESOLVER_TOKEN = new Token("ENVIRONMENT_RESOLVER");
export const CONFIG_RESOLVER_TOKEN = new Token<IConfigProvider<CommonConfig>>(
  "CONFIG_RESOLVER"
);
