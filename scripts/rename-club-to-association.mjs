/**
 * Renames club→association across the repo.
 * First frees the name by renaming Verband `association*` → `federation*`.
 * Preserves proper names like "Judoclub".
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

const SKIP_DIR_NAMES = new Set([
  'node_modules',
  'coverage',
  'dist',
  '.git',
  'out',
  'release',
  'storybook-static',
  'agent-transcripts',
  'terminals'
])

const TEXT_EXT = new Set([
  '.ts',
  '.tsx',
  '.vue',
  '.js',
  '.mjs',
  '.cjs',
  '.sql',
  '.md',
  '.json',
  '.yml',
  '.yaml',
  '.txt',
  '.css',
  '.scss',
  '.html'
])

/** @param {string} dir */
function walk(dir) {
  /** @type {string[]} */
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIR_NAMES.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else out.push(full)
  }
  return out
}

/**
 * Apply ordered replacements. Longer tokens first within each phase.
 * @param {string} input
 */
function transformContent(input) {
  let s = input

  // Protect proper names / import synonyms that must keep the substring "club".
  const protections = [
    ['Judoclub', '@@JUDOCLUB@@'],
    ['judoclub', '@@judoclub@@']
  ]
  for (const [from, to] of protections) s = s.split(from).join(to)

  /** @type {Array<[RegExp|string, string]>} */
  const replacements = [
    // --- Phase A: Verband association* → federation* ---
    ['regionalAssociationShortName', 'regionalFederationShortName'],
    ['regionalAssociationName', 'regionalFederationName'],
    ['regional_associations', 'regional_federations'],
    ['regional_association_id', 'regional_federation_id'],
    ['regionalAssociation', 'regionalFederation'],
    ['associationShortName', 'federationShortName'],
    ['associationName', 'federationName'],
    // SQL / docs table for national Verband (word-boundary-ish via later club pass)
    ['CREATE TABLE IF NOT EXISTS associations', 'CREATE TABLE IF NOT EXISTS federations'],
    ['INSERT INTO associations', 'INSERT INTO federations'],
    ['REFERENCES associations(', 'REFERENCES federations('],
    ['idx_associations_country_id', 'idx_federations_country_id'],
    ['ON associations(', 'ON federations('],
    ['INTO associations ', 'INTO federations '],
    ['FROM associations', 'FROM federations'],
    ['JOIN associations', 'JOIN federations'],
    ['TABLE associations', 'TABLE federations'],
    ['table `associations`', 'table `federations`'],
    ['`associations`', '`federations`'],
    ['association_id', 'federation_id'],
    // i18n field key association (Verband) — used as object keys / labels
    ["association: 'Verband'", "federation: 'Verband'"],
    ["association: 'Association'", "federation: 'Federation'"],
    ["association: 'clubs.fields.association'", "federation: 'clubs.fields.federation'"],
    ["regionalAssociation: 'Landesverband'", "regionalFederation: 'Landesverband'"],
    ["regionalAssociation: 'Regional association'", "regionalFederation: 'Regional federation'"],
    [
      "regionalAssociation: 'clubs.fields.regionalAssociation'",
      "regionalFederation: 'clubs.fields.regionalFederation'"
    ],
    ['columns.association', 'columns.federation'],
    ['columns.regionalAssociation', 'columns.regionalFederation'],
    ['fields.association', 'fields.federation'],
    ['fields.regionalAssociation', 'fields.regionalFederation'],
    // Placeholder regional association string in seeds
    ['Placeholder Regional Association', 'Placeholder Regional Federation'],

    // --- Phase B: club → association (specific compounds first) ---
    ['get-club-overview', 'get-association-overview'],
    ['getClubOverview', 'getAssociationOverview'],
    ['GetClubOverview', 'GetAssociationOverview'],
    ['save-club', 'save-association'],
    ['saveClub', 'saveAssociation'],
    ['SaveClub', 'SaveAssociation'],
    ['clubs-overview', 'associations-overview'],
    ['CLUBS_OVERVIEW', 'ASSOCIATIONS_OVERVIEW'],
    ['ClubsOverview', 'AssociationsOverview'],
    ['clubsOverview', 'associationsOverview'],
    ['djb_club_number', 'djb_association_number'],
    ['club_identifiers', 'association_identifiers'],
    ['club_addresses', 'association_addresses'],
    ['club_contacts', 'association_contacts'],
    ['club-form', 'association-form'],
    ['club-entry', 'association-entry'],
    ['club-overview', 'association-overview'],
    ['club-and-row', 'association-and-row'],
    ['club-mock', 'association-mock'],
    ['club-row', 'association-row'],
    ['club-label', 'association-label'],
    ['club-avatar', 'association-avatar'],
    ['club-number', 'association-number'],
    ['format-club', 'format-association'],
    ['resolve-club', 'resolve-association'],
    ['load-clubs', 'load-associations'],
    ['loadClubs', 'loadAssociations'],
    ['LoadClubs', 'LoadAssociations'],
    ['use-clubs', 'use-associations'],
    ['useClubs', 'useAssociations'],
    ['UseClubs', 'UseAssociations'],
    ['use-club', 'use-association'],
    ['useClub', 'useAssociation'],
    ['UseClub', 'UseAssociation'],
    ['map-club', 'map-association'],
    ['mapClub', 'mapAssociation'],
    ['MapClub', 'MapAssociation'],
    ['createClub', 'createAssociation'],
    ['CreateClub', 'CreateAssociation'],
    ['updateClub', 'updateAssociation'],
    ['UpdateClub', 'UpdateAssociation'],
    ['deleteClub', 'deleteAssociation'],
    ['DeleteClub', 'DeleteAssociation'],
    ['listClubs', 'listAssociations'],
    ['ListClubs', 'ListAssociations'],
    ['resetClubs', 'resetAssociations'],
    ['ResetClubs', 'ResetAssociations'],
    ['getClub', 'getAssociation'],
    ['GetClub', 'GetAssociation'],
    ['clubId', 'associationId'],
    ['ClubId', 'AssociationId'],
    ['club_id', 'association_id'],
    ['CLUB_', 'ASSOCIATION_'],
    ['ClubForm', 'AssociationForm'],
    ['clubForm', 'associationForm'],
    ['ClubEntry', 'AssociationEntry'],
    ['ClubOverview', 'AssociationOverview'],
    ['clubOverview', 'associationOverview'],
    ['ClubPage', 'AssociationPage'],
    ['ClubsPage', 'AssociationsPage'],
    ['ClubContact', 'AssociationContact'],
    ['ClubAddress', 'AssociationAddress'],
    ['ClubIdentifier', 'AssociationIdentifier'],
    ['ClubField', 'AssociationField'],
    ['ClubNumber', 'AssociationNumber'],
    ['clubNumber', 'associationNumber'],
    ['ClubMock', 'AssociationMock'],
    ['clubMock', 'associationMock'],
    ['ClubRow', 'AssociationRow'],
    ['clubRow', 'associationRow'],
    ['ClubLabel', 'AssociationLabel'],
    ['clubLabel', 'associationLabel'],
    ['ClubAvatar', 'AssociationAvatar'],
    ['clubAvatar', 'associationAvatar'],
    ['ClubInitials', 'AssociationInitials'],
    ['clubInitials', 'associationInitials'],
    ['ClubsLoader', 'AssociationsLoader'],
    ['clubsLoader', 'associationsLoader'],
    ['storyClubs', 'storyAssociations'],
    ['StoryClubs', 'StoryAssociations'],
    ['CLUB_MOCK', 'ASSOCIATION_MOCK'],
    ['clubContactEmail', 'associationContactEmail'],
    ['ClubContactEmail', 'AssociationContactEmail'],
    ['clubOptions', 'associationOptions'],
    ['clubRules', 'associationRules'],
    ['clubHeader', 'associationHeader'],
    ['CLUB_HEADER', 'ASSOCIATION_HEADER'],
    ['resolveClub', 'resolveAssociation'],
    ['upsertClub', 'upsertAssociation'],
    ['participantClub', 'participantAssociation'],
    ['ParticipantClub', 'ParticipantAssociation'],
    ['__club', '__association'],
    ['/clubs', '/associations'],
    ["'clubs'", "'associations'"],
    ['"clubs"', '"associations"'],
    ['`clubs`', '`associations`'],
    ["name: 'clubs'", "name: 'associations'"],
    ["name: 'club-create'", "name: 'association-create'"],
    ["name: 'club-edit'", "name: 'association-edit'"],
    ["'club-create'", "'association-create'"],
    ["'club-edit'", "'association-edit'"],
    ['@features/clubs', '@features/associations'],
    ['@pages/clubs', '@pages/associations'],
    ['@pages/club-form', '@pages/association-form'],
    ['features/clubs', 'features/associations'],
    ['pages/clubs', 'pages/associations'],
    ['pages/club-form', 'pages/association-form'],
    ['Features/Clubs', 'Features/Associations'],
    ['Pages/Clubs', 'Pages/Associations'],
    ['seed club', 'seed association'],
    ['Seed club', 'Seed association'],
    ['active club', 'active association'],
    ['Active club', 'Active association'],
    // Remaining Camel/Pascal/snake word tokens
    ['Clubs', 'Associations'],
    ['Club', 'Association'],
    ['clubs', 'associations'],
    // word-boundary-ish lowercase club (avoid @@judoclub@@)
    [/(?<![A-Za-z@])club(?![A-Za-z])/g, 'association'],
    [/(?<![A-Za-z@])Club(?![A-Za-z])/g, 'Association'],
    [/(?<![A-Za-z@])CLUB(?![A-Za-z])/g, 'ASSOCIATION']
  ]

  for (const [from, to] of replacements) {
    if (typeof from === 'string') {
      if (s.includes(from)) s = s.split(from).join(to)
    } else {
      s = s.replace(from, to)
    }
  }

  for (const [from, to] of protections) s = s.split(to).join(from)
  return s
}

