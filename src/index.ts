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

function executeCallback(callback?: Function, ...args: any[]) {
    if (callback && typeof callback === 'function') {
        callback(...args);
    }
}

RedisConnector.ping = async (callback?: Function) => {
    const result = await trackPerformance('PING', () => redisConnection.ping());
    executeCallback(callback, result);
};

RedisConnector.getInfo = async (callback?: Function) => {
    const result = await trackPerformance('GET_INFO', () => redisConnection.info());
    executeCallback(callback, result);
};

RedisConnector.getAllKeys = async (callback?: Function) => {
    const result = await trackPerformance('GET_ALL_KEYS', () => redisConnection.keys('*'));
    executeCallback(callback, result);
};

RedisConnector.getAll = async (callback?: Function) => {
    const result = await trackPerformance('GET_ALL', async () => {
        const keys = await redisConnection.keys('*');
        return await Promise.all(
            keys.map(async (key: any) => {
                return { [key]: await redisConnection.get(key) };
            }),
        );
    });

    executeCallback(callback, result);
};

RedisConnector.get = async (key: string, callback?: Function) => {
    const result = await trackPerformance('GET', () => redisConnection.get(key));
    executeCallback(callback, result);
};

RedisConnector.set = async (key: string, value: string, callback?: Function) => {
    const result = await trackPerformance('SET', () => redisConnection.set(key, value));
    executeCallback(callback, result);
};

RedisConnector.delete = async (key: string, callback?: Function) => {
    const result = await trackPerformance('DELETE', () => redisConnection.del(key));
    executeCallback(callback, result);
};

RedisConnector.flushAll = async (callback?: Function) => {
    const result = await trackPerformance('FLUSH_ALL', () => redisConnection.flushall());
    executeCallback(callback, result);
};

RedisConnector.listLength = async (listKey: string, callback?: Function) => {
    const result = await trackPerformance('LIST_LENGTH', () => redisConnection.llen(listKey));
    executeCallback(callback, result);
};

RedisConnector.listPush = async (listKey: string, value: string, callback?: Function) => {
    const result = await trackPerformance('LIST_PUSH', () => redisConnection.rpush(listKey, value));
    executeCallback(callback, result);
};

RedisConnector.listPop = async (listKey: string, callback?: Function) => {
    const result = await trackPerformance('LIST_POP', () => redisConnection.rpop(listKey));
    executeCallback(callback, result);
};

RedisConnector.hset = async (hashKey: string, field: string, value: string, callback?: Function) => {
    const result = await trackPerformance('HSET', () => redisConnection.hset(hashKey, field, value));
    executeCallback(callback, result);
};

RedisConnector.hget = async (hashKey: string, field: string, callback?: Function) => {
    const result = await trackPerformance('HGET', () => redisConnection.hget(hashKey, field));
    executeCallback(callback, result);
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