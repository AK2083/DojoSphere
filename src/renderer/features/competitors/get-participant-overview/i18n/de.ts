export default {
  toolbar: {
    ariaLabel: 'Teilnehmerliste-Werkzeugleiste',
    placeholderAction: 'Filter (noch nicht verfügbar)'
  },
  list: {
    ariaLabel: 'Teilnehmerliste',
    empty: 'Noch keine Teilnehmer erfasst.',
    loadingPlaceholder: 'Teilnehmer wird geladen',
    columns: {
      givenName: 'Vorname',
      familyName: 'Nachname',
      gender: 'Geschlecht',
      birthDate: 'Geburtsdatum',
      club: 'Verein / Club',
      nationality: 'Nationalität',
      weightClass: 'Gewichtsklasse',
      ageClass: 'Altersklasse',
      passNumber: 'Passnummer',
      grade: 'Graduierung',
      licenseNumber: 'Wettkampflizenznummer',
      clubContactEmail: 'E-Mail Vereinsverantwortlicher',
      contactPhone: 'Telefon für Rückfragen',
      coach: 'Trainer / Betreuer'
    }
  },
  gender: {
    female: 'Weiblich',
    male: 'Männlich',
    diverse: 'Divers'
  },
  emptyGrade: '—',
  loadError: 'Die Teilnehmer konnten nicht geladen werden.',
  actions: {
    add: 'Teilnehmer hinzufügen',
    edit: 'Teilnehmer bearbeiten',
    ariaEdit: '{name} bearbeiten',
    delete: 'Teilnehmer löschen',
    ariaDelete: '{name} löschen'
  },
  entry: {
    showDetails: 'Weitere Angaben anzeigen',
    hideDetails: 'Weitere Angaben ausblenden'
  }
}
