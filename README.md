# nsw-run-number

This library decodes a 4 digit train run number and provides known attributes about the service based on the rules described in Transport for NSW's Train Operating Conditions (TOC) Manual - General Instructions.

```bash
npm i nsw-run-number -- install via npm
yarn add nsw-run-number -- or using yarn
```

```js
const nswRunNumberParser = require("nsw-run-number");
nswRunNumberParser("2BM6");
// {
//   operator: undefined,
//   up: true,
//   trainType: 'Interstate train',
//   commenceRegion: 'Brisbane',
//   finishRegion: 'Melbourne',
//   serviceName: 'Monday service from Brisbane region to Melbourne region'
// }
nswRunNumberParser("T281");
// {
//   operator: 'QUBE Logistics Rail',
//   up: false,
//   trainType: 'Trip train',
//   commenceRegion: undefined,
//   finishRegion: undefined,
//   serviceName: 'Trip train service operated by QUBE Logistics Rail'
// }
```