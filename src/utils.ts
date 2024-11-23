import * as crypto from "node:crypto";

/**
 * Generates an SHA-256 hash key for a given input string.
 *
 * @param {string} input - The input string to be hashed.
 * @return {string} - The resulting hash key as a hexadecimal string.
 */
export function generateHashKey(input: string): string {
    const hash: crypto.Hash = crypto.createHash("sha256");
    hash.update(input);
    return hash.digest("hex");
}

/**
 * Verifies if the hash of the provided input matches the stored hash.
 *
 * @param {string} input - The input data to hash and verify.
 * @param {string} storedHash - The previously stored hash to compare against.
 * @return {boolean} - Returns true if the hashed input matches the stored hash, otherwise false.
 */
export function verifyHashKey(input: string, storedHash: string): boolean {
    const inputHash: string = generateHashKey(input);
    return inputHash === storedHash;
}

const performanceStats = new Map<string, { count: number; totalDuration: number }>();

/**
 * Tracks the performance of a Redis command by measuring its execution time and updating performance stats.
 *
 * @param {string} command - The name of the Redis command being tracked.
 * @param {Function} redisCommand - The Redis command to be executed.
 * @param {...any} args - The arguments to be passed to the Redis command.
 * @return {Promise<any>} - A promise that resolves to the result of the Redis command.
 */
export async function trackPerformance(command: string, redisCommand: Function, ...args: any[]): Promise<any> {
    const startTime = Date.now();
    const result = await redisCommand(...args);
    const duration = Date.now() - startTime;

    if (performanceStats.has(command)) {
        const stats = performanceStats.get(command)!;
        stats.count += 1;
        stats.totalDuration += duration;
    } else {
        performanceStats.set(command, { count: 1, totalDuration: duration });
    }

    return result;
}

/**
 * Reset all Redis performance statistics.
 *
 * @return {void} - Reset all performance statistics.
 */
export function resetPerformanceStats(): void {
    performanceStats.clear();
}

/**
 * Logs the performance statistics of all tracked Redis commands to the console.
 *
 * This function prints out the total number of executions, the total duration,
 * and the average duration for each tracked Redis command.
 *
 * @return {void} - Logs the performance statistics to the console.
 */
export function logPerformanceStats(): void {
    if (performanceStats.size === 0) {
        console.log("No performance data available.");
        return;
    }

    console.log("Redis Performance Statistics:");

    performanceStats.forEach((stats, command) => {
        const avgDuration = stats.totalDuration / stats.count;
        console.log(`Command: ${command}`);
        console.log(`  Executions: ${stats.count}`);
        console.log(`  Total Duration: ${stats.totalDuration} ms`);
        console.log(`  Average Duration: ${avgDuration.toFixed(3)} ms`);
        console.log("--------------------------------------------");
    });
}