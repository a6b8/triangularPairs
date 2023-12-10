[![CircleCI](https://img.shields.io/circleci/build/github/{{username}}/{{repository}}/{{branch}})]({{circleci_link}})


# Triangular Pairs

Diese Modul hilft dabei Triangular Pairs zu finden, optimiert für Uniswap Pools.

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
    - [{{Method 1}}()](#method-1)
    - [{{Method 2}}()](#method-2)
  - [Presets](#presets)
  - [License](#license)


## Methods 

The module contains only two methods: `{{Method 1}}()` and `{{Method 2}}()`. Install it with:

```bash
npm init -y
npm i {{package_name}}
```

### {{Method 1}}()

```js
{{Method 1}}({{method_1_params}})
```

{{Method 1 Description}}

### {{Method 2}}()

```js
{{Method 2}}({{method_2_params}})
```

{{Method 2 Description}}

## Presets

You can use various presets to generate different badge tables, such as "githubActivity," "githubAdvanced," "githubMinimal," "githubStats," and more.

Implementation: [{{presets_link}}]({{presets_link}})

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.