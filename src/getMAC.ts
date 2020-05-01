import { networkInterfaces } from 'os';

const zeroRegex = /(?:[0]{1,2}[:-]){5}[0]{1,2}/;

/**
 * Get the first non-zero MAC address
 * @param networkInterface If provided, restrict MAC address fetching to this interface
 */
export function getMAC(networkInterface?: string): string {
  const networkList = networkInterfaces();

  if (networkInterface) {
    const parts = networkList[networkInterface] ?? [];
    if (!parts) {
      throw new Error(`Interface ${networkInterface} was not found`);
    }

    for (const part of parts) {
      if (!zeroRegex.test(part.mac)) {
        return part.mac;
      }
    }

    throw new Error(`Interface ${networkInterface} has no valid mac addresses`);
  }

  for (const key of Object.keys(networkList)) {
    const parts = networkList[key] ?? [];
    for (const part of parts) {
      if (!zeroRegex.test(part.mac)) {
        return part.mac;
      }
    }
  }

  throw new Error('Failed to get MAC address');
}
