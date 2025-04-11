import os from 'os';

export function getLocalIP(): string {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    for (const iface of networkInterfaces[interfaceName] || []) {
      // Check if the interface is an IPv4 address and not a loopback address
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address; // Return the first found local IP
      }
    }
  }

  throw new Error('No local IP found');
}