/** Path segment renames (longest first). */
const PATH_RENAMES = [
  ['get-club-overview', 'get-association-overview'],
  ['save-club', 'save-association'],
  ['club-form', 'association-form'],
  ['club-and-row-count', 'association-and-row-count'],
  ['clubs-overview-permission', 'associations-overview-permission'],
  ['use-clubs-overview-access', 'use-associations-overview-access'],
  ['use-clubs-store', 'use-associations-store'],
  ['use-club-overview', 'use-association-overview'],
  ['club-overview-story-fixtures', 'association-overview-story-fixtures'],
  ['club-form-error-manager', 'association-form-error-manager'],
  ['club-form-rules', 'association-form-rules'],
  ['club-form-state', 'association-form-state'],
  ['map-club-form-state', 'map-association-form-state'],
  ['format-club-address', 'format-association-address'],
  ['resolve-club-detail-fields', 'resolve-association-detail-fields'],
  ['club-mock-data', 'association-mock-data'],
  ['club-avatar', 'association-avatar'],
  ['club-label', 'association-label'],
  ['club-row', 'association-row'],
  ['load-clubs', 'load-associations'],
  ['save-club', 'save-association'],
  ['ClubEntryPlaceholder', 'AssociationEntryPlaceholder'],
  ['ClubOverviewActions', 'AssociationOverviewActions'],
  ['ClubOverviewSection', 'AssociationOverviewSection'],
  ['ClubFormPage', 'AssociationFormPage'],
  ['ClubsPage', 'AssociationsPage'],
  ['ClubEntry', 'AssociationEntry'],
  ['ClubForm', 'AssociationForm'],
  [
    'V013__authorize_seed_clubs_overview_permissions',
    'V013__authorize_seed_associations_overview_permissions'
  ],
  ['V007__clubs_create_tables', 'V007__associations_create_tables'],
  ['clubs-schema', 'associations-schema'],
  ['/clubs/', '/associations/'],
  ['\\clubs\\', '\\associations\\'],
  ['/club-form/', '/association-form/'],
  ['\\club-form\\', '\\association-form\\']
]

