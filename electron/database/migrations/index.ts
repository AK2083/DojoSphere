import type { Migration } from '../types'

import sqlV001 from './V001__authorize_create_tables.sql?raw'
import sqlV002 from './V002__authorize_seed_roles_permissions.sql?raw'

const migrations: Migration[] = [
  { id: 'V001__authorize_create_tables', sql: sqlV001 },
  { id: 'V002__authorize_seed_roles_permissions', sql: sqlV002 }
]

export default migrations
