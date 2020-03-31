import { ADDRESS_NUM_PAIRS } from './macs';
import { parse } from '../src/index';

it.each([
  '0a0b0c0d0e0f',
  '0a:0b:0c:0d:0e:0f',
  'a:b:c:d:e:f',
  '0a:b:c:d:e:0f',
  '0a-0b-0c-0d-0e-0f',
  'a-b-c-d-e-f',
  'a-0b-c-d-0e-f',
])('should parse string equivalent ways to write addresses %s', mac => {
  const v = 0x0a0b0c0d0e0f;

  const uc = mac.toUpperCase();
  expect(parse(uc).toLong()).toBe(v);
  expect(parse(uc).toLong()).toBe(v);
});

it.each(ADDRESS_NUM_PAIRS)('should parse 48-bit integers %s', (mac, value) => {
  expect(parse(value).toString()).toBe(mac);
});

// // --- Invalid MAC addresses

it('should error on unknown characters', () => {
  expect(() => parse('a/b/c/d/e/f')).toThrowError('Unrecognized character "/"');
  expect(() => parse('a:b:0:1:g:c')).toThrowError('Unrecognized character "g"');
  expect(() => parse('a:b:_:1:e:c')).toThrowError('Unrecognized character "_"');
});

it('should error on mixed separators', () => {
  expect(() => parse('a:b-c:d-e:f')).toThrowError('Unrecognized character "-"');
  expect(() => parse('a-b:c-d:e-f')).toThrowError('Unrecognized character ":"');
});

it('should error on bad numeric input', () => {
  expect(() => parse(1.2345)).toThrowError('Value must be an integer');
  expect(() => parse(2 ** 48)).toThrowError('Value must be 48-bit');
});

it('should error on trailing separator', () => {
  expect(() => parse('a:b:c:d:e:f:')).toThrowError('Trailing ":" in MAC address');
  expect(() => parse('a-b-c-d-e-f-')).toThrowError('Trailing "-" in MAC address');
});

it('should error on imcomplete addresses', () => {
  expect(() => parse(':')).toThrowError('Expected to find a hexadecimal number before ":"');
  expect(() => parse('1::0:e:5:6')).toThrowError('Expected to find a hexadecimal number before ":"');
  expect(() => parse('1-2-3--5-6')).toThrowError('Expected to find a hexadecimal number before "-"');
  expect(() => parse('')).toThrowError('MAC address is too short');
  expect(() => parse('0a0b0c0d0e')).toThrowError('MAC address is too short');
  expect(() => parse('a:b:c:d:e')).toThrowError('Too few octets in MAC address');
});

it('should error on too many octets', () => {
  expect(() => parse('1:e:39:d:e:f:0')).toThrowError('Too many octets in MAC address');
  expect(() => parse('a:b:c:d:e:f:0:0')).toThrowError('Too many octets in MAC address');
  expect(() => parse('a:b:c:00d:e:f')).toThrowError('Too many hexadecimal digits in "00d"');
});
