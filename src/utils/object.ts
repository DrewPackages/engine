import { ConfigRef, isConfigRef } from "../params/config-refs";

export function findManyDeep<T>(
  root: any,
  predicate: (obj: any) => obj is T,
  searchInMatches?: boolean
): Array<T> {
  const result = [];
  if (root != null) {
    if (predicate(root)) {
      return [root];
    }

    if (typeof root === "object") {
      Object.entries(root).forEach(([_, value]) => {
        if (predicate(value)) {
          result.push(value);
          if (searchInMatches) {
            result.push(...findManyDeep(value, predicate, searchInMatches));
          }
        } else {
          result.push(...findManyDeep(value, predicate, searchInMatches));
        }
      });
    }
  }
  return result;
}

export function findConfigRefsDeep(root: any): Array<ConfigRef> {
  return findManyDeep(root, isConfigRef, false);
}
