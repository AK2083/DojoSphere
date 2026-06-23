export { registerCompetitorsIpc } from './ipc/register'
export {
  addCompetitor,
  deleteCompetitor,
  getCompetitors,
  updateCompetitor
} from './repository/competitors.repository'
export type {
  CompetitorRecord,
  CreateCompetitorInput,
  UpdateCompetitorInput
} from './repository/competitors.repository'
