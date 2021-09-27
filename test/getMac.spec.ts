import test from 'ava';

import { getMAC } from '../src/index.js';

test('got the first MAC address successfully', t => {
  const macAddress = getMAC();
  t.not(macAddress, '00-00-00-00-00-00');
  t.not(macAddress, '00:00:00:00:00:00');
  t.is(typeof macAddress, 'string');
});
