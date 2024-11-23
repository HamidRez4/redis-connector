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

RedisConnector.isReady = () => {
    return redisConnection.status === 'ready';
};

RedisConnector.ping = async () => {
    return trackPerformance('PING', redisConnection.ping.bind(redisConnection));
};

RedisConnector.getInfo = async () => {
    return trackPerformance('INFO', redisConnection.info.bind(redisConnection));
};

RedisConnector.getAllKeys = async () => {
    return trackPerformance('GET_ALL_KEYS', redisConnection.keys.bind(redisConnection), '*');
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
    return trackPerformance('GET', redisConnection.get.bind(redisConnection), key);
};

RedisConnector.set = async (key: string, value: string) => {
    return trackPerformance('SET', redisConnection.set.bind(redisConnection), key, value);
};

RedisConnector.delete = async (key: string) => {
    return trackPerformance('DELETE', redisConnection.del.bind(redisConnection), key);
};

RedisConnector.flushAll = async () => {
    return trackPerformance('FLUSH_ALL', redisConnection.flushall.bind(redisConnection));
};

RedisConnector.listLength = async (listKey: string) => {
    return trackPerformance('LIST_LENGTH', redisConnection.llen.bind(redisConnection), listKey);
};

RedisConnector.listPush = async (listKey: string, value: string) => {
    return trackPerformance(
        'LIST_PUSH',
        redisConnection.rpush.bind(redisConnection),
        listKey,
        value,
    );
};

RedisConnector.listPop = async (listKey: string) => {
    return trackPerformance('LIST_POP', redisConnection.rpop.bind(redisConnection), listKey);
};

RedisConnector.hset = async (hashKey: string, field: string, value: string) => {
    return trackPerformance(
        'HSET',
        redisConnection.hset.bind(redisConnection),
        hashKey,
        field,
        value,
    );
};

RedisConnector.hget = async (hashKey: string, field: string) => {
    return trackPerformance('HGET', redisConnection.hget.bind(redisConnection), hashKey, field);
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

export { RedisExports };
