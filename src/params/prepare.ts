import { ConfigRef } from "./config-refs";

export function addConfigs(params: object): object {
  function getConfigRef(group: string, key: string): () => ConfigRef {
    return () => new ConfigRef(group, key);
  }

  return {
    ...params,
    config: {
      common: {
        rpcUrl: getConfigRef("common", "rpcUrl"),
        privateKey: getConfigRef("common", "privateKey"),
      },
    },
  };
}
