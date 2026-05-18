# @ctrl/mac-address [![npm](https://badgen.net/npm/v/@ctrl/mac-address)](https://www.npmjs.com/package/@ctrl/mac-address)

Parse, format, compare, and read MAC addresses in TypeScript.

- Zero runtime dependencies
- ESM only
- Supports compact, colon-separated, and dash-separated addresses
- Includes a small `getMAC()` helper for the first non-zero local network interface MAC

### Install

```sh
npm install @ctrl/mac-address
```

### Usage

```ts
import { getMAC, parseMAC } from '@ctrl/mac-address';

const localMac = getMAC();
const address = parseMAC(localMac);

address.toString();
//=> '0a:0b:0c:0d:0e:0f'

address.toLong();
//=> 11042563100175
```

Convert a MAC address to a base-16 string for APIs that expect the numeric form.

```ts
const macBase16 = parseMAC('0a:0b:0c:0d:0e:0f').toLong().toString(16);
//=> 'a0b0c0d0e0f'
```

### Supported Input

```ts
parseMAC('0a0b0c0d0e0f');
parseMAC('0a:0b:0c:0d:0e:0f');
parseMAC('a:b:c:d:e:f');
parseMAC('0a-0b-0c-0d-0e-0f');
parseMAC('a-b-c-d-e-f');
parseMAC(11_042_563_100_175);
```

### See Also

- [joyent/node-macaddr](https://github.com/joyent/node-macaddr) - original MAC parsing and formatting behavior this package was ported from.
- [bevry/getmac](https://github.com/bevry/getmac) - original inspiration for the local network interface `getMAC()` helper.
