export default {
  steps: {
    title: 'Passwort zurücksetzen',
    description: 'Hier kannst du dein Passwort zurücksetzen',
    email: {
      title: 'Eingabe E-Mail Adresse',
      label: 'E-Mail',
      placeholder: 'Deine E-Mail-Adresse',
      ariaLabel: 'E-Mail'
    },
    otp: {
      title: 'Eingabe Bestätigungscode',
      description:
        'Bitte gib den Bestätigungscode ein, den wir an deine E-Mail-Adresse gesendet haben.',
      ariaLabel: 'Eingabe Bestätigungscode',
      resend: {
        resendLabel: 'Code erneut senden',
        ariaResendLabel: 'Code erneut senden',
        success: 'Bestätigungscode wurde erfolgreich gesendet.'
      },
      error: {
        expired: 'Dieser Bestätigungscode ist abgelaufen. Bitte fordere unten einen neuen Code an.',
        invalid: 'Der eingegebene Code ist ungültig. Bitte prüfe ihn und versuche es erneut.'
      }
    },
    newPassword: {
      title: 'Passwort zurücksetzen',
      description: 'Fordere einen Bestätigungscode an und setze ein neues Passwort',
      passwordLabel: 'Neues Passwort',
      ariaPasswordLabel: 'Neues Passwort',
      newPasswordLabel: 'Passwort wiederholen',
      ariaNewPasswordLabel: 'Passwort wiederholen',
      error: {
        mismatch: 'Die Passwörter stimmen nicht überein!'
      }
    }
  },
  nextLabel: 'Weiter',
  ariaNextLabel: 'Weiter',
  cancelLabel: 'Abbrechen',
  ariaCancelLabel: 'Abbrechen'
}
