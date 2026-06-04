const fs = require('fs')
const path = require('path')

module.exports = [
  {
    id: '001_create_roles',
    sql: fs.readFileSync(path.join(__dirname, '001_create_roles.sql'), 'utf8')
  }
]
