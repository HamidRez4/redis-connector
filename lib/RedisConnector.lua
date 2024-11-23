local RedisConnector = {}

function RedisConnector.isReady(callback)
    exports['redis-connector']:isReady(callback)
end

function RedisConnector.ping(callback)
    exports['redis-connector']:ping(callback)
end

function RedisConnector.getInfo(callback)
    exports['redis-connector']:getInfo(callback)
end

function RedisConnector.getAllKeys(callback)
    exports['redis-connector']:getAllKeys(callback)
end

function RedisConnector.getAll(callback)
    exports['redis-connector']:getAll(callback)
end

function RedisConnector.get(key, callback)
    exports['redis-connector']:get(key, callback)
end

function RedisConnector.set(key, value, callback)
    local stringValue

    if type(value) == "string" then
        stringValue = value
    elseif type(value) == "number" or type(value) == "boolean" then
        stringValue = tostring(value)
    elseif type(value) == "table" then
        local success, jsonValue = pcall(function()
            return json.encode(value)
        end)

        if success then
            stringValue = jsonValue
        else
            print("Error: Unable to convert table to JSON.")
            if callback then
                callback(false)
            end
            return
        end
    else
        print("Error: Data Type '" + type(value) + "' unsupported")
        if callback then
            callback(false)
        end
        return
    end

    exports['redis-connector']:set(key, value, callback)
end

function RedisConnector.delete(key, callback)
    exports['redis-connector']:delete(key, callback)
end

function RedisConnector.flushAll(callback)
    exports['redis-connector']:flushAll(callback)
end

function RedisConnector.listLength(listKey, callback)
    exports['redis-connector']:listLength(listKey, callback)
end

function RedisConnector.listPush(listKey, value, callback)
    local stringValue

    if type(value) == "string" then
        stringValue = value
    elseif type(value) == "number" or type(value) == "boolean" then
        stringValue = tostring(value)
    elseif type(value) == "table" then
        local success, jsonValue = pcall(function()
            return json.encode(value)
        end)

        if success then
            stringValue = jsonValue
        else
            print("Error: Unable to convert table to JSON.")
            if callback then
                callback(false)
            end
            return
        end
    else
        print("Error: Data Type '" .. type(value) .. "' unsupported")
        if callback then
            callback(false)
        end
        return
    end

    exports['redis-connector']:listPush(listKey, stringValue, callback)
end

function RedisConnector.listPop(listKey, callback)
    exports['redis-connector']:listPop(listKey, callback)
end

function RedisConnector.hset(hashKey, field, value, callback)
    local stringValue

    if type(value) == "string" then
        stringValue = value
    elseif type(value) == "number" or type(value) == "boolean" then
        stringValue = tostring(value)
    elseif type(value) == "table" then
        local success, jsonValue = pcall(function()
            return json.encode(value)
        end)

        if success then
            stringValue = jsonValue
        else
            print("Error: Unable to convert table to JSON.")
            if callback then
                callback(false)
            end
            return
        end
    else
        print("Error: Data Type '" .. type(value) .. "' unsupported")
        if callback then
            callback(false)
        end
        return
    end

    exports['redis-connector']:hset(hashKey, field, stringValue, callback)
end

function RedisConnector.hget(hashKey, field, callback)
    exports['redis-connector']:hget(hashKey, field, callback)
end

function RedisConnector.generateHashKey(input, callback)
    if type(input) ~= "string" then
        print("Error: Data Type '" .. type(input) .. "' unsupported for generateHashKey function")
        return
    end

    exports['redis-connector']:generateHashKey(input, callback)
end

function RedisConnector.verifyHashKey(input, storedHash, callback)
    if type(input) ~= "string" or type(storedHash) ~= "string" then
        print("Error: Data Type '" .. type(value) .. "' unsupported for generateHashKey function")
        return
    end

    exports['redis-connector']:verifyHashKey(input, storedHash, callback)
end

_ENV.RedisConnector = RedisConnector