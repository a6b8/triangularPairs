import { TriangularPairs } from './../src/TriangularPairs.mjs'
import { selection } from './pairs-selection.mjs'
import { config } from './../src/data/config.mjs'


const pairsEncoded = selection['data']
    .map( pair => {
        const pairEncoded = [
            pair['contract_address'],
            pair['pair'],
            pair['token1'],
            pair['token2']
        ]
            .join( config['import']['splitter'] + '-' )

        return pairEncoded
    } )

const triangularPairs  = new TriangularPairs ()
triangularPairs.health( { pairsEncoded } )

console.log( 'Success!' )
process.exit( 0 )