function renamePath(filePath) {
  let next = filePath
  for (const [from, to] of PATH_RENAMES) {
    if (next.includes(from)) next = next.split(from).join(to)
  }
  return next
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
}

const files = walk(root).filter((f) => {
  const rel = path.relative(root, f)
  if (rel.startsWith(`scripts${path.sep}rename-club-to-association`)) return false
  const ext = path.extname(f)
  return TEXT_EXT.has(ext) || f.endsWith('.sql')
})

let contentChanged = 0
for (const file of files) {
  const before = fs.readFileSync(file, 'utf8')
  const after = transformContent(before)
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8')
    contentChanged++
  }
}

// Rename files/dirs via git mv where possible (deepest paths first)
const allPaths = walk(root)
  .map((f) => path.relative(root, f))
  .filter((rel) => renamePath(path.join(root, rel)) !== path.join(root, rel))
  .sort((a, b) => b.length - a.length)

let moved = 0
for (const rel of allPaths) {
  const from = path.join(root, rel)
  const to = renamePath(from)
  if (from === to) continue
  if (!fs.existsSync(from)) continue
  ensureDir(to)
  try {
    execSync(
      `git mv "${rel.replace(/\\/g, '/')}" "${path.relative(root, to).replace(/\\/g, '/')}"`,
      {
        stdio: 'pipe'
      }
    )
  } catch {
    fs.renameSync(from, to)
  }
  moved++
}

// Rename empty leftover dirs that still contain "club"
function walkDirs(dir) {
  /** @type {string[]} */
  const dirs = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIR_NAMES.has(entry.name)) continue
    if (!entry.isDirectory()) continue
    const full = path.join(dir, entry.name)
    dirs.push(...walkDirs(full))
    dirs.push(full)
  }
  return dirs
}

for (const dir of walkDirs(root).sort((a, b) => b.length - a.length)) {
  const next = renamePath(dir)
  if (next === dir) continue
  if (!fs.existsSync(dir)) continue
  ensureDir(next)
  if (!fs.existsSync(next)) {
    try {
      const relFrom = path.relative(root, dir).replace(/\\/g, '/')
      const relTo = path.relative(root, next).replace(/\\/g, '/')
      execSync(`git mv "${relFrom}" "${relTo}"`, { stdio: 'pipe' })
    } catch {
      fs.renameSync(dir, next)
    }
  }
}

console.log(JSON.stringify({ contentChanged, moved }, null, 2))
