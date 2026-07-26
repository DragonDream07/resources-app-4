module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'commonjs',
  },
  plugins: ['import'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js'],
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
  rules: {
    // ── Import hygiene ──────────────────────────────────────────────────
    'import/no-cycle': ['error', { maxDepth: Infinity }],
    'import/no-unresolved': 'error',
    'import/no-self-import': 'error',
    'import/no-duplicates': 'warn',

    // ── Module boundary rules (dependency direction) ─────────────────────
    // Routers must not import from other routers
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './src/modules',
            from: './src/middleware',
            // Middleware is allowed to be imported into modules — reversed rule:
            // modules must not import from sibling module controllers/routes directly
          },
          {
            // db layer must not import from modules
            target: './src/db',
            from: './src/modules',
            message: 'Database layer must not depend on application modules.',
          },
          {
            // config must not import from modules or db
            target: './src/config',
            from: './src/modules',
            message: 'Config layer must not depend on application modules.',
          },
          {
            target: './src/config',
            from: './src/db',
            message: 'Config layer must not depend on the database layer.',
          },
          {
            // utils must not import from modules, db, or config
            target: './src/utils',
            from: './src/modules',
            message: 'Utilities must not depend on application modules.',
          },
        ],
      },
    ],

    // ── General code quality ─────────────────────────────────────────────
    'no-console': 'warn',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-var': 'error',
    'prefer-const': 'error',
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],
    semi: ['error', 'always'],
    quotes: ['error', 'single', { avoidEscape: true }],
    'comma-dangle': ['error', 'always-multiline'],
    'object-shorthand': 'warn',
  },
};
