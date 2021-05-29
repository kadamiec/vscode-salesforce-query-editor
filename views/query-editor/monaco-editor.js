// Register a new language
monaco.languages.register({ id: 'mySpecialLanguage' });

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
  'last_n_days ',
  'next_n_days ',
  'next_n_weeks ',
  'last_n_weeks ',
  'next_n_months ',
  'last_n_months ',
  'this_quarter',
  'last_quarter',
  'next_quarter',
  'next_n_quarters ',
  'last_n_quarters ',
  'this_year',
  'last_year',
  'next_year',
  'next_n_years ',
  'last_n_years ',
  'this_fiscal_quarter',
  'last_fiscal_quarter',
  'next_fiscal_quarter',
  'next_n_fiscal_​quarters ',
  'last_n_fiscal_​quarters ',
  'this_fiscal_year',
  'last_fiscal_year',
  'next_fiscal_year',
  'next_n_fiscal_​years ',
  'last_n_fiscal_​years ',
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
  'geolocation'
];

// create case variations of the keywords - apex is case insensitive, but we can't make the highlighter case insensitive
// because we use a heuristic to assume that identifiers starting with an upper case letter are types.
const uppercaseFirstLetter = (lowercase) =>
	lowercase.charAt(0).toUpperCase() + lowercase.substr(1);

let keywordsWithCaseVariations = [];
keywords.forEach((lowercase) => {
	keywordsWithCaseVariations.push(lowercase);
	keywordsWithCaseVariations.push(lowercase.toUpperCase());
	keywordsWithCaseVariations.push(uppercaseFirstLetter(lowercase));
});

// Register a tokens provider for the language
monaco.languages.setMonarchTokensProvider('mySpecialLanguage', {
	defaultToken: '',
	tokenPostfix: '.apex',

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
		'>>>='
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
			// identifiers and keywords
			[
				/[a-z_$][\w$]*/,
				{
					cases: {
						'@keywords': { token: 'keyword.$0' },
						'@default': 'identifier'
					}
				}
			],

			// assume that identifiers starting with an uppercase letter are types
			[
				/[A-Z][\w\$]*/,
				{
					cases: {
						'@keywords': { token: 'keyword.$0' },
						'@default': 'type.identifier'
					}
				}
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
						'@default': ''
					}
				}
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
			[/'/, 'string.invalid']
		],

		whitespace: [
			[/[ \t\r\n]+/, ''],
			[/\/\*\*(?!\/)/, 'comment.doc', '@apexdoc'],
			[/\/\*/, 'comment', '@comment'],
			[/\/\/.*$/, 'comment']
		],

		comment: [
			[/[^\/*]+/, 'comment'],
			// [/\/\*/, 'comment', '@push' ],    // nested comment not allowed :-(
			// [/\/\*/,    'comment.invalid' ],    // this breaks block comments in the shape of /* //*/
			[/\*\//, 'comment', '@pop'],
			[/[\/*]/, 'comment']
		],

		//Identical copy of comment above, except for the addition of .doc
		apexdoc: [
			[/[^\/*]+/, 'comment.doc'],
			[/\*\//, 'comment.doc', '@pop'],
			[/[\/*]/, 'comment.doc']
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
						'@default': 'string'
					}
				}
			]
		]
	}
})

// Define a new theme that contains only rules that match this language
monaco.editor.setTheme('vs-dark')

// Register a completion item provider for the new language
monaco.languages.registerCompletionItemProvider('mySpecialLanguage', {
	provideCompletionItems: () => {
		var suggestions = [{
			label: 'simpleText',
			kind: monaco.languages.CompletionItemKind.Text,
			insertText: 'simpleText'
		}, {
			label: 'testing',
			kind: monaco.languages.CompletionItemKind.Keyword,
			insertText: 'testing(${1:condition})',
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
		}, {
			label: 'ifelse',
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: [
				'if (${1:condition}) {',
				'\t$0',
				'} else {',
				'\t',
				'}'
			].join('\n'),
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			documentation: 'If-Else Statement'
		}];
		return { suggestions: suggestions };
	}
});

monaco.editor.create(document.getElementById("container"), {
	theme: 'myCoolTheme',
	value: getCode(),
	language: 'mySpecialLanguage'
});

function getCode() {
	return `SELECT 
    Id,
    (SELECT 
        Id,
        FROM Account
        GROUP BY LAST_WEEK TOMORROW)
FROM Account
GROUP BY LAST_WEEK TOMORROW`
}
