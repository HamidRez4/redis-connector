<h1 style="text-align: center;">Redis-Connector</h1>

<p style="text-align: center; font-style: italic;">
  <i>🔥 A Simple Redis connector for FiveM 🎮</i>
</p>

<p style="text-align: center;">
  <img src="https://img.shields.io/github/license/Purpose-Dev/redis-connector" alt="License" />
  <img src="https://img.shields.io/github/tag/Purpose-Dev/redis-connector" alt="Version" />
  <img src="https://img.shields.io/github/last-commit/Purpose-Dev/redis-connector" alt="Last Commit" />
  <a href="https://discord.gg/Rah7Bt4TeJ">
    <img src="https://img.shields.io/discord/1273215892238372895.svg" alt="Join our Discord" />
  </a>
</p>

---

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Configuration](#configuration)
4. [Usage](#usage)
    - [Using Exports](#using-exports)
    - [Using the Library](#using-the-library)
5. [Performance Metrics](#performance-metrics)
6. [Todos](#todo) 
7. [Development Guidelines](#development-guidelines)
8. [License](#license)

---

## Introduction

**Redis-Connector** is a **FiveM** server resource that simplifies integration with **Redis**, enabling seamless
interaction between your FiveM server and a Redis database.

With **Redis-Connector**, you can:

- Manage keys, lists, hashes, and other Redis data structures.
- Monitor and optimize performance using built-in metrics.
- Ensure a modular, high-performance setup for modern server-side scripts.

---

## Prerequisites

To use **Redis-Connector**, you need:

- A **FiveM Server** to host and run the resource.
- A **Redis Server** (local or remote), with or without TLS support.

---

## Configuration

To connect your FiveM server to Redis, configure the required connection details in your **`server.cfg`** file.

### Example Configuration:

```cfg
set redis_host "your_redis_host"      # Default: 127.0.0.1
set redis_port 6379                   # Default: 6379
set redis_user "your_username"        # Default: Empty
set redis_password "your_password"    # Default: Empty
set redis_debug_mode true             # Enable detailed logging (true/false)
set redis_use_ssl true                # Enable SSL/TLS (true/false)
```

> **Note:** Update these values to match your Redis server setup. For instance, use `127.0.0.1` for a local Redis
> instance or your cloud provider's hostname for a remote instance.

---

## Usage

You can interact with **Redis-Connector** using:

1. **Exports** (recommended for quick integration).
2. **Library Integration** (ideal for structured projects).

---

### Using Exports

Use exports directly in your Lua scripts to call Redis commands.

#### Example:

```lua
local response = exports["redis-connector"]:ping()
print("Ping response:", response)
```

---

### Using the Library

For larger projects, use the pre-built **`RedisConnector`** library for structured access to Redis methods.

#### Step 1: Import the Library in `fxmanifest.lua`:

```lua
server_scripts {
    "@redis-connector/lib/RedisConnector.lua",
    ...
}
```

#### Step 2: Call RedisConnector Methods:

```lua
RedisConnector.ping(function(response)
    print("Ping response:", response)
end)

RedisConnector.set("exampleKey", "exampleValue", function(success)
    if success then
        print("Key set successfully!")
    else
        print("Failed to set key.")
    end
end)
```

> **Pro Tip:** The library handles common data types like strings, numbers, booleans, and even JSON-encoded tables for
> seamless storage and retrieval.

---

## Performance Metrics

### Command: `redis_stats`

Track Redis performance directly from the console using the `redis_stats` command. It provides the following metrics:

- **Command Name** (e.g., `Ping`, `Set`, `Get`).
- **Execution Count**: Total number of times the command has been executed.
- **Total Duration**: Cumulative time spent on the command.
- **Average Duration**: Average time taken per execution.

This data helps you monitor and optimize Redis usage on your server.

---

## Todo

- **Connection Pool Support** (Implement a connection pool to manage Redis connections more efficiently, especially under high load conditions.)
- **Auto Reconnect Logic** (Implement automatic reconnection logic for Redis server disconnections or network failures.)
- **Configuration Validation** (Implement automatic validation of the Redis connection settings to catch potential misconfigurations early.)
- **Caching Layer** (Add an optional caching layer to store common queries locally, reducing Redis load and improving performance.)
- **Rate Limiting** (Add functionality for rate-limiting Redis requests to prevent abuse or accidental overloading.)
- **Improve Error Handling** (Enhance error handling for various failure cases, including Redis connection failures, timeouts, and invalid data.)
- **TLS/SSL Configuration Enhancements** (Improve the TLS/SSL setup to allow easier configuration and support for more advanced use cases.)

---

## Development Guidelines

Contributing to **Redis-Connector** is simple and open to the community. Follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Purpose-Dev/redis-connector.git
   cd redis-connector
   ```

2. **Create a New Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Implement and Test**:
   Add your features or fixes and thoroughly test them locally.

4. **Submit a Pull Request**:
   Push your branch and create a pull request. Include a clear, descriptive summary of your changes.

---

## License

This project is released under the **MIT License**. For more information, see the [LICENSE](./LICENSE) file.

---

### Quick Links:

- [Official Redis Documentation](https://redis.io/documentation)
- [FiveM Server Documentation](https://docs.fivem.net/)

**Redis-Connector**: Simplifying Redis integration for your FiveM server! 🚀

--- 
