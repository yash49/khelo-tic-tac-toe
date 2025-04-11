// findGameServer.ts
import * as dgram from 'dgram';
import { DISCOVERY_TIMEOUT, DISCOVERY_PORT } from './constants.js';

export async function findGameServer(): Promise<{
  result: { found: true; ip: string; port: string } | { found: false };
  closeSocket: () => void;
}> {
  const udpSocket = dgram.createSocket('udp4');

  return new Promise((resolve, reject) => {
    console.log(
      `🔍 Finding game server (timeout in ${DISCOVERY_TIMEOUT / 1000}s)...`
    );

    const timeout = setTimeout(() => {
      console.log('⏰ Discovery timeout reached');
      udpSocket.close();
      resolve({ result: { found: false }, closeSocket: () => {} });
    }, DISCOVERY_TIMEOUT);

    const cleanup = () => {
      clearTimeout(timeout);
      udpSocket.close();
    };

    udpSocket.on('error', (err) => {
      console.error('❌ Error while finding server:', err);
      cleanup();
      reject(err);
    });

    udpSocket.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'TTT_SERVER_ADDRESS') {
          console.log('✅ Game server found:', data.ip, data.port);
          cleanup();
          resolve({
            result: {
              port: data.port.toString(),
              ip: data.ip.toString(),
              found: true,
            },
            closeSocket: () => {},
          });
        }
      } catch (err) {
        console.error('❌ Error parsing discovery message:', err);
        cleanup();
        reject(err);
      }
    });

    udpSocket.bind(DISCOVERY_PORT, () => {
      udpSocket.setBroadcast(true);
    });
  });
}
