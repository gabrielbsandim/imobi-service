// knexfile.cjs
require('ts-node').register({
  project: './tsconfig.knex.json',
})
module.exports = require('./knexfile.ts').default
