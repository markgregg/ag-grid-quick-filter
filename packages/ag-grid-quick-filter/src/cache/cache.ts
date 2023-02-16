import { OptionType } from '../types/optionType';

type CacheEntry = {
  created: Date;
  items: OptionType[];
};

export interface Cache {
  itemCache: Map<string, CacheEntry>;
  getCachedItems: (text: string) => OptionType[] | undefined;
  cacheItems: (text: string, items: OptionType[]) => void;
  dispose: () => void;
}

const cacheMap = new Map<string, Cache>();

export const createCache = (
  id: string,
  timeToLive?: number,
  delay?: number
): Cache => {
  //check if cache already exists and return
  const existingCache = cacheMap.get(id);
  if (existingCache) {
    return existingCache;
  }

  //create new map to store items
  const itemCache = new Map<string, CacheEntry>();

  //create expiry check
  const checkCacheEntries = (timeToLive: number) => {
    const expiryTime = new Date(Date.now());
    expiryTime.setSeconds(expiryTime.getSeconds() - timeToLive);

    Array.from(itemCache)
      .filter((kvp) => kvp[1].created < expiryTime)
      .forEach((kvp) => itemCache.delete(kvp[0]));
  };

  //run expiry check on specified interval or default to every 5 minutes
  const expireCacheItemsTimerId = timeToLive
    ? setInterval(
        checkCacheEntries,
        delay ? delay * 1000 : 5 * 60 * 1000,
        timeToLive
      )
    : undefined;

  //create cache
  const cache = {
    itemCache,
    getCachedItems: (text: string): OptionType[] | undefined => {
      return itemCache.get(text)?.items;
    },
    cacheItems: (text: string, items: OptionType[]) => {
      itemCache.set(text, { created: new Date(Date.now()), items });
    },
    dispose: () => {
      if (expireCacheItemsTimerId) {
        clearInterval(expireCacheItemsTimerId);
      }
      itemCache.clear();
    },
  };
  cacheMap.set(id, cache);
  return cache;
};
