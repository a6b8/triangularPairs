import { TriangularPairs } from './../src/TriangularPairs.mjs'
import fs from 'fs'
import { pairs } from './data/pairs-all.mjs'




const triangularPairs  = new TriangularPairs ()

const pairsEncoded = triangularPairs
    .encodePairs( { 'items': pairs['data'] } )
triangularPairs.start( { pairsEncoded } )

const files = [
    [ triangularPairs.getTokens(), 'tokens.json' ],
    [ triangularPairs.getPairs(), 'pairs.json' ],
    [ triangularPairs.getTriangularPairs(), 'triangularPairs.json' ]
]
    .forEach( a => {
        const [ value, fileName ] = a  
        let path = ''
        path += './dataTest/'
        path += fileName
        fs.writeFileSync(
            path, 
            JSON.stringify( value, null, 4 ), 
            'utf-8' 
        )
    } )

