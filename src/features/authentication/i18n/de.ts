export default {
  useLocal: {
    title: 'Lokal anmelden',
    description:
      'Hier kann Lokal weitergearbeitet werden. Alle Daten werden lokal gespeichert und nicht mit einem Server synchronisiert.',
    submit: 'Weiter ohne Anmeldung'
  },
  form: {
    title: 'Registrierung',
    description: 'Neuen Benutzer registrieren',
    alreadyAccount: 'Du hast bereits einen Account?',
    logMeIn: 'Log dich hier ein',
    mail: {
      title: 'E-Mail',
      placeholder: 'deine E-Mail-Adresse',
      required: 'E-Mail ist erforderlich.',
      invalid: 'Ungültige E-Mail-Adresse'
    },
    password: {
      title: 'Passwort',
      invalid: 'Ungültiges Passwort',
      lessCharacters: 'Das Passwort muss mindestens 8 Zeichen lang sein.',
      noLetter: 'Das Passwort muss mindestens einen Buchstaben enthalten.',
      displayToggle: 'Passwort ein- oder ausblenden'
    },
    submit: 'Registriere mich',
    error: {
      retry: 'Zu viele Versuche. Bitte später erneut versuchen.',
      unknown:
        'Ein unbekannter Fehler ist aufgetreten. Bitte versuche es später erneut.'
    }
  },
  success: {
    title: 'Registrierung erfolgreich',
    description:
      'Wir haben dir eine Bestätigungs-E-Mail gesendet. Bitte überprüfe dein Postfach, um deinen Account zu aktivieren.',
    resendMail: 'E-Mail erneut senden'
  }
}
