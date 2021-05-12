import { expect, it } from '@jest/globals';

import { parseMAC } from '../src/index';

it.each([
  '0a:0b:0c:0d:0e:0f',
  'a:b:c:d:e:f',
  '0a:b:c:d:e:0f',
  '0a-0b-0c-0d-0e-0f',
  'a-b-c-d-e-f',
  'a-0b-c-d-0e-f',
])('should detect if addresses are the same %s', input => {
  const addr = parseMAC('0a0b0c0d0e0f');

  const other = parseMAC(input);
  expect(addr.compare(other)).toBe(0);
});

it.each([
  '0a:0b:0c:0d:0e:0e',
  '1:2:3:4:5:6',
  'a:b:c:d0:e:f',
  '0a-9b-0c-0d-0e-0f',
  'a-b-c-d-e-1',
  'a-b0-c-d-0e-f',
])('should detect if addresses are different %s', input => {
  const addr = parseMAC('0a0b0c0d0e0f');

  const other = parseMAC(input);
  expect(addr.compare(other)).not.toBe(0);
});

it.each([
  '0a:0b:0c:0d:0e:0e',
  '1:2:3:4:5:6',
  'a:b:c:d0:e:f',
  '0a-9b-0c-0d-0e-0f',
  'a-b-c-d-e-1',
  'a-b0-c-d-0e-f',
])('should detect if address comes before compared addresses', input => {
  const addr = parseMAC('00000c0d0e0f');
  const other = parseMAC(input);
  expect(addr.compare(other)).toBe(-1);
});

it.each([
  '0a:0b:0c:0d:0e:0e',
  '1:2:3:4:5:6',
  'a:b:c:d0:e:f',
  '0a-9b-0c-0d-0e-0f',
  'a-b-c-d-e-1',
  'a-b0-c-d-0e-f',
])('should detect if address comes after compared addresses', input => {
  const addr = parseMAC('1f002c0d0e0f');
  const other = parseMAC(input);
  expect(addr.compare(other)).toBe(1);
});
