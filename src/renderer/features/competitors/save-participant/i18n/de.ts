const ageClasses = {
  djb2025: {
    row01: 'Jungen U10 (flexible Gewichte)',
    row02: 'Jungen U12 (flexible Gewichte)',
    row03: 'Jungen U15',
    row04: 'Jungen U15 Mannschaft',
    row05: 'Jungen U18',
    row06: 'Jungen U18 Mannschaft',
    row07: 'Jungen U21',
    row08: 'Herren',
    row09: 'Herren Mannschaft',
    row10: 'Mädchen U10 (flexible Gewichte)',
    row11: 'Mädchen U12 (flexible Gewichte)',
    row12: 'Mädchen U15',
    row13: 'Mädchen U15 Mannschaft',
    row14: 'Mädchen U18',
    row15: 'Mädchen U18 Mannschaft',
    row16: 'Mädchen U21',
    row17: 'Damen',
    row18: 'Damen Mannschaft'
  }
}

const grades = {
  kyu: {
    '10': '10. Kyu',
    '9': '9. Kyu',
    '8': '8. Kyu',
    '7': '7. Kyu',
    '6': '6. Kyu',
    '5': '5. Kyu',
    '4': '4. Kyu',
    '3': '3. Kyu',
    '2': '2. Kyu',
    '1': '1. Kyu'
  },
  dan: {
    '1': '1. Dan',
    '2': '2. Dan',
    '3': '3. Dan',
    '4': '4. Dan',
    '5': '5. Dan',
    '6': '6. Dan',
    '7': '7. Dan',
    '8': '8. Dan',
    '9': '9. Dan',
    '10': '10. Dan'
  }
}

const gradingSystems = {
  deDjb: 'DJB (Deutschland)',
  atOjv: 'ÖJV (Österreich)',
  kodokan: 'Kodokan (Japan)'
}

export default {
  page: {
    titleCreate: 'Teilnehmer hinzufügen',
    titleEdit: 'Teilnehmer bearbeiten'
  },
  form: {
    ariaLabel: 'Formular für Teilnehmerdaten',
    hint: 'Bitte alle Pflichtangaben für die Turnieranmeldung ausfüllen. Die Daten können später noch bearbeitet werden.',
    openBirthDatePicker: 'Datum auswählen',
    flexibleWeightHint:
      'Für diese Altersklasse gelten flexible Gewichte. Eine Gewichtsklasse muss nicht gewählt werden.',
    requiredFieldsLegend: 'Mit * markierte Felder sind Pflichtfelder.',
    saveError: 'Der Teilnehmer konnte nicht gespeichert werden. Bitte erneut versuchen.',
    loadError: 'Der Teilnehmer konnte nicht geladen werden.',
    selectAgeClassFirst:
      'Bitte zuerst eine Altersklasse wählen, um die Gewichtsklasse festzulegen.',
    fields: {
      givenName: 'Vorname',
      familyName: 'Nachname',
      gender: 'Geschlecht',
      birthDate: 'Geburtsdatum',
      club: 'Verein / Club',
      nationality: 'Nationalität',
      weightClass: 'Gewichtsklasse',
      ageClass: 'Altersklasse',
      passNumber: 'Passnummer',
      gradingSystem: 'Graduierungssystem',
      grade: 'Graduierung',
      licenseNumber: 'Wettkampflizenznummer',
      contactPhone: 'Telefon für Rückfragen',
      coach: 'Trainer / Betreuer'
    }
  },
  gender: {
    diverse: 'Divers',
    female: 'Weiblich',
    male: 'Männlich'
  },
  actions: {
    back: 'Zurück zur Teilnehmerliste',
    reset: 'Zurücksetzen',
    save: 'Speichern'
  },
  validation: {
    required: 'Dieses Feld ist erforderlich.',
    textTooLong: 'Die Eingabe ist zu lang.',
    gender: {
      invalid: 'Bitte ein gültiges Geschlecht wählen.'
    },
    birthDate: {
      invalid: 'Bitte ein gültiges Geburtsdatum eingeben.',
      inFuture: 'Das Geburtsdatum darf nicht in der Zukunft liegen.'
    },
    nationality: {
      invalid: 'Bitte einen gültigen Ländercode wählen.'
    },
    passNumber: {
      invalid:
        'Bitte eine gültige Passnummer eingeben (Buchstaben, Ziffern, Bindestrich oder Schrägstrich, max. 32 Zeichen).'
    },
    phone: {
      invalid: 'Bitte eine gültige Telefonnummer eingeben.'
    },
    weightClass: {
      ageMismatch: 'Die Gewichtsklasse passt nicht zur gewählten Altersklasse.'
    }
  },
  reference: {
    gradeNone: 'Kein Grad',
    clubs: {
      unknown: 'Unbekannt'
    },
    nationalities: {
      DE: 'Deutschland',
      AT: 'Österreich',
      CH: 'Schweiz'
    },
    weightClass: {
      minus: 'bis {weight} kg',
      plus: 'über {weight} kg'
    },
    ageClasses,
    gradingSystems,
    grades
  }
}
