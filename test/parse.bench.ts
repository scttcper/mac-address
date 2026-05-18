import { bench, describe } from 'vitest';

import { MAC, parseMAC, parseString } from '../src/index.js';

import { ADDRESS_NUM_PAIRS } from './macs.js';

const compact = '0a0b0c0d0e0f';
const colonPadded = '0a:0b:0c:0d:0e:0f';
const colonUnpadded = 'a:b:c:d:e:f';
const dashPadded = '0a-0b-0c-0d-0e-0f';
const numeric = 11_042_563_100_175;
const mac = new MAC(numeric);
const comparisonTarget = new MAC(28_635_352_927_744);

describe('parseMAC', () => {
  bench('compact string', () => {
    parseMAC(compact);
  });

  bench('colon padded string', () => {
    parseMAC(colonPadded);
  });

  bench('colon unpadded string', () => {
    parseMAC(colonUnpadded);
  });

  bench('dash padded string', () => {
    parseMAC(dashPadded);
  });

  bench('number', () => {
    parseMAC(numeric);
  });
});

describe('parseString direct', () => {
  bench('compact string', () => {
    parseString(compact);
  });

  bench('colon padded string', () => {
    parseString(colonPadded);
  });
});

describe('MAC', () => {
  bench('toString zero padded', () => {
    mac.toString();
  });

  bench('toString unpadded', () => {
    mac.toString({ zeroPad: false });
  });

  bench('compare', () => {
    mac.compare(comparisonTarget);
  });
});

describe('mixed workload', () => {
  bench('parse fixtures and stringify', () => {
    for (const [address] of ADDRESS_NUM_PAIRS) {
      parseMAC(address).toString();
    }
  });
});
