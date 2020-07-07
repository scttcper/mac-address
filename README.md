# @ctrl/mac-address [![npm](https://badgen.net/npm/v/@ctrl/mac-address)](https://www.npmjs.com/package/@ctrl/mac-address) [![CircleCI](https://badgen.net/circleci/github/scttcper/mac-address)](https://circleci.com/gh/scttcper/mac-address) [![coverage](https://badgen.net/codecov/c/github/scttcper/mac-address)](https://codecov.io/gh/scttcper/mac-address)

Zero dependency typescript port of [joyent/node-macaddr](https://github.com/joyent/node-macaddr) and getMac [bevry/getmac](https://github.com/bevry/getmac)

### Install
```sh
npm install @ctrl/mac-address
```

### Use

Example converting a mac address from a string to a number and then a base16 mac address which some apis need.
```ts
import { getMAC, parseMAC } from '@ctrl/mac-address';

// Get first non-zero mac address
const mac = getMAC();

// Convert a string mac address to a base16 string
const macNumber = parseMAC(mac).toLong();

// Native js toString convert the number to base 16
const macBase16 = macNumber.toString(16);
```

### See Also
getmac - https://github.com/bevry/getmac  
