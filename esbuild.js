import { build } from 'esbuild';
import { readFileSync, writeFileSync } from "fs";

const jsonPackage = JSON.parse(readFileSync('./package.json', 'utf8'));
const version = process.env.RELEASE_VERSION;

if (version) {
    jsonPackage.version = version.replace('v', '');
    writeFileSync('./package.json', JSON.stringify(jsonPackage, null, 2));
    console.log("Redis Connector version updated to " + version);
}

const repositoryUrl = jsonPackage.repository.url.replace('git+', '').replace('.git', '');

writeFileSync(
    '.yarn.installed',
    new Date().toLocaleString('en-AU', {
        timeZone: 'UTC',
        timeStyle: 'long',
        dateStyle: 'full',
    })
);

writeFileSync('fxmanifest.lua',
`fx_version 'cerulean'
game 'common'
use_experimental_fxv2_oal 'yes'
lua54 'yes'

name '${jsonPackage.name}'
author '${jsonPackage.author}'
version '${jsonPackage.version}'
license '${jsonPackage.license}'
repository '${repositoryUrl}'
description '${jsonPackage.description}'

server_script 'dist/index.js'

convar_category 'RedisConnector' {
    'Configuration',
    {
        { 'Redis Host',     'redis_host',       'CV_STRING',  '127.0.0.1' },
        { 'Redis Port',     'redis_port',       'CV_INT',     '6379' },
        { 'Redis User',     'redis_user',       'CV_STRING',  '' },
        { 'Redis Password', 'redis_password',   'CV_STRING',  '' },
        { 'Redis Debug',    'redis_debug_mode', 'CV_BOOL',    'false' }
    }
}
`);

build({
    bundle: true,
    entryPoints: ['src/index.ts'],
    outfile: 'lib/index.js',
    keepNames: true,
    legalComments: 'inline',
    platform: 'node',
    target: ['node16'],
    format: 'cjs',
    logLevel: 'info',
    minify: true,
    resolveExtensions: ['.ts', '.js'],
})
    .then(() => {
        console.log("Redis Connector built successfully 🎉");
    })
    .catch((error) => {
        console.error("Build failed 😞", error);
        process.exit(1); // Exit with error code if build fails
    });

