import fs from 'fs'
import path from 'path'
import { TriangularPairs } from '../../src/TriangularPairs.mjs'


const folderPath = process.argv[ 2 ]

if( !folderPath ) {
    console.log( 'Usage: node tests/manual/json-folder-test.mjs <path-to-folder>' )
    process.exit( 1 )
}

const resolvedPath = path.resolve( folderPath )

const fileNames = fs.readdirSync( resolvedPath )
    .filter( ( fileName ) => fileName.endsWith( '.json' ) )
    .sort( ( a, b ) => {
        const numA = parseInt( a.split( '-' )[ 0 ] )
        const numB = parseInt( b.split( '-' )[ 0 ] )

        return numA - numB
    } )

console.log( '' )
console.log( `JSON Folder Test` )
console.log( `  Folder                  ${folderPath}` )
console.log( `  Files                   ${fileNames.length}` )
console.log( '' )
console.log( `  Loading files...` )

const items = fileNames
    .reduce( ( acc, fileName, index ) => {
        const filePath = path.join( resolvedPath, fileName )
        const raw = fs.readFileSync( filePath, 'utf-8' )
        const jsonData = JSON.parse( raw )

        const mapped = jsonData
            .map( ( entry ) => {
                const item = {
                    'contract_address': entry[ 'factory_address' ],
                    'pair': entry[ 'pool_address' ],
                    'token1': entry[ 'token1_address' ],
                    'token2': entry[ 'token2_address' ]
                }

                return item
            } )

        console.log( `    [${index + 1}/${fileNames.length}] ${fileName} (${jsonData.length} items)` )

        return [ ...acc, ...mapped ]
    }, [] )

console.log( '' )
console.log( `  Total Items             ${items.length}` )
console.log( `  Starting algorithm...` )
console.log( '' )

const tp = new TriangularPairs( true )
const pairsEncoded = tp.encodePairs( { items } )
tp.start( { pairsEncoded } )

const tokens = tp.getTokens()
const pairs = tp.getPairs()
const triangularPairs = tp.getTriangularPairs()

const space = 26

console.log( 'Results' )
console.log( `  Tokens${' '.repeat( space - 6 )}${Object.keys( tokens ).length}` )
console.log( `  Pairs${' '.repeat( space - 5 )}${pairs.length}` )
console.log( `  Triangular Pairs${' '.repeat( space - 16 )}${triangularPairs.length}` )
console.log( '' )
