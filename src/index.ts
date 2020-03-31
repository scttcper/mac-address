const HEX_RE = /^[a-f0-9]$/;

export interface ToStringOptions {
  /** Pad with zeros when an octet would print as 1 char */
  zeroPad?: boolean;
}

/**
 * The MAC class wraps a 48-bit integer, and provides several helper
 * methods for manipulating it.
 *
 * It could wrap an array of 6 octets instead, but doing so complicates
 * processing both numeric input and output, without improving string
 * processing in a useful way. (We would be able to remove the bitwise
 * arithmetic in .toString(), but it would just end up in parseLong()
 * instead.)
 */
export class MAC {
  private readonly _value: number;

  constructor(value: number) {
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  toLong(): number {
    return this._value;
  }

  toString(opts?: ToStringOptions): string {
    const zeroPad = opts?.zeroPad ?? true;

    let result = '';
    const fields = [
      /*
       * JavaScript converts numbers to 32-bit integers when doing bitwise
       * arithmetic, so we have to handle the first two parts of the number
       * differently.
       */
      (this._value / 0x010000000000) & 0xff,
      (this._value / 0x000100000000) & 0xff,

      (this._value >>> 24) & 0xff,
      (this._value >>> 16) & 0xff,
      (this._value >>> 8) & 0xff,
      this._value & 0xff,
    ];

    for (let i = 0; i < fields.length; i++) {
      if (i !== 0) {
        result += ':';
      }

      const octet = fields[i].toString(16);
      if (zeroPad && octet.length === 1) {
        result += '0';
      }

      result += octet;
    }

    return result;
  }

  compare(other: MAC): 0 | 1 | -1 {
    if (this.value < other.value) {
      return -1;
    }

    if (this.value > other.value) {
      return 1;
    }

    return 0;
  }
}

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

export function parse(input: string | number): MAC {
  switch (typeof input) {
    case 'string':
      return parseString(input);
    case 'number':
      return parseLong(input);
    default:
      throw new Error('Expected string or integer, but got ' + typeof input);
  }
}
