import { Redis } from 'ioredis';
import {
    redisDebugMode,
    redisHost,
    redisPassword,
    redisPort,
    redisUser,
    redisUseSsl,
} from './config.ts';
import { generateHashKey, logPerformanceStats, trackPerformance, verifyHashKey } from './utils.ts';

const RedisConnector: Record<string, Function> = {};

let redisConnection: Redis;

if (!redisUseSsl) {
    redisConnection = new Redis({
        host: redisHost,
        port: redisPort,
        username: redisUser === '' ? undefined : redisUser,
        password: redisPassword,
    });
} else {
    redisConnection = new Redis({
        host: redisHost,
        port: redisPort,
        username: redisUser === '' ? undefined : redisUser,
        password: redisPassword,
        tls: {
            rejectUnauthorized: true,
        },
    });
}

redisConnection.on('connect', () => {
    console.log('Redis connection established.');
});

redisConnection.on('error', (err: Error) => {
    console.error('⚠️ Redis connection error:', err);
});

redisConnection.on('ready', async () => {
    const info = await redisConnection.info();
    const versionMatch = info.match(/redis_version:(\d+\.\d+\.\d+)/);
    const redisVersion = versionMatch ? versionMatch[1] : 'unknown';

    console.log(`[Redis-${redisVersion}] Redis is ready. ✅`);

    if (redisDebugMode) {
        console.log(`Ping response: ${await redisConnection.ping()}. 🔍`);
    }
});

RedisConnector.ping = async () => {
    return trackPerformance('PING', () => redisConnection.ping());
};

RedisConnector.getInfo = async () => {
    return trackPerformance('GET_INFO', () => redisConnection.info());
};

RedisConnector.getAllKeys = async () => {
    return trackPerformance('GET_ALL_KEYS', () => redisConnection.keys('*'));
};

RedisConnector.getAll = async () => {
    return trackPerformance('GET_ALL', async () => {
        const keys = await redisConnection.keys('*');
        return await Promise.all(
            keys.map(async (key: any) => {
                return { [key]: await redisConnection.get(key) };
            }),
        );
    });
};

RedisConnector.get = async (key: string) => {
    return trackPerformance('GET', () => {
        return redisConnection.get(key);
    });
};

RedisConnector.set = async (key: string, value: string) => {
    return trackPerformance('SET', () => redisConnection.set(key, value));
};

RedisConnector.delete = async (key: string) => {
    return trackPerformance('DELETE', () => redisConnection.del(key));
};

RedisConnector.flushAll = async () => {
    return trackPerformance('FLUSH_ALL', () => redisConnection.flushall());
};

RedisConnector.listLength = async (listKey: string) => {
    return trackPerformance('LIST_LENGTH', () => redisConnection.llen(listKey));
};

RedisConnector.listPush = async (listKey: string, value: string) => {
    return trackPerformance('LIST_PUSH', () => redisConnection.rpush(listKey, value));
};

RedisConnector.listPop = async (listKey: string) => {
    return trackPerformance('LIST_POP', () => redisConnection.rpop(listKey));
};

RedisConnector.hset = async (hashKey: string, field: string, value: string) => {
    return trackPerformance('HSET', () => redisConnection.hset(hashKey, field, value));
};

RedisConnector.hget = async (hashKey: string, field: string) => {
    return trackPerformance('HGET', () => redisConnection.hget(hashKey, field));
};

RegisterCommand(
    'redis_stats',
    (source: number) => {
        if (source === 0) {
            logPerformanceStats();
        }
    },
    true,
);

const RedisExports = {
    isReady: RedisConnector.isReady,
    ping: RedisConnector.ping,
    getInfo: RedisConnector.getInfo,
    getAllKeys: RedisConnector.getAllKeys,
    getAll: RedisConnector.getAll,
    get: RedisConnector.get,
    set: RedisConnector.set,
    delete: RedisConnector.delete,
    flushAll: RedisConnector.flushAll,
    listLength: RedisConnector.listLength,
    listPush: RedisConnector.listPush,
    listPop: RedisConnector.listPop,
    hset: RedisConnector.hset,
    hget: RedisConnector.hget,
    generateHashKey: generateHashKey,
    verifyHashKey: verifyHashKey,
};

for (const [key, value] of Object.entries(RedisExports)) {
    if (typeof value === 'function') {
        console.log(`Exporting function: ${key} with value ${value}`);
        exports(key, value);
    } else {
        console.warn(`Skipping non-function export: ${key}`);
    }
}