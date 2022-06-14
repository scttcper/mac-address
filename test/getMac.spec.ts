import { expect, it } from 'vitest';

import { getMAC } from '../src/index.js';

it('got the first MAC address successfully', () => {
  const macAddress = getMAC();
  expect(macAddress).not.toBe('00-00-00-00-00-00');
  expect(macAddress).not.toBe('00:00:00:00:00:00');
  expect(typeof macAddress).toBe('string');
});
