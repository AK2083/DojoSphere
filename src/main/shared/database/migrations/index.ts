import type { Migration } from '../types/migration'

import sqlV001 from './V001__authorize_create_tables.sql?raw'
import sqlV002 from './V002__authorize_seed_roles_permissions.sql?raw'
import sqlV003 from './V003__competitors_create_table.sql?raw'

function migration(name: string, id: string, sql: string): Migration {
  return { id, name, sql }
}

/** Ordered list of database migrations applied at startup. */
const migrations: Migration[] = [
  migration('V001__authorize_create_tables.sql', '8f3c2a1b-4d5e-6f70-8192-a3b4c5d6e701', sqlV001),
  migration(
    'V002__authorize_seed_roles_permissions.sql',
    '9a4d3b2c-5e6f-7081-92a3-b4c5d6e7f802',
    sqlV002
  ),
  migration('V003__competitors_create_table.sql', 'b5e6f7a8-9012-3456-abcd-ef0123456803', sqlV003)
]

export default migrations
