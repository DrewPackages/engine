import { ConfigRef } from "./config-refs";

export function addConfigs(params: object): object {
  function getConfigRef(group: string, key: string): () => ConfigRef {
    return () => new ConfigRef(group, key);
  }

  return {
    ...params,
    config: new Proxy(
      {},
      {
        get(_, group: string) {
          return new Proxy(
            {},
            {
              get(_, configKey: string) {
                return getConfigRef(group, configKey);
              },
            }
          );
        },
      }
    ),
  };
}
