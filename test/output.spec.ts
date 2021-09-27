import test from 'ava';

import { parseMAC } from '../src/index.js';

import { ADDRESS_NUM_PAIRS } from './macs.js';

for (const [mac, value] of ADDRESS_NUM_PAIRS) {
  test(`should output long ${mac}`, t => {
    t.is(parseMAC(mac).toLong(), value);
  });
}

const withLeading = [
  ['a-b-c-d-e-f', '0a:0b:0c:0d:0e:0f'],
  ['0-1-ef-9d-ae-f0', '00:01:ef:9d:ae:f0'],
  ['bc-10-ef-9d-ae-f0', 'bc:10:ef:9d:ae:f0'],
] as const;
for (const [input, output] of withLeading) {
  test(`output with leading zeros ${input}`, t => {
    const addr = parseMAC(input);
    t.is(addr.toString(), output);
    t.is(addr.toString({ zeroPad: true }), output);
  });
}

const noLeading = [
  ['0a-0b-0c-0d-0e-0f', 'a:b:c:d:e:f'],
  ['00-01-ef-9d-ae-f0', '0:1:ef:9d:ae:f0'],
  ['bc-10-ef-9d-ae-f0', 'bc:10:ef:9d:ae:f0'],
] as const;
for (const [input, output] of noLeading) {
  test(`should output without leading zeros ${input}`, t => {
    const addr = parseMAC(input);
    t.is(addr.toString({ zeroPad: false }), output);
  });
}
