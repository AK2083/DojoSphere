import type { Migration } from '../types/migration'

import sqlV001 from './V001__authorize_create_tables.sql?raw'
import sqlV002 from './V002__authorize_seed_roles_permissions.sql?raw'
import sqlV004 from './V004__grades_create_table.sql?raw'
import sqlV005 from './V005__age_classes_create_table.sql?raw'
import sqlV006 from './V006__weight_classes_create_table.sql?raw'
import sqlV007 from './V007__clubs_create_tables.sql?raw'
import sqlV008 from './V008__competitors_create_table.sql?raw'

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
  migration('V004__grades_create_table.sql', 'c6d7e8f9-0123-4567-abcd-ef0123456804', sqlV004),
  migration('V005__age_classes_create_table.sql', 'd7e8f9a0-1234-5678-abcd-ef0123456805', sqlV005),
  migration(
    'V006__weight_classes_create_table.sql',
    'e8f9a0b1-2345-6789-abcd-ef0123456806',
    sqlV006
  ),
  migration('V007__clubs_create_tables.sql', 'f9a0b1c2-3456-7890-abcd-ef0123456807', sqlV007),
  migration('V008__competitors_create_table.sql', 'b5e6f7a8-9012-3456-abcd-ef0123456803', sqlV008)
]

export default migrations
