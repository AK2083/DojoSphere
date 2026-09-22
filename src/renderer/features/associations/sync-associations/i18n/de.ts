export default {
  dialog: {
    title: 'Vereinsdaten aktualisieren',
    legal: {
      heading: 'Rechtlicher Hinweis',
      body: 'Mit der Bestätigung werden frei im Internet verfügbare Vereins-Referenzdaten (Namen, Adressen, Kontaktdaten und Verbandshierarchie) von einem entfernten Server heruntergeladen und lokal auf diesem Gerät gespeichert.\n\nLokal gelöschte Vereine werden beim nächsten Update erneut importiert, sofern sie in der Cloud-Quelle weiterhin vorhanden sind. Unveränderte, bereits vorhandene Vereine werden übersprungen.\n\nEs handelt sich um öffentlich zugängliche Verzeichnisdaten. Für den Abruf wird eine Internetverbindung hergestellt.',
      gdpr: 'Datenschutz (DSGVO): Es werden keine personenbezogenen Daten Ihres Nutzerkontos an Dritte übermittelt. Heruntergeladen und lokal gespeichert werden ausschließlich die genannten öffentlichen Referenzdaten. Die Verarbeitung erfolgt zum Zweck der lokalen Nutzung in DojoSphere. Sie können die lokal gespeicherten Daten jederzeit löschen, indem Sie die Anwendungsdaten zurücksetzen.',
      source: 'Datenquelle: öffentlich verfügbare Vereinsregister / Verbandsverzeichnisse'
    },
    actions: {
      cancel: 'Abbrechen',
      confirm: 'Herunterladen',
      close: 'Schließen'
    },
    syncing: {
      loading: 'Vereinsdaten werden geladen …',
      percent: '{percent} Prozent geladen'
    },
    results: {
      listAria: 'Importierte Vereine',
      statusSuccess: '{name} erfolgreich importiert',
      statusFailure: '{name} nicht importiert',
      statusPending: '{name} wird importiert',
      empty: 'Keine neuen oder fehlenden Vereine zum Import gefunden.'
    },
    error:
      'Aktualisierung fehlgeschlagen. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.',
    toast: {
      imported: '{count} Vereine importiert',
      none: '0 Vereine importiert'
    }
  }
}
