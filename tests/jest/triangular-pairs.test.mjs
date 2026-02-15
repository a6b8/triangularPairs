import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { TriangularPairs } from '../../src/TriangularPairs.mjs'


describe( 'TriangularPairs', () => {
    let instance

    beforeEach( () => {
        instance = new TriangularPairs( true )
    } )


    describe( 'constructor', () => {
        test( 'creates instance with silent mode', () => {
            const tp = new TriangularPairs( true )

            expect( tp ).toBeInstanceOf( TriangularPairs )
            expect( tp.silent ).toBe( true )
        } )


        test( 'creates instance without silent mode', () => {
            const tp = new TriangularPairs( false )

            expect( tp ).toBeInstanceOf( TriangularPairs )
            expect( tp.silent ).toBe( false )
        } )


        test( 'is an EventEmitter', () => {
            const tp = new TriangularPairs( true )

            expect( typeof tp.on ).toBe( 'function' )
            expect( typeof tp.emit ).toBe( 'function' )
        } )
    } )


    describe( 'encodePairs', () => {
        test( 'encodes items array into underscore-separated strings', () => {
            const items = [
                {
                    'contract_address': '0xContract1',
                    'pair': 'PAIR1',
                    'token1': '0xTokenA',
                    'token2': '0xTokenB'
                }
            ]

            const result = instance.encodePairs( { items } )

            expect( Array.isArray( result ) ).toBe( true )
            expect( result.length ).toBe( 1 )
            expect( result[ 0 ] ).toBe( '0xContract1_PAIR1_0xTokenA_0xTokenB' )
        } )


        test( 'encodes multiple items', () => {
            const items = [
                {
                    'contract_address': '0xC1',
                    'pair': 'P1',
                    'token1': '0xA',
                    'token2': '0xB'
                },
                {
                    'contract_address': '0xC2',
                    'pair': 'P2',
                    'token1': '0xC',
                    'token2': '0xD'
                }
            ]

            const result = instance.encodePairs( { items } )

            expect( result.length ).toBe( 2 )
            expect( result[ 0 ] ).toBe( '0xC1_P1_0xA_0xB' )
            expect( result[ 1 ] ).toBe( '0xC2_P2_0xC_0xD' )
        } )


        test( 'returns empty array for empty input', () => {
            const result = instance.encodePairs( { items: [] } )

            expect( result ).toEqual( [] )
        } )
    } )


    describe( 'health', () => {
        test( 'returns true for valid pairsEncoded', () => {
            const pairsEncoded = [
                '0xContract1_PAIR1_0xTokenA_0xTokenB'
            ]

            const result = instance.health( { pairsEncoded } )

            expect( result ).toBe( true )
        } )
    } )


    describe( 'start + getters', () => {
        const pairsEncoded = [
            '0xC1_P1_0xA_0xB',
            '0xC2_P2_0xB_0xC',
            '0xC3_P3_0xC_0xA'
        ]


        test( 'start returns the instance for chaining', () => {
            const result = instance.start( { pairsEncoded } )

            expect( result ).toBe( instance )
        } )


        test( 'getTokens returns tokens after start', () => {
            instance.start( { pairsEncoded } )
            const tokens = instance.getTokens()

            expect( tokens ).toBeDefined()
            expect( typeof tokens ).toBe( 'object' )
            expect( Object.keys( tokens ).length ).toBeGreaterThan( 0 )
        } )


        test( 'getPairs returns pairs after start', () => {
            instance.start( { pairsEncoded } )
            const pairs = instance.getPairs()

            expect( pairs ).toBeDefined()
            expect( Array.isArray( pairs ) ).toBe( true )
            expect( pairs.length ).toBeGreaterThan( 0 )
        } )


        test( 'getTriangularPairs returns triangular pairs after start', () => {
            instance.start( { pairsEncoded } )
            const triangularPairs = instance.getTriangularPairs()

            expect( triangularPairs ).toBeDefined()
            expect( Array.isArray( triangularPairs ) ).toBe( true )
        } )


        test( 'tokens contain all unique token addresses', () => {
            instance.start( { pairsEncoded } )
            const tokens = instance.getTokens()
            const tokenKeys = Object.keys( tokens )

            expect( tokenKeys ).toContain( '0xA' )
            expect( tokenKeys ).toContain( '0xB' )
            expect( tokenKeys ).toContain( '0xC' )
            expect( tokenKeys.length ).toBe( 3 )
        } )


        test( 'each token has id and pairs array', () => {
            instance.start( { pairsEncoded } )
            const tokens = instance.getTokens()

            Object.values( tokens ).forEach( ( token ) => {
                expect( token ).toHaveProperty( 'id' )
                expect( token ).toHaveProperty( 'pairs' )
                expect( Array.isArray( token.pairs ) ).toBe( true )
                expect( typeof token.id ).toBe( 'number' )
            } )
        } )


        test( 'pairs have correct structure', () => {
            instance.start( { pairsEncoded } )
            const pairs = instance.getPairs()

            pairs.forEach( ( pair ) => {
                expect( pair ).toHaveProperty( 'tokenA' )
                expect( pair ).toHaveProperty( 'tokenB' )
                expect( pair ).toHaveProperty( 'contracts' )
                expect( pair ).toHaveProperty( 'id' )
                expect( Array.isArray( pair.contracts ) ).toBe( true )
            } )
        } )


        test( 'triangular pairs have correct structure', () => {
            instance.start( { pairsEncoded } )
            const triangularPairs = instance.getTriangularPairs()

            triangularPairs.forEach( ( tp ) => {
                expect( tp ).toHaveProperty( 'index' )
                expect( tp ).toHaveProperty( 'tokenId' )
                expect( tp ).toHaveProperty( 'pairId' )
                expect( tp ).toHaveProperty( 'pairs' )
                expect( Array.isArray( tp.pairs ) ).toBe( true )
                expect( tp.pairs.length ).toBe( 3 )
            } )
        } )
    } )


    describe( 'events', () => {
        test( 'emits progress events during start', () => {
            const events = []
            instance.on( 'progress', ( data ) => {
                events.push( data )
            } )

            const pairsEncoded = [
                '0xC1_P1_0xA_0xB',
                '0xC2_P2_0xB_0xC',
                '0xC3_P3_0xC_0xA'
            ]

            instance.start( { pairsEncoded } )

            expect( events.length ).toBeGreaterThan( 0 )

            const phases = events.map( ( e ) => e.phase )

            expect( phases ).toContain( 'addPairList' )
            expect( phases ).toContain( 'addUniquess' )
            expect( phases ).toContain( 'addTriangular' )
        } )
    } )


    describe( 'duplicate contracts', () => {
        test( 'handles multiple contracts for the same token pair', () => {
            const pairsEncoded = [
                '0xC1_P1_0xA_0xB',
                '0xC4_P4_0xA_0xB',
                '0xC2_P2_0xB_0xC',
                '0xC3_P3_0xC_0xA'
            ]

            instance.start( { pairsEncoded } )
            const pairs = instance.getPairs()

            const pairWithMultipleContracts = pairs.find( ( p ) => p.contracts.length > 1 )

            expect( pairWithMultipleContracts ).toBeDefined()
            expect( pairWithMultipleContracts.contracts.length ).toBe( 2 )
        } )


        test( 'handles reversed token order in duplicate pair', () => {
            const pairsEncoded = [
                '0xC1_P1_0xA_0xB',
                '0xC4_P4_0xB_0xA',
                '0xC2_P2_0xB_0xC',
                '0xC3_P3_0xC_0xA'
            ]

            instance.start( { pairsEncoded } )
            const pairs = instance.getPairs()

            const pairWithMultipleContracts = pairs.find( ( p ) => p.contracts.length > 1 )

            expect( pairWithMultipleContracts ).toBeDefined()
            expect( pairWithMultipleContracts.contracts.length ).toBe( 2 )
        } )
    } )


    describe( 'validation edge cases', () => {
        test( 'health exits on non-array pairsEncoded', () => {
            const mockExit = jest.spyOn( process, 'exit' ).mockImplementation( () => {
                throw new Error( 'process.exit called' )
            } )

            expect( () => {
                instance.health( { pairsEncoded: 'not-an-array' } )
            } ).toThrow( 'process.exit called' )

            mockExit.mockRestore()
        } )


        test( 'health exits on non-string items in array', () => {
            const mockExit = jest.spyOn( process, 'exit' ).mockImplementation( () => {
                throw new Error( 'process.exit called' )
            } )

            expect( () => {
                instance.health( { pairsEncoded: [ 123, 456 ] } )
            } ).toThrow( 'process.exit called' )

            mockExit.mockRestore()
        } )


        test( 'health exits on wrong structure format', () => {
            const mockExit = jest.spyOn( process, 'exit' ).mockImplementation( () => {
                throw new Error( 'process.exit called' )
            } )

            expect( () => {
                instance.health( { pairsEncoded: [ 'missing-separators' ] } )
            } ).toThrow( 'process.exit called' )

            mockExit.mockRestore()
        } )
    } )


    describe( 'getters before start', () => {
        test( 'getTokens returns undefined before start', () => {
            const tokens = instance.getTokens()

            expect( tokens ).toBeUndefined()
        } )


        test( 'getPairs returns undefined before start', () => {
            const pairs = instance.getPairs()

            expect( pairs ).toBeUndefined()
        } )


        test( 'getTriangularPairs returns undefined before start', () => {
            const triangularPairs = instance.getTriangularPairs()

            expect( triangularPairs ).toBeUndefined()
        } )
    } )


    describe( 'non-silent mode', () => {
        test( 'runs start without silent mode', () => {
            const tp = new TriangularPairs( false )
            const mockWrite = jest.spyOn( process.stdout, 'write' ).mockImplementation( () => true )
            const mockLog = jest.spyOn( console, 'log' ).mockImplementation( () => {} )

            if( !process.stdout.moveCursor ) {
                process.stdout.moveCursor = () => true
            }
            if( !process.stdout.clearLine ) {
                process.stdout.clearLine = () => true
            }

            const pairsEncoded = [
                '0xC1_P1_0xA_0xB',
                '0xC2_P2_0xB_0xC',
                '0xC3_P3_0xC_0xA'
            ]

            const result = tp.start( { pairsEncoded } )

            expect( result ).toBe( tp )

            mockWrite.mockRestore()
            mockLog.mockRestore()
        } )
    } )
} )
