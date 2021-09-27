import test from 'ava';

import { parseMAC } from '../src/index.js';

import { ADDRESS_NUM_PAIRS } from './macs.js';

const addresses = [
  '0a0b0c0d0e0f',
  '0a:0b:0c:0d:0e:0f',
  'a:b:c:d:e:f',
  '0a:b:c:d:e:0f',
  '0a-0b-0c-0d-0e-0f',
  'a-b-c-d-e-f',
  'a-0b-c-d-0e-f',
];
for (const mac of addresses) {
  test(`should parse string equivalent ways to write addresses ${mac}`, t => {
    const v = 0x0a0b0c0d0e0f;

    const uc = mac.toUpperCase();
    t.is(parseMAC(uc).toLong(), v);
    t.is(parseMAC(uc).toLong(), v);
  });
}

for (const [mac, value] of ADDRESS_NUM_PAIRS) {
  test(`should parse 48-bit integers ${mac}`, t => {
    t.is(parseMAC(value).toString(), mac);
  });
}

// // --- Invalid MAC addresses

test('should error on unknown characters', t => {
  t.throws(() => parseMAC('a/b/c/d/e/f'), { message: 'Unrecognized character "/"' });
  t.throws(() => parseMAC('a:b:0:1:g:c'), { message: 'Unrecognized character "g"' });
  t.throws(() => parseMAC('a:b:_:1:e:c'), { message: 'Unrecognized character "_"' });
});

test('should error on mixed separators', t => {
  t.throws(() => parseMAC('a:b-c:d-e:f'), { message: 'Unrecognized character "-"' });
  t.throws(() => parseMAC('a-b:c-d:e-f'), { message: 'Unrecognized character ":"' });
});

test('should error on bad numeric input', t => {
  t.throws(() => parseMAC(1.2345), { message: 'Value must be an integer' });
  t.throws(() => parseMAC(2 ** 48), { message: 'Value must be 48-bit' });
});

test('should error on trailing separator', t => {
  t.throws(() => parseMAC('a:b:c:d:e:f:'), { message: 'Trailing ":" in MAC address' });
  t.throws(() => parseMAC('a-b-c-d-e-f-'), { message: 'Trailing "-" in MAC address' });
});

test('should error on imcomplete addresses', t => {
  t.throws(() => parseMAC(':'), { message: 'Expected to find a hexadecimal number before ":"' });
  t.throws(() => parseMAC('1::0:e:5:6'), {
    message: 'Expected to find a hexadecimal number before ":"',
  });
  t.throws(() => parseMAC('1-2-3--5-6'), {
    message: 'Expected to find a hexadecimal number before "-"',
  });
  t.throws(() => parseMAC(''), { message: 'MAC address is too short' });
  t.throws(() => parseMAC('0a0b0c0d0e'), { message: 'MAC address is too short' });
  t.throws(() => parseMAC('a:b:c:d:e'), { message: 'Too few octets in MAC address' });
});

test('should error on too many octets', t => {
  t.throws(() => parseMAC('1:e:39:d:e:f:0'), { message: 'Too many octets in MAC address' });
  t.throws(() => parseMAC('a:b:c:d:e:f:0:0'), { message: 'Too many octets in MAC address' });
  t.throws(() => parseMAC('a:b:c:00d:e:f'), { message: 'Too many hexadecimal digits in "00d"' });
});
