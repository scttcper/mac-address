import { ADDRESS_NUM_PAIRS } from './macs';
import { parseMAC } from '../src/index';

it.each(ADDRESS_NUM_PAIRS)('should output long %s', (mac, value) => {
  expect(parseMAC(mac).toLong()).toBe(value);
});

it.each([
  ['a-b-c-d-e-f', '0a:0b:0c:0d:0e:0f'],
  ['0-1-ef-9d-ae-f0', '00:01:ef:9d:ae:f0'],
  ['bc-10-ef-9d-ae-f0', 'bc:10:ef:9d:ae:f0'],
])('output with leading zeros', (input, output) => {
  const addr = parseMAC(input);
  expect(addr.toString()).toBe(output);
  expect(addr.toString({ zeroPad: true })).toBe(output);
});

it.each([
  ['0a-0b-0c-0d-0e-0f', 'a:b:c:d:e:f'],
  ['00-01-ef-9d-ae-f0', '0:1:ef:9d:ae:f0'],
  ['bc-10-ef-9d-ae-f0', 'bc:10:ef:9d:ae:f0'],
])('should output without leading zeros %s', (input, output) => {
  const addr = parseMAC(input);
  expect(addr.toString({ zeroPad: false })).toBe(output);
});
