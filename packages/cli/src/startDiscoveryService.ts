// discovery.ts
import {
    WEBSOCKET_PORT,
    DISCOVERY_PORT,
    BROADCAST_ADDRESS,
    INTERVAL,
} from './constants.js';
import { getLocalIP } from './utils/getLocalIp.js';
import dgram from 'dgram';

export async function startDiscoveryService(): Promise<() => void> {
  const localIp = getLocalIP();
  const message = JSON.stringify({
    type: 'TTT_SERVER_ADDRESS',
    port: WEBSOCKET_PORT,
    ip: localIp,
  });

  const udpSocket = dgram.createSocket('udp4');
  let interval: NodeJS.Timeout;

  udpSocket.on('error', (err: NodeJS.ErrnoException) => {
    udpSocket.close();
    if (interval) clearInterval(interval);
    if (err.code === 'EADDRINUSE') {
      throw new Error('Discovery port already in use.');
    }
    throw err;
  });

  await new Promise<void>((resolve) => {
    udpSocket.bind(0, () => {
      udpSocket.setBroadcast(true);
      const sendMessage = () => {
        udpSocket.send(message, DISCOVERY_PORT, BROADCAST_ADDRESS, (err) => {
          if (err) {
            console.error('Failed to send discovery message:', err);
          } else {
            console.log('📡 Discovery :: sent at', new Date().toISOString());
          }
        });
      };
      sendMessage();
      interval = setInterval(sendMessage, INTERVAL);
      resolve();
    });
  });

  // Return cleanup
  return () => {
    console.log('🛑 Shutting down discovery service...');
    clearInterval(interval);
    udpSocket.close();
  };
}
