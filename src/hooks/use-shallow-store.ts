import { shallow } from "zustand/shallow";

/**
 * Custom equality function for Zustand that handles Set comparisons
 * and performs shallow equality check for objects
 */
export function shallowWithSets<T>(a: T, b: T): boolean {
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (const item of a) {
      if (!b.has(item)) return false;
    }
    return true;
  }
  return shallow(a, b);
}

/**
 * Pick specific keys from a Zustand store state with shallow comparison
 * Usage: const { viewMode, sortBy } = useDocumentStore(pick(['viewMode', 'sortBy']))
 */
export function pick<T extends object, K extends keyof T>(keys: K[]) {
  return (state: T): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
      result[key] = state[key];
    }
    return result;
  };
}
