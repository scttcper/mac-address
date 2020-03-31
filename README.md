# @ctrl/mac-address

Zero dependency typescript port of [joyent/node-macaddr](https://github.com/joyent/node-macaddr)

### Install
```console
npm install @ctrl/mac-address
```

### Use

Example converting a mac address from a string to a number and then a base16 mac address which some apis need.
```ts
import getmac from 'getmac';
import { parse as parseMac } from '@ctrl/mac-address';

// Get mac address
const mac = getmac();

// Convert a string mac address to a base16 string
const macNumber = parseMac(mac).toLong();

// Native js toString convert the number to base 16
const macBase16 = macNumber.toString(16);
```

### See Also
getmac - https://github.com/bevry/getmac  
