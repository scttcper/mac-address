import { MAC } from './MAC.js';

const HEX_RE = /^[a-f0-9]$/;

export function parseString(input: string): MAC {
  const lowercaseinput = input.toLowerCase();
  let pos = 0;
  let octet = '';
  let value = 0;

  function process(): void {
    if (octet.length === 0) {
      throw new Error('Expected to find a hexadecimal number before ' + JSON.stringify(sep));
    } else if (octet.length > 2) {
      throw new Error('Too many hexadecimal digits in ' + JSON.stringify(octet));
    } else if (pos < 6) {
      const tmp = parseInt(octet, 16);
      if (Number.isNaN(tmp)) {
        throw new Error('Expected to find an integer');
      }

      value *= 0x100;
      value += tmp;
      pos += 1;
      octet = '';
    } else {
      throw new Error('Too many octets in MAC address');
    }
  }

  let chr = '';
  let sep: string | null = null;
  for (chr of lowercaseinput) {
    // Lock to first separator
    if (sep === null && (chr === ':' || chr === '-')) {
      sep = chr;
    }

    if (chr === sep) {
      process();
    } else if (HEX_RE.test(chr)) {
      octet += chr;
    } else {
      throw new Error('Unrecognized character ' + JSON.stringify(chr));
    }
  }

  // Ending validation
  if (chr === sep) {
    throw new Error('Trailing ' + JSON.stringify(sep) + ' in MAC address');
  }

  if (pos === 0) {
    if (octet.length !== 12) {
      throw new Error('MAC address is too short');
    }

    value = parseInt(octet, 16);
    if (Number.isNaN(value)) {
      throw new Error('Expected to find an integer');
    }
  } else {
    process();

    if (pos !== 6) {
      throw new Error('Too few octets in MAC address');
    }
  }

  return new MAC(value);
}

export function parseLong(input: number): MAC {
  if (input !== Math.floor(input)) {
    throw new Error('Value must be an integer');
  }

  if (input < 0 || input > 0xffffffffffff) {
    throw new Error('Value must be 48-bit');
  }

  return new MAC(input);
}

export function parseMAC(input: string | number): MAC {
  switch (typeof input) {
    case 'string':
      return parseString(input);
    case 'number':
      return parseLong(input);
    default:
      throw new Error('Expected string or integer, but got ' + typeof input);
  }
}
