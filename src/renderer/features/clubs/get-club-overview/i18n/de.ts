export default {
  toolbar: {
    ariaLabel: 'Vereinsliste-Werkzeugleiste',
    placeholderAction: 'Filter (noch nicht verfügbar)'
  },
  list: {
    ariaLabel: 'Vereinsliste',
    empty: 'Noch keine Vereine erfasst.',
    loadingPlaceholder: 'Verein wird geladen',
    columns: {
      city: 'Stadt',
      website: 'Website',
      status: 'Status',
      district: 'Bezirk',
      country: 'Land',
      association: 'Verband',
      regionalAssociation: 'Landesverband',
      clubNumber: 'Vereinsnummer',
      headquarters: 'Hauptsitz',
      trainingVenue: 'Trainingsort',
      billingAddress: 'Rechnungsadresse',
      email: 'E-Mail Adresse',
      phone: 'Telefonnummer'
    }
  },
  status: {
    active: 'Aktiv',
    inactive: 'Inaktiv'
  },
  loadError: 'Die Vereine konnten nicht geladen werden.',
  stubUnavailable: 'Diese Funktion ist noch nicht verfügbar.',
  actions: {
    add: 'Verein hinzufügen',
    edit: 'Verein bearbeiten',
    ariaEdit: '{name} bearbeiten',
    delete: 'Verein löschen',
    ariaDelete: '{name} löschen'
  },
  entry: {
    showDetails: 'Weitere Angaben anzeigen',
    hideDetails: 'Weitere Angaben ausblenden',
    emptyValue: '—'
  }
}
