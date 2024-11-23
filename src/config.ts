/**
 * @fileoverview Configuration of Redis connection for FiveM server.
 * This configuration allows you to retrieve Redis parameters defined in the FiveM server using
 * `GetConvar`, `GetConvarInt`, and `GetConvarBool`.
 */

/**
 * Host address of redis server
 * @type {string}
 * @default "127.0.0.1"
 */
export const redisHost: string = GetConvar('redis_host', '127.0.0.1');

/**
 * Port of redis server
 * @type {number}
 * @default 6379
 */
export const redisPort: number = GetConvarInt('redis_port', 6379);

/**
 * The username for the Redis connection. If not defined, no user is provided
 * @type {string}
 * @default ''
 */
export const redisUser: string = GetConvar('redis_user', '');

/**
 * Password for Redis connection. If not set, no password is used
 * @type {string}
 * @default ''
 */
export const redisPassword: string = GetConvar('redis_password', '');

/**
 * Whether Redis debug mode is enabled.
 * @type {boolean}
 * @default false
 */
export const redisDebugMode: boolean = GetConvarBool('redis_debug_mode', false);

/**
 * Whether Redis ssl mode is enabled.
 * @type {boolean}
 * @default false
 */
export const redisUseSsl: boolean = GetConvarBool('redis_use_ssl', false);
