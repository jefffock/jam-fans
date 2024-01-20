/** @type {import('eslint').Linter.Config} */
module.exports = {
	parser: '@typescript-eslint/parser',
	extends: [
		'@remix-run/eslint-config',
		'@remix-run/eslint-config/node',
		'plugin:prettier/recommended',
		'plugin:react/recommended',
	],
	root: true,
	//   parserOptions: {
	//     project: "./tsconfig.json",
	//     tsconfigRootDir: __dirname
	//   },
	parserOptions: {
		ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
		sourceType: 'module', // Allows for the use of imports
		ecmaFeatures: {
			jsx: true, // Allows for the parsing of JSX
		},
	},
	rules: {
		eqeqeq: 'error',
		'no-console': 'warn',
		'no-undef': 'off',
		'no-unused-vars': 'off',
		'prettier/prettier': 'error',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-unused-vars': 'warn',
		'react/display-name': 'off',
		'react/no-children-prop': 'off',
		'react/react-in-jsx-scope': 'off',
		'react-hooks/rules-of-hooks': 'warn',
		'react-hooks/exhaustive-deps': 'warn',
	},
	plugins: ['prettier', 'react', 'react-hooks'],
	env: {
		browser: true,
		node: true,
		es6: true,
		jest: true,
	},
	ignorePatterns: ['node_modules', 'build', 'dist', 'public', '.eslintrc.js'],
	settings: {
		react: {
			version: 'detect',
		},
	},
}
