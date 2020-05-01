# @ctrl/mac-address [![npm](https://img.shields.io/npm/v/@ctrl/mac-address.svg?maxAge=3600)](https://www.npmjs.com/package/@ctrl/mac-address) [![CircleCI](https://circleci.com/gh/TypeCtrl/mac-address.svg?style=svg)](https://circleci.com/gh/TypeCtrl/mac-address) [![coverage status](https://codecov.io/gh/typectrl/mac-address/branch/master/graph/badge.svg)](https://codecov.io/gh/typectrl/mac-address)

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
