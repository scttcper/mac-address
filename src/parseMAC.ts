import { MAC } from './MAC.js';

// Keep string parsing allocation-light: this replaces per-character regex checks
// and lets parseString accumulate octet values without calling parseInt.
function parseHexDigit(chr: string): number {
  const code = chr.charCodeAt(0);

  if (code >= 48 && code <= 57) {
    return code - 48;
  }

  if (code >= 65 && code <= 70) {
    return code - 55;
  }

  if (code >= 97 && code <= 102) {
    return code - 87;
  }

  return -1;
}

export function parseString(input: string): MAC {
  let pos = 0;
  let octet = '';
  let octetValue = 0;
  let value = 0;

  function process(): void {
    if (octet.length === 0) {
      throw new Error(`Expected to find a hexadecimal number before ${JSON.stringify(sep)}`);
    }
    if (octet.length > 2) {
      throw new Error(`Too many hexadecimal digits in ${JSON.stringify(octet)}`);
    }
    if (pos < 6) {
      value *= 0x1_00;
      value += octetValue;
      pos += 1;
      octet = '';
      octetValue = 0;
    } else {
      throw new Error('Too many octets in MAC address');
    }
  }

  let chr = '';
  let sep: string | null = null;
  for (chr of input) {
    // Lock to first separator
    if (sep === null && (chr === ':' || chr === '-')) {
      sep = chr;
    }

    if (chr === sep) {
      process();
    } else {
      const hexValue = parseHexDigit(chr);
      if (hexValue === -1) {
        throw new Error(`Unrecognized character ${JSON.stringify(chr)}`);
      }

      octet += chr;
      octetValue = octetValue * 16 + hexValue;
    }
  }

  // Ending validation
  if (chr === sep) {
    throw new Error(`Trailing ${JSON.stringify(sep)} in MAC address`);
  }

  if (pos === 0) {
    if (octet.length !== 12) {
      throw new Error('MAC address is too short');
    }

    value = Number.parseInt(octet, 16);
    if (Number.isNaN(value)) {
      throw new TypeError('Expected to find an integer');
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

  if (input < 0 || input > 281_474_976_710_655) {
    throw new Error('Value must be 48-bit');
  }

  return new MAC(input);
}

export function parseMAC(input: string | number): MAC {
  switch (typeof input) {
    case 'string': {
      return parseString(input);
    }
    case 'number': {
      return parseLong(input);
    }
    default: {
      throw new Error(`Expected string or integer, but got ${typeof input}`);
    }
  }
}
