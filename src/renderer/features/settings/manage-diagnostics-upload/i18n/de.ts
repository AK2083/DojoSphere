export default {
  autoUpload: {
    title: 'Diagnosedaten bei Fehlern senden',
    description:
      'Beim Start schreibt die App ohnehin einen anonymen System-Snapshot ins lokale Fehlerprotokoll (Betriebssystem- und App-Version). Dieser Schalter steuert, ob pseudonymisierte Fehlerdaten später an einen Cloud-Diagnoseanbieter gesendet werden dürfen. Cloud-Upload ist derzeit nicht verfügbar.',
    enabled: 'Automatischer Diagnose-Upload aktiviert',
    disabled: 'Automatischer Diagnose-Upload deaktiviert'
  },
  legal: {
    title: 'Hinweis zur Datenverarbeitung',
    body: 'Lokal wird unabhängig vom Schalter einmal pro Start ein anonymer System-Snapshot protokolliert. Cloud-Upload würde nur technische Fehlercodes ohne E-Mail, Token oder Passwörter übertragen. Cloud-Upload ist in dieser Version nicht aktiv.',
    withdraw: 'Einwilligung widerrufen: Schalter deaktivieren.'
  }
}
