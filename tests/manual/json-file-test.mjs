import fs from 'fs'
import { TriangularPairs } from '../../src/TriangularPairs.mjs'


const filePath = process.argv[ 2 ]

if( !filePath ) {
    console.log( 'Usage: node tests/manual/json-file-test.mjs <path-to-json>' )
    process.exit( 1 )
}

const raw = fs.readFileSync( filePath, 'utf-8' )
const jsonData = JSON.parse( raw )

const items = jsonData
    .map( ( entry ) => {
        const item = {
            'contract_address': entry[ 'factory_address' ],
            'pair': entry[ 'pool_address' ],
            'token1': entry[ 'token1_address' ],
            'token2': entry[ 'token2_address' ]
        }

        return item
    } )

const tp = new TriangularPairs( true )
const pairsEncoded = tp.encodePairs( { items } )
tp.start( { pairsEncoded } )

const tokens = tp.getTokens()
const pairs = tp.getPairs()
const triangularPairs = tp.getTriangularPairs()

const space = 24

console.log( '' )
console.log( 'JSON File Test' )
console.log( `  File${' '.repeat( space - 4 )}${filePath}` )
console.log( `  Items${' '.repeat( space - 5 )}${items.length}` )
console.log( `  Tokens${' '.repeat( space - 6 )}${Object.keys( tokens ).length}` )
console.log( `  Pairs${' '.repeat( space - 5 )}${pairs.length}` )
console.log( `  Triangular Pairs${' '.repeat( space - 16 )}${triangularPairs.length}` )
console.log( '' )
