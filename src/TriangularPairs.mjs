import fs from 'fs'
import { config } from './data/config.mjs'
import { printMessages } from './helpers/mixed.mjs'


export class TriangularPairs {
    #config
    #tokens
    #pairs
    #triangularPairs


    constructor( silent ) {
        this.#config = config
        this.silent = silent

        return true
    }


    start( { pairsEncoded } ) {
        const [ messages, comments ] = this.#validatePairsEncoded( { pairsEncoded } )
        printMessages( { messages, comments } )

        this.#consolePrintLine( { 'value1':'TRIANGULAR PAIR', 'value2': '', 'part': 'both' } )

        this.#addPairList( { pairsEncoded } )
        const uniques = this.#addUniquess()
        this.#addTriangular( { 'uniques': uniques } )

        return this
    }


    encodePairs( { items } ) {
        return items
            .map( pair => {
                return [ 'contract_address', 'pair', 'token1', 'token2' ]
                    .map( key => pair[ key ] )
                    .join( this.#config['import']['splitter'] )
            } )
    }


    getTokens() {
        return this.#tokens
    }


    getPairs() {
        return this.#pairs
    }


    getTriangularPairs() {
        return this.#triangularPairs
    }


    health( { pairsEncoded } ) {
        const [ messages, comments ] = this.#validatePairsEncoded( { pairsEncoded } )
        printMessages( { messages, comments } )

        return true
    }


    #addPairList( { pairsEncoded } ) {
        this.#consolePrintLine( { 'value1':'  Add PairList', 'value2': '', 'part': 'both' } )

        const all_pairs = pairsEncoded
            .map( ( pairEncoded, index ) => {
                const struct = {
                    'index': null,
                    // 'id': null,
                    'contract': null,
                    'pair': null,
                    'tokenA': null,
                    'tokenB': null
                    // 'hash': null
                }

                if( index % 1000 == 0 ) {
                    const progress = `${Math.floor( ( index * 100 ) / pairsEncoded.length )} % (${index})`
                    this.#consolePrintLine( { 'value1':'  Add PairList', 'value2': `${progress}`, 'part': 'update' } )
                }

                const pair = pairEncoded
                    .split( this.#config['import']['splitter'] )
                    .reduce( ( acc, a, index ) => {
                        const key = this.#config['import']['parse'][ index ]
                        acc[ key ] = a 
                        return acc
                    }, {} )

                struct['contract'] = pair['contract']
                struct['pair'] = pair['pair']

                struct['index'] = index

                const n = [ 
                    'tokenA', 
                    'tokenB'
                ]
                    .forEach( key => {
                        struct[ key ] = pair[ key ]
                    } )

                return struct
            }, {} )

        const pairsAsTree = all_pairs
            .reduce( ( acc, item, index ) => {
                const id = [
                    item['tokenA'],
                    item['tokenB']
                ]
                    .sort()
                    .join( this.#config['internal']['splitter']['id'] )
// console.log('item', item )
// process.exit( 1 )
                if( !Object.hasOwn( acc, id ) ) {
                    acc[ id ] = {}
                    Object
                        .entries( item )
                        .forEach( a => {
                            const [ key, value ] = a
                            if( key === 'contract' ) {
                                acc[ id ]['contracts'] = []
                                const itm = {
                                    'contract': value,
                                    'pair': item['pair'],
                                    'base': 'tokenA',
                                    'quote': 'tokenB'
                                }
                                acc[ id ]['contracts'].push( itm )
                            } else {
                                if( key === 'pair' ) {} else {
                                    acc[ id ][ key ] = value
                                }
                            }
                        } )
                } else {
                    const itm = {
                        'contract': null,
                        'pair': item['pair'],
                        'base': null,
                        'quote': null
                    }

                    itm['contract'] = item['contract']
                    if( item['tokenA'] === acc[ id ][ acc[ id ]['contracts'][ 0 ]['base'] ] ) {
                        itm['base'] = 'tokenA'
                        itm['quote'] = 'tokenB'
                    } else {
                        itm['base'] = 'tokenB'
                        itm['quote'] = 'tokenA'
                    }
                    acc[ id ]['contracts'].push( itm )
                }

                return acc
            }, {} )

        this.#pairs = Object
            .entries( pairsAsTree )
            .map( a => {
                const [ key, value ] = a 
                value['id'] = key
                return value
            } )

        this.#tokens = this.#pairs
            .reduce( ( acc, pair, index ) => {
                
                const n = [ 
                    'tokenA', 
                    'tokenB'
                ]
                    .forEach( key => {
                        const address = pair[ key ]

                        // struct[ key ] = address
                        if( !Object.hasOwn( acc, address ) ) {
                            acc[ address ] = {
                                'id': null,
                                'pairs': []
                            }
                        }

                        acc[ address ]['pairs'].push( index )
                    } )
                return acc
            }, {} )

        const contractTotal = this.#pairs
            .reduce( ( acc, a, index ) => {
                a['contracts'].forEach( a => acc.add( a['contract'] ) )
                return acc
            }, new Set() )

        const str = [
            [ `${Object.keys( this.#tokens ).length}`, 'Token' ],
            [ `${this.#pairs.length}`, 'Pair' ],
            [ `${contractTotal.size}`, 'Contract' ],
        ]
            .map( a => `${a[ 0 ]} ${a[ 1 ]}${a[ 0 ] > 1 ? 's' : ''}` )
            .join( ', ' )

        this.#consolePrintLine( { 'value1':'  Add PairList', 'value2': `${str}`, 'part': 'update' } )

        Object
            .keys( this.#tokens )
            .forEach( ( key, index ) => {
                this.#tokens[ key ]['id'] = index
            } )

        return true
    }


    #addUniquess() {
        this.#consolePrintLine( { 'value1':'  Add Uniquess', 'value2': '', 'part': 'both' } )
        const uniques = {}
        const tmp = this.#pairs
            .reduce( ( aaa, pair, index ) => {
                if( index % 100 == 0 ) {
                    const progress = `${Math.floor( ( index * 100 ) / this.#pairs.length )} % (${index})`
                    this.#consolePrintLine( { 'value1':'  Add Uniquess', 'value2': `${progress}`, 'part': 'update' } )
                }

                const n = [
                    [ this.#tokens[ pair['tokenA'] ]['pairs'].length, false ],
                    [ this.#tokens[ pair['tokenB'] ]['pairs'].length, true ]
                ]
                    .reduce( ( acc, a ) => {
                        if( a[ 0 ] > acc[ 0 ] ) {
                            acc[ 0 ] = a[ 0 ]
                            acc[ 1 ] = a[ 1 ]
                        }
                        return acc 
                    }, [ 0, 'n/a' ] )

                const search_key = n[ 1 ] ? 'tokenA' : 'tokenB'
                const search_key_start = n[ 1 ] ? 'tokenB' : 'tokenA'

                const start =  pair[ search_key_start ]
                const search = pair[ search_key ]

                const seconds = this.#tokens[ search ]['pairs']
                    .filter( id => {
                        const aa = this.#pairs[ id ]['tokenA'] === search ? 1 : 0
                        const bb = this.#pairs[ id ]['tokenB'] === search ? 1 : 0

                        if( ( aa + bb ) === 1  ) {
                            const cc = this.#pairs[ id ]['tokenA'] === start ? 1 : 0
                            const dd = this.#pairs[ id ]['tokenB'] === start ? 1 : 0

                            if( ( cc + dd ) === 0 ) {
                                return true
                            } else {
                                return false
                            }
                        } else {
                            return false
                        }
                    } )
                    .reduce( ( abb, pair_id2, rindex ) => {
                        let search_key_2 = this.#pairs[ pair_id2 ]['tokenA'] === search ? 'tokenB' : 'tokenA' 
                        let search_key_start2 = this.#pairs[ pair_id2 ]['tokenA'] === search ? 'tokenA' : 'tokenB'

                        const address = this.#pairs[ pair_id2 ][ search_key_2 ]
                        const rel = this.#tokens[ address ]['pairs']
                            .find( pair_id3 => {
                                const ee = this.#pairs[ pair_id3 ]['tokenA'] === start ? 1 : 0
                                const ff = this.#pairs[ pair_id3 ]['tokenB'] === start ? 1 : 0

                                if( ( ee + ff ) === 1 ) {
                                    return true
                                } else {
                                    return false
                                } 
                            } )

                        if( rel !== undefined ) {
                            if( !Object.hasOwn( abb, pair_id2 ) ) {
                                abb[ pair_id2 ] = null
                            }

                            abb[ pair_id2 ] = rel
                        }
                        
                        return abb
                    }, {} )

                if( Object.keys( seconds ).length !== 0 ) {
                    const str = Object
                        .entries( seconds )
                        .forEach( ( itm, jindex ) => {
                            const [ key, value ] = itm
                            const pairs_final = new Array( 3 )
                                .fill( '' )
                                .map( ( aa, kindex ) => {   
                                    
                                    switch( kindex ) {
                                        case 0:
                                            return [ parseInt( index ), kindex ]
                                            break
                                        case 1: 
                                            return [ parseInt( key ), kindex ]
                                            break
                                        case 2:
                                            return [ parseInt( value ), kindex ]
                                            break
                                        default:
                                            console.log( 'Error!' )
                                    }
                                } )
                                .sort( ( a, b ) => a[ 0 ] - b[ 0 ] )
                                //.join( '_' )

                            const key_output = pairs_final.map( a => a[ 0 ] ).join( '_' )
                            const value_output = pairs_final.map( a => a[ 1 ] )
                            uniques[ key_output ] = value_output
                        } )   
                }

                return aaa
            }, {} )

        this.#consolePrintLine( { 'value1':'  Add Uniques', 'value2': `${Object.keys( uniques ).length} Triangular Pairs.`, 'part': 'update' } )

        return uniques
    }


    #addTriangular( { uniques } ) {
        this.#consolePrintLine( { 'value1':'  Add Triangular', 'value2': '', 'part': 'start' } )

        this.#triangularPairs = Object
            .entries( uniques )
            .map( ( a, index ) => {
                const [ key, value ] = a

                const struct = {
                    'index': null,
                    'tokenId': null,
                    'pairId': key,
                    'pairs': []
                }

                struct['index'] = index
                struct['pairs'] = key
                    .split( '_' )
                    .map( ( b, rindex ) => {
                        const itm = {
                            'pairId': parseInt( b ),
                            'order':value[ rindex ]
                        }

                    return itm
                    } )

                struct['tokenId'] = struct['pairs']
                    .sort( ( a, b ) => struct['order'] - struct['order'] )
                    .map( ( pair, rindex ) => {
                        return [ 'tokenA', 'tokenB' ]
                            .map( key => {
                                const tokenKey = this.#pairs[ pair['pairId'] ][ key ]
                                const number = this.#tokens[ tokenKey ]['id']
                                return number
                            } )
                    } )
                    .reduce( ( acc, currentPair, i, arr ) => {
                        const cmd = [ 'forward', 'switch' ]

                        let result = [ currentPair ]
                        switch( i ) {
                            case  0:
                                const start = currentPair.filter( b => arr[ 2 ].includes( b ) )[ 0 ]
                                result.push( cmd[ currentPair.findIndex( b => b === start ) ] )
                                break
                            case 1:
                                if( acc[ 0 ] === 'forward' ) {
                                    result.push( cmd[ arr[ 1 ].findIndex( b => b === currentPair[ 1 ] ) ] )
                                } else {
                                    result.push( cmd[ arr[ 1 ].findIndex( b => b === currentPair[ 0 ] ) ] )
                                }
                                break
                            case 2:
                                const start2 = currentPair.filter( b => arr[ 2 ].includes( b ) )[ 0 ]
                                if( start2 !== arr[ 2 ][ 0 ] ) {
                                    result.push( cmd[ 0 ] )
                                } else {
                                    result.push( cmd[ 1 ] )
                                }
                                break
                            default:
                                break
                        }

                        acc.push( result )

                        return acc
                    }, [] )
                    .map( a => {
                        if( a[ 1 ] === 'forward' ) {
                            return a[ 0 ].join( this.#config['internal']['splitter']['id'] )
                        } else {
                            return a[ 0 ].reverse().join( this.#config['internal']['splitter']['id'] )
                        }
                    } )
                    .join( this.#config['internal']['splitter']['pairs'] )

                return struct
            } )

        this.#consolePrintLine( { 'value1':'  Add Triangular', 'value2': '', 'part': 'end' } )

        return true
    }


    #validatePairsEncoded( { pairsEncoded } ) {
        let messages = []
        let comments = []

        if( !Array.isArray( pairsEncoded ) ) {
            messages.push( `Key 'pairsEncoded' is not type of array.` )
        } else {
            const regex = new RegExp( config['import']['splitter'], 'g' )
            const msgs = pairsEncoded
                .reduce( ( acc, a, index ) => {
                    if( typeof a !== 'string' ) {
                        acc.push( `Item in key 'pairsEncoded' is not type of string.` )
                    } else if( ( pairsEncoded[ 0 ].match( regex ) || [] ).length === 3 ) {
                    } else {
                        acc.push( `Item in key 'pairsEncoded' has not the right structure. Use contract_pair_tokenA_tokenB.` )
                    }
                    return acc
                }, [] )
                .filter( ( v, i, a ) => a.indexOf( v ) === i )
            messages = [ ...messages, ...msgs ] 
        }

        return [ messages, comments ]
    }


    #consolePrintLine( { value1='', value2='', part } ) {
        if( this.silent ) { 
            return true 
        }
    
        const l = this.#config['console']['space']

        value1 = value1 + ''
        value2 = value2 + ''
     
        switch( part ) {
            case 'start': 
                let str1 = ''
                str1 += value1
                str1 += new Array( l - ( value1 + '').length ).fill( ' ' ).join( '' )
                !this.silent ? process.stdout.write( str1 ) : ''
                break
            case 'progress': 
                !this.silent ? process.stdout.write( value2 ) : ''
                break
            case 'update':
                let str4 = ''
                str4 += value1
                str4 += new Array( l - ( value1 + '').length ).fill( ' ' ).join( '' )
                str4 += value2

                !this.silent ? process.stdout.moveCursor( 0, -1 ) : ''
                !this.silent ? process.stdout.clearLine( 1 ) : ''
                !this.silent ? console.log( str4 ) : ''
                break
            case 'error': 
                !this.silent ? console.log( `${this.#config['console']['symbols']['failed']} ${value1}` ) : ''
                break
            case 'end':
                let str2 = ''
                str2 += value2
                !this.silent ? console.log( str2 ) : ''
                break
            case 'both':
                let str3 = ''
                    str3 += value1
                    str3 += new Array( l - ( value1 + '').length ).fill( ' ' ).join( '' )
                    str3 += value2
         
                    !this.silent ? console.log( str3 ) : ''
                break
        }
    }
}