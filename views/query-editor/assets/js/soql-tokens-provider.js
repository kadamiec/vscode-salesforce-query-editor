const keywords = [
    'yesterday',
    'today',
    'tomorrow',
    'last_week',
    'this_week',
    'next_week',
    'last_month',
    'this_month',
    'next_month',
    'last_90_days',
    'next_90_days',
    'this_quarter',
    'last_quarter',
    'next_quarter',
    'this_year',
    'last_year',
    'next_year',
    'this_fiscal_quarter',
    'last_fiscal_quarter',
    'next_fiscal_quarter',
    'this_fiscal_year',
    'last_fiscal_year',
    'next_fiscal_year',
    'select',
    'from',
    'where',
    'like',
    'and',
    'order',
    'by',
    'desc',
    'nulls',
    'last',
    'limit',
    'asc',
    'count',
    'group',
    'having',
    'offset',
    'typeof',
    'when',
    'then',
    'else',
    'end',
    'avg',
    'rollup',
    'grouping',
    'cube',
    'first',
    'in',
    'or',
    'not',
    'foo',
    'with',
    'data',
    'category',
    'above',
    'at',
    'for',
    'view',
    'reference',
    'update',
    'tracking',
    'viewstat',
    'format',
    'min',
    'true',
    'false',
    'security',
    'case',
    'null',
    'calendar',
    'sum',
    'includes',
    'next',
    'using',
    'scope',
    'hour',
    'distance',
    'geolocation',
    'toLabel',
    'convertCurrency',
    'all',
    'rows',
]

const uppercaseFirstLetter = (lowercase) => lowercase.charAt(0).toUpperCase() + lowercase.substr(1)

const keywordsWithCaseVariations = []
keywords.forEach((lowercase) => {
    keywordsWithCaseVariations.push(lowercase)
    keywordsWithCaseVariations.push(lowercase.toUpperCase())
    keywordsWithCaseVariations.push(uppercaseFirstLetter(lowercase))
})

const soqlTokensProvider = {
defaultToken: '',
tokenPostfix: '.soql',

keywords: keywordsWithCaseVariations,

operators: [
    '=',
    '>',
    '<',
    '!',
    '~',
    '?',
    ':',
    '==',
    '<=',
    '>=',
    '!=',
    '&&',
    '||',
    '++',
    '--',
    '+',
    '-',
    '*',
    '/',
    '&',
    '|',
    '^',
    '%',
    '<<',
    '>>',
    '>>>',
    '+=',
    '-=',
    '*=',
    '/=',
    '&=',
    '|=',
    '^=',
    '%=',
    '<<=',
    '>>=',
    '>>>=',
],

// we include these common regular expressions
symbols: /[=><!~?:&|+\-*\/\^%]+/,
escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
digits: /\d+(_+\d+)*/,
octaldigits: /[0-7]+(_+[0-7]+)*/,
binarydigits: /[0-1]+(_+[0-1]+)*/,
hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

// The main tokenizer for our languages
tokenizer: {
    root: [
    [
        /[+-]?\d{4}(-[01]\d(-[0-3]\d(T[0-2]\d:[0-5]\d:?([0-5]\d(\.\d+)?)?([+-][0-2]\d:[0-5]\d)?Z?)?)?)?/,
        { token: 'number.datetime', log: 'datetime token: $0' },
    ],
    [
        /((last|next)_n_(days|weeks|months|quarters|years|fiscal_quarters|fiscal_years))|((LAST|NEXT)_N_(DAYS|WEEKS|MONTHS|QUARTERS|YEARS|FISCAL_QUARTERS|FISCAL_YEARS)):\d+/,
        { token: 'keyword.dynamic' },
    ],
    // identifiers and keywords
    [
        /[a-z_$][\w$]*/,
        {
        cases: {
            '@keywords': { token: 'keyword.$0' },
            '@default': 'identifier',
        },
        },
    ],

    // assume that identifiers starting with an uppercase letter are types
    [
        /[A-Z][\w\$]*/,
        {
        cases: {
            '@keywords': { token: 'keyword.$0' },
            '@default': 'type.identifier',
        },
        },
    ],

    // whitespace
    { include: '@whitespace' },

    // delimiters and operators
    [/[{}()\[\]]/, '@brackets'],
    [/[<>](?!@symbols)/, '@brackets'],
    [
        /@symbols/,
        {
        cases: {
            '@operators': 'delimiter',
            '@default': '',
        },
        },
    ],

    // @ annotations.
    [/@\s*[a-zA-Z_\$][\w\$]*/, 'annotation'],

    // numbers

    [/(@digits)[eE]([\-+]?(@digits))?[fFdD]?/, 'number.float'],
    [/(@digits)\.(@digits)([eE][\-+]?(@digits))?[fFdD]?/, 'number.float'],
    [/(@digits)[fFdD]/, 'number.float'],
    [/(@digits)[lL]?/, 'number'],

    // delimiter: after number because of .\d floats
    [/[;,.]/, 'delimiter'],

    // strings
    [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
    [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-teminated string
    [/"/, 'string', '@string."'],
    [/'/, 'string', "@string.'"],

    // characters
    [/'[^\\']'/, 'string'],
    [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
    [/'/, 'string.invalid'],
    ],

    whitespace: [
    [/[ \t\r\n]+/, ''],
    [/\/\*\*(?!\/)/, 'comment.doc', '@apexdoc'],
    [/\/\*/, 'comment', '@comment'],
    [/\/\/.*$/, 'comment'],
    ],

    comment: [
    [/[^\/*]+/, 'comment'],
    // [/\/\*/, 'comment', '@push' ],    // nested comment not allowed :-(
    // [/\/\*/,    'comment.invalid' ],    // this breaks block comments in the shape of /* //*/
    [/\*\//, 'comment', '@pop'],
    [/[\/*]/, 'comment'],
    ],

    // Identical copy of comment above, except for the addition of .doc
    apexdoc: [
    [/[^\/*]+/, 'comment.doc'],
    [/\*\//, 'comment.doc', '@pop'],
    [/[\/*]/, 'comment.doc'],
    ],

    string: [
    [/[^\\"']+/, 'string'],
    [/@escapes/, 'string.escape'],
    [/\\./, 'string.escape.invalid'],
    [
        /["']/,
        {
        cases: {
            '$#==$S2': { token: 'string', next: '@pop' },
            '@default': 'string',
        },
        },
    ],
    ],
},
}

module.exports = soqlTokensProvider;