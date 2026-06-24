export default {
  autoUpload: {
    title: 'Diagnosedaten bei Fehlern senden',
    description:
      'Sendet bei Fehlern pseudonymisierte technische Daten an Grafana Cloud zur Fehleranalyse.',
    enabled: 'Automatischer Diagnose-Upload aktiviert',
    disabled: 'Automatischer Diagnose-Upload deaktiviert'
  },
  legal: {
    title: 'Hinweis zur Datenverarbeitung',
    body: 'Es werden nur technische Fehlercodes und Kontext ohne E-Mail, Token oder Passwörter übertragen. Die Nutzerkennung wird per HMAC pseudonymisiert. Verarbeitung durch Grafana Labs als Auftragsverarbeiter.',
    grafanaPrivacy: 'Grafana Datenschutzerklärung',
    withdraw: 'Einwilligung widerrufen.'
  }
}
