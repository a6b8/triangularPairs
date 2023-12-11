[![CircleCI](https://img.shields.io/circleci/build/github/a6b8/triangularPairs/main)]()


# Triangular Pairs

Triangular Pairs can be useful for executing composite transactions on a blockchain to efficiently carry out arbitrage opportunities. This module helps in identifying all possible pairs of pools, such as Uniswap V2 or V3, and subsequently conducts further analyses.

```
  -------------------------------------------------------------
 |                                                             |
 |      -----|-----        -----|-----        -----|-----      |
  ---> |  A     B  | ---> |  B     Z  | ---> |  Z     A  | ---> 
        -----|-----        -----|-----        -----|-----
           Pool n            Pool n             Pool n+2    
         Contract A         Contract B         Contract A
```



## Quickstart

```js
import { TriangularPairs } from './src/TriangularPairs.mjs'
import { selection } from './tests/data/pairs-selection.mjs'

const triangularPairs  = new TriangularPairs ()
const pairsEncoded = triangularPairs
    .encodePairs( { 'items': selection['data'] } )
const result = triangularPairs
    .start( { pairsEncoded } )
    .getTriangularPairs()
```



## Table of Contents

- [Triangular Pairs](#triangular-pairs)
  - [Quickstart](#quickstart)
  - [Table of Contents](#table-of-contents)
  - [Methods](#methods)
    - [.start()](#start)
    - [encodePairs()](#encodepairs)
    - [.getTokens()](#gettokens)
    - [.getPairs()](#getpairs)
    - [.getTriangularPairs()](#gettriangularpairs)
  - [License](#license)


## Methods

Here are all the public methods listed. `.start(...)` initiates the process. The results can be queried using the `get` methods. The main result can be found under `.getTriangularPairs()`.

### .start()

Starts the process and generates `this.#tokens`, `this.#pairs`, and `this.#triangularPairs`. The results are accessible through the methods listed below.

`.start( { pairsEncoded } )`  

returns  
`this`

```js
import { TriangularPairs } from './src/TriangularPairs.mjs'
const triangularPairs  = new TriangularPairs ()
const selection = {
    "data": [
        {
            "contract_address": "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f",
            "pair": "0x8c3b2e86aaceb1b7ad8cb96e63881c28f5cef29a",
            "token1": "0x11a605d7e12b64d713e93c487277d819a1d14b99",
            "token2": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            "total": 5434,
            "tx_hash": "0x1e75b533f8aeda500c5d9837d40319d144c855ef7660679bd7a92368ff958fa7"
        }
        ...
    ]
}

const pairsEncoded = triangularPairs
    .encodePairs( { 'items': selection['data'] } )
const tokens = triangularPairs
    .start( { pairsEncoded } )
    .getTokens()
console.log( tokens )

```

You can find a sample file here: [./tests/pairs-selection.mjs](https://github.com/a6b8/triangularPairs/blob/main/tests/pairs-selection.mjs)



### encodePairs()

Assists in encoding your data into the expected format for `.start()`. A pool pair needs to be encoded as a single string in the following order: `contractAddress_pairAddress_token1Address_token2Address`.

`.encodePairs { items } )`  

returns  
`this`


```js
const selection = {
    "data": [
        {
            "contract_address": "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f",
            "pair": "0x8c3b2e86aaceb1b7ad8cb96e63881c28f5cef29a",
            "token1": "0x11a605d7e12b64d713e93c487277d819a1d14b99",
            "token2": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            "total": 5434,
            "tx_hash": "0x1e75b533f8aeda500c5d9837d40319d144c855ef7660679bd7a92368ff958fa7"
        }
        ...
    ]
}

const pairsEncoded = triangularPairs
    .encodePairs( { 'items': selection['data'] } )

```


### .getTokens()

Filters by tokens and provides references to individual pool pairs.

`.getTokens()`

returns  
`this.#tokens`

```js
import { TriangularPairs } from './src/TriangularPairs.mjs'
import { selection } from './tests/data/pairs-selection.mjs'

const triangularPairs  = new TriangularPairs ()
const pairsEncoded = triangularPairs
    .encodePairs( { 'items': selection['data'] } )
const tokens = triangularPairs
    .start( { pairsEncoded } )
    .getTokens()
console.log( tokens )
```

### .getPairs()

Filters by pool pairs and lists the possible pools that provide this exchange opportunity under `contracts`. Additionally, the direction is indicated by specifying `tokenA` as the first and `tokenB` as the second position.

`.getPairs()`

returns  
`this.#pairs`

```js
import { TriangularPairs } from './src/TriangularPairs.mjs'
import { selection } from './tests/data/pairs-selection.mjs'

const triangularPairs  = new TriangularPairs ()
const pairsEncoded = triangularPairs
    .encodePairs( { 'items': selection['data'] } )
const pairs = triangularPairs
    .start( { pairsEncoded } )
    .getPairs()
console.log( pairs )
```

### .getTriangularPairs()

Generates all possible unique Triangular Pairs and provides references to further information in `this.#tokens` and `this.#pairs`.

`.getTriangularPairs()`

returns  
`this.#triangularPairs`

```js
import { TriangularPairs } from './src/TriangularPairs.mjs'
import { selection } from './tests/data/pairs-selection.mjs'

const triangularPairs  = new TriangularPairs ()
const pairsEncoded = triangularPairs
    .encodePairs( { 'items': selection['data'] } )
const triPairs = triangularPairs
    .start( { pairsEncoded } )
    .getTriangularPairs()
console.log( triPairs )
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.