[![CircleCI](https://img.shields.io/circleci/build/github/a6b8/triangularPairs/main)]()


# Triangular Pairs

Triangular Pairs can be useful for executing composite transactions on a blockchain to efficiently carry out arbitrage opportunities. This module helps in identifying all possible pairs of pools, such as Uniswap V2 or V3, and subsequently conducts further analyses.

## Quickstart

```js
import { TriangularPairs } from './src/TriangularPairs.mjs'
import { selection } from './tests/data/pairs-selection.mjs'

const triangularPairs  = new TriangularPairs ()
const pairsEncoded = selection['data']
    .map( pair => {
        const str = [
            pair['contract_address'],
            pair['pair'],
            pair['token1'],
            pair['token2']
        ]
            .join( '_' )
        return str
    } )

triangularPairs
    .start( { pairsEncoded } )
    .getTriangularPairs()
```



## Table of Contents

- [Triangular Pairs](#triangular-pairs)
  - [Quickstart](#quickstart)
  - [Table of Contents](#table-of-contents)
  - [Methods](#methods)
    - [.start()](#start)
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

### .getTokens()

Filters by tokens and provides references to individual pool pairs.

`.getTokens()`

returns  
`this.#tokens`

{{Method 1 Description}}

### .getPairs()

Filters by pool pairs and lists the possible pools that provide this exchange opportunity under `contracts`. Additionally, the direction is indicated by specifying `tokenA` as the first and `tokenB` as the second position.

`.getPairs()`

returns  
`this.#pairs`

{{Method 2 Description}}

### .getTriangularPairs()

Generates all possible unique Triangular Pairs and provides references to further information in `this.#tokens` and `this.#pairs`.

`.getTriangularPairs()`

returns  
`this.#triangularPairs`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.