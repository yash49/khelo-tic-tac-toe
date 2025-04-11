#!/usr/bin/env node

import { execa } from 'execa';
import path from 'path';
import process from 'process';
import { findGameServer } from './findGameServer.js';
import { startDiscoveryService } from './startDiscoveryService.js';
import { WEBSOCKET_PORT } from './constants.js';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

// -------------------- Setup --------------------

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const nodeAppPath = path.resolve(__dirname, '..', '..', 'server');
const reactAppPath = path.resolve(__dirname, '..', '..', 'client');
const reactIndexHtmlPath = path.resolve(reactAppPath, 'dist', 'index.html');

const paths = {
  nodeApp: nodeAppPath,
  reactApp: reactAppPath,
  reactIndexHtml: reactIndexHtmlPath,
};

type CleanupFn = () => void | Promise<void>;
const cleanupFns: CleanupFn[] = [];

function registerCleanup(fn: CleanupFn) {
  cleanupFns.push(fn);
}

async function cleanupAndExit(code = 0) {
  console.log('\n🧹 Cleaning up...');

  for (const fn of cleanupFns.reverse()) {
    try {
      await fn();
    } catch (err) {
      console.error('Cleanup error:', err);
    }
  }

  process.exit(code);
}

process.on('SIGINT', () => cleanupAndExit(0));
process.on('SIGTERM', () => cleanupAndExit(0));

process.on('uncaughtException', async (err) => {
  console.error('❌ Uncaught exception:', err);
  await cleanupAndExit(1);
});

process.on('unhandledRejection', async (reason) => {
  console.error('❌ Unhandled rejection:', reason);
  await cleanupAndExit(1);
});

// -------------------- Helpers --------------------

function startProcess(
  command: string,
  args: string[],
  cwd: string,
  prefix: string
) {
  console.log(`👉 Running: ${command} ${args.join(' ')} (cwd: ${cwd})`);

  const proc = execa(command, args, {
    cwd,
  });

  proc.stdout?.on('data', (data) => {
    process.stdout.write(`${prefix} ${data}`);
  });

  proc.stderr?.on('data', (data) => {
    process.stderr.write(`${prefix} ${data}`);
  });

  proc.catch(async (err) => {
    console.error(`${prefix} ❌ Start process error`, err);
    await cleanupAndExit(1);
  });

  proc.on('exit', async (code) => {
    console.log(`${prefix} 📦 Process exited with code: ${code}`);
    if (code !== 0) {
      await cleanupAndExit(code ?? 1);
    }
  });

  registerCleanup(() => {
    proc.kill('SIGINT');
  });

  return proc;
}

async function updateServerUrlForClient(newUrl: string) {
  const filePath = paths.reactIndexHtml;

  console.log(`✏️ Updating window.SERVER_URL in ${filePath}...`);

  const html = await fs.readFile(filePath, 'utf-8');

  const updatedHtml = html.replace(
    /window\.SERVER_URL\s*=\s*['"`][^'"`]+['"`]/,
    `window.SERVER_URL = '${newUrl}'`
  );

  await fs.writeFile(filePath, updatedHtml, 'utf-8');

  console.log('✅ index.html updated with new SERVER_URL');
}

// -------------------- Main --------------------

async function main() {
  try {
    const { result, closeSocket } = await findGameServer();
    registerCleanup(closeSocket);

    let serverUrl: string;

    if (result.found) {
      serverUrl = `ws://${result.ip}:${result.port}`;
      console.log(`🌐 Found server at: ${serverUrl}`);
    } else {
      serverUrl = `ws://localhost:${WEBSOCKET_PORT}`;
      console.warn('⚠️ Server not found. Starting local server...');
      console.log(`📡 Broadcasting own server as: ${serverUrl}`);

      startProcess('npm', ['start'], paths.nodeApp, 'Server ::');
      const stopDiscovery = await startDiscoveryService();
      registerCleanup(stopDiscovery);
    }

    await updateServerUrlForClient(serverUrl);

    startProcess('npm', ['start'], paths.reactApp, 'Client ::');
  } catch (err) {
    console.error('❌ Error in CLI:', err);
    await cleanupAndExit(1);
  }
}

main();
