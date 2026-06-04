const fs = require('fs')
const path = require('path')

module.exports = [
  {
    id: '001_create_roles',
    sql: fs.readFileSync(path.join(__dirname, '001_create_roles.sql'), 'utf8')
  },
  {
    id: '002_create_permissions',
    sql: fs.readFileSync(path.join(__dirname, '002_create_permissions.sql'), 'utf8')
  }
]
