const tailwind = require('prettier-plugin-tailwindcss')

module.exports = {
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  printWidth: 120,
  bracketSpacing: true,
  plugins: [tailwind],
  tailwindConfig: './packages/tailwind-config/tailwind.config.cjs',
};
