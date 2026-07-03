export default {
  page: {
    title: 'Teilnehmer importieren'
  },
  actions: {
    back: 'Zurück zur Teilnehmerliste',
    cancel: 'Abbrechen',
    next: 'Weiter',
    finish: 'Abschließen',
    ariaCancel: 'Import abbrechen',
    ariaNext: 'Nächster Schritt',
    ariaFinish: 'Import abschließen'
  },
  steps: {
    file: {
      title: 'Datei auswählen',
      description: 'Wählen Sie eine Excel-Datei mit Teilnehmerdaten für den Import.',
      inputLabel: 'Excel-Datei',
      ariaInput: 'Excel-Datei für den Import auswählen',
      hint: 'Unterstütztes Format: Excel (.xlsx, .xls)'
    },
    mapping: {
      title: 'Spalten zuordnen',
      description: 'Ordnen Sie eine Spalte aus der Datei einem Feld aus dem Teilnehmerformular zu.',
      sourceLabel: 'Dateispalte',
      targetLabel: 'Teilnehmerfeld',
      ariaSource: 'Dateispalte auswählen',
      ariaTarget: 'Teilnehmerfeld auswählen'
    },
    import: {
      title: 'Import',
      description: 'Teilnehmer werden importiert.',
      progressLabel: 'Import-Fortschritt',
      complete: 'Import abgeschlossen.',
      resultsListAria: 'Importergebnisse',
      statusSuccess: '{name} erfolgreich importiert',
      statusFailure: '{name} konnte nicht importiert werden'
    }
  },
  mapping: {
    sourceColumns: {
      givenName: 'Vorname',
      familyName: 'Nachname',
      club: 'Verein'
    }
  }
}
