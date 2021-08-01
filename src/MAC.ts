interface ToStringOptions {
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

      const octet = fields[i]?.toString(16) ?? '';
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
