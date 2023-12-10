const config = {
    'import': {
        'parse': [ 'contract', 'pair', 'tokenA', 'tokenB' ],
        'splitter': '_'
    },
    'internal': {
        'splitter': {
            'id': '_',
            'pairs': '__'
        }
    },
    'console': {
        'space': 40
    },
    'validation': {
        'ethereumAddress': {
            'regex': /^0x[a-fA-F0-9]{40}$/,
            'description': ``
        }
    }
}


export { config }