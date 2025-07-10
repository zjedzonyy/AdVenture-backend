// Ensures correct incrementation of viewCount

const ViewsCache = () => {
  const cache = new Map();
  const ttl = 30000; // 30s

  //   Cleanup every 5 minutes
  setInterval(() => cleanup(), 5 * 60 * 1000);

  const shouldTrackView = (userKey) => {
    const now = Date.now();
    const lastView = cache.get(userKey);

    if (!lastView || now - lastView > ttl) {
      cache.set(userKey, now);
      return true;
    }
    return false;
  };

  const cleanup = () => {
    const now = Date.now();
    for (const [key, timestamp] of cache.entries()) {
      if (now - timestamp > ttl) {
        cache.delete(key);
      }
    }
  };

  return {
    shouldTrackView,
    cleanup,
  };
};

const viewsCache = ViewsCache();
module.exports = viewsCache;
