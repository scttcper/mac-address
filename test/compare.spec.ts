import test from 'ava';

import { parseMAC } from '../src/index.js';

const same = [
  '0a:0b:0c:0d:0e:0f',
  'a:b:c:d:e:f',
  '0a:b:c:d:e:0f',
  '0a-0b-0c-0d-0e-0f',
  'a-b-c-d-e-f',
  'a-0b-c-d-0e-f',
];
for (const input of same) {
  test(`should detect if addresses are the same ${input}`, t => {
    const addr = parseMAC('0a0b0c0d0e0f');

    const other = parseMAC(input);
    t.is(addr.compare(other), 0);
  });
}

const different = [
  '0a:0b:0c:0d:0e:0e',
  '1:2:3:4:5:6',
  'a:b:c:d0:e:f',
  '0a-9b-0c-0d-0e-0f',
  'a-b-c-d-e-1',
  'a-b0-c-d-0e-f',
];
for (const input of different) {
  test(`should detect if addresses are different ${input}`, t => {
    const addr = parseMAC('0a0b0c0d0e0f');

    const other = parseMAC(input);
    t.not(addr.compare(other), 0);
  });
}

const before = [
  '0a:0b:0c:0d:0e:0e',
  '1:2:3:4:5:6',
  'a:b:c:d0:e:f',
  '0a-9b-0c-0d-0e-0f',
  'a-b-c-d-e-1',
  'a-b0-c-d-0e-f',
];
for (const input of before) {
  test(`should detect if address comes before compared addresses ${input}`, t => {
    const addr = parseMAC('00000c0d0e0f');
    const other = parseMAC(input);
    t.is(addr.compare(other), -1);
  });
}

const after = [
  '0a:0b:0c:0d:0e:0e',
  '1:2:3:4:5:6',
  'a:b:c:d0:e:f',
  '0a-9b-0c-0d-0e-0f',
  'a-b-c-d-e-1',
  'a-b0-c-d-0e-f',
];
for (const input of after) {
  test(`should detect if address comes after compared addresses ${input}`, t => {
    const addr = parseMAC('1f002c0d0e0f');
    const other = parseMAC(input);
    t.is(addr.compare(other), 1);
  });
}
