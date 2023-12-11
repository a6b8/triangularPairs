import { TriangularPairs } from './../src/TriangularPairs.mjs'
import { selection } from './pairs-selection.mjs'

const triangularPairs  = new TriangularPairs ()
const pairsEncoded = triangularPairs
    .encodePairs( { 'items': selection['data'] } )
triangularPairs.health( { pairsEncoded } )

console.log( 'Success!' )
process.exit( 0 )
