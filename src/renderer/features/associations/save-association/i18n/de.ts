export default {
  page: {
    titleCreate: 'Verein hinzufügen',
    titleEdit: 'Verein bearbeiten'
  },
  form: {
    ariaLabel: 'Vereinsformular',
    hint: 'Bitte alle Angaben zum Verein ausfüllen. Mit * markierte Felder sind Pflichtfelder; du kannst die Daten später noch bearbeiten.',
    sameAsHeadquarters: 'Wie Hauptsitz',
    saveError: 'Der Verein konnte nicht gespeichert werden.',
    loadError: 'Der Verein konnte nicht geladen werden.',
    placeholders: {
      name: 'z. B. Judoclub Nord e.V.',
      shortName: 'z. B. JC Nord',
      websiteHost: 'www.jcnord.example',
      associationNumber: 'z. B. VR 2876 P',
      street: 'z. B. Dojostraße',
      houseNumber: 'z. B. 12a',
      postalCode: 'z. B. 20095',
      city: 'z. B. Hamburg',
      email: "z. B. info{'@'}jcnord.example",
      phone: 'z. B. 40 555 0100'
    },
    fieldHints: {
      name: 'Offizieller Vereinsname wie im Vereinsregister.',
      shortName: 'Kurzer Anzeigename für Listen und Karten.',
      websiteHost: 'Adresse der Vereinswebsite ohne https://.',
      associationNumber: 'Vereinsregisternummer beim Amtsgericht.',
      street: 'Straßenname der Adresse.',
      houseNumber: 'Hausnummer inkl. optionalem Zusatz.',
      postalCode: 'Fünfstellige deutsche Postleitzahl.',
      city: 'Ort der Adresse.',
      email: 'Öffentliche Kontakt-E-Mail des Vereins.',
      phone: 'Nationale Rufnummer ohne Ländervorwahl.'
    }
  },
  actions: {
    back: 'Zurück zur Vereinsliste',
    reset: 'Zurücksetzen',
    save: 'Speichern'
  },
  validation: {
    required: 'Dieses Feld ist erforderlich.',
    textTooLong: 'Der Text ist zu lang.',
    email: {
      invalid: 'Bitte gib eine gültige E-Mail-Adresse ein.'
    },
    website: {
      invalid: 'Bitte gib eine gültige Website ohne Protokoll ein (z. B. www.beispiel.de).'
    },
    postalCode: {
      invalid: 'Bitte gib eine fünfstellige Postleitzahl ein.'
    },
    houseNumber: {
      invalid: 'Bitte gib eine gültige Hausnummer ein.'
    },
    associationNumber: {
      invalid: 'Bitte gib eine Vereinsregisternummer ein (z. B. VR 2876 P).'
    },
    phone: {
      invalid: 'Bitte gib eine gültige Telefonnummer ein.'
    },
    city: {
      invalid: 'Bitte gib einen gültigen Stadtnamen ein.'
    }
  }
}
