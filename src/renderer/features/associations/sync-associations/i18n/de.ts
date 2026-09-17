export default {
  dialog: {
    title: 'Vereine aus der Cloud synchronisieren',
    legal: {
      heading: 'Rechtlicher Hinweis',
      body: 'Diese Aktion lädt Vereinsdaten (Vereinsnamen, Adressen, Kontaktinformationen und Verbandshierarchie) von einem entfernten Server herunter. Bei den Daten handelt es sich um öffentlich zugängliche Referenzdaten.\n\nMit Ihrer Bestätigung erklären Sie sich damit einverstanden, dass die Anwendung eine Internetverbindung herstellt, um diese Daten abzurufen und lokal zu speichern. Es werden dabei keine personenbezogenen Benutzerdaten übertragen.',
      source: 'Datenquelle: djb-registry'
    },
    actions: {
      cancel: 'Abbrechen',
      confirm: 'Herunterladen und synchronisieren',
      close: 'Schließen'
    },
    syncing: {
      progress: '{processed} / {total} Vereine aktualisiert',
      current: 'Wird aktualisiert: {name}'
    },
    done: {
      message: '{count} Vereine wurden erfolgreich synchronisiert.',
      nothingNew: 'Alle Vereine sind bereits aktuell.'
    },
    error:
      'Synchronisierung fehlgeschlagen. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.',
    notSignedIn:
      'Sie müssen in Ihrem Cloud-Konto angemeldet sein, um Vereine zu synchronisieren. Bitte melden Sie sich an und versuchen Sie es erneut.'
  }
}
