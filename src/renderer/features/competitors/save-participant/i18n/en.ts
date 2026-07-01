const ageClasses = {
  djb2025: {
    row01: 'Boys U10 (flexible weights)',
    row02: 'Boys U12 (flexible weights)',
    row03: 'Boys U15',
    row04: 'Boys U15 team',
    row05: 'Boys U18',
    row06: 'Boys U18 team',
    row07: 'Boys U21',
    row08: 'Men',
    row09: 'Men team',
    row10: 'Girls U10 (flexible weights)',
    row11: 'Girls U12 (flexible weights)',
    row12: 'Girls U15',
    row13: 'Girls U15 team',
    row14: 'Girls U18',
    row15: 'Girls U18 team',
    row16: 'Girls U21',
    row17: 'Women',
    row18: 'Women team'
  }
}

const grades = {
  kyu: {
    '10': '10th Kyu',
    '9': '9th Kyu',
    '8': '8th Kyu',
    '7': '7th Kyu',
    '6': '6th Kyu',
    '5': '5th Kyu',
    '4': '4th Kyu',
    '3': '3rd Kyu',
    '2': '2nd Kyu',
    '1': '1st Kyu'
  },
  dan: {
    '1': '1st Dan',
    '2': '2nd Dan',
    '3': '3rd Dan',
    '4': '4th Dan',
    '5': '5th Dan',
    '6': '6th Dan',
    '7': '7th Dan',
    '8': '8th Dan',
    '9': '9th Dan',
    '10': '10th Dan'
  }
}

const gradingSystems = {
  deDjb: 'DJB (Germany)',
  atOjv: 'ÖJV (Austria)',
  kodokan: 'Kodokan (Japan)'
}

export default {
  page: {
    titleCreate: 'Add participant',
    titleEdit: 'Edit participant'
  },
  form: {
    ariaLabel: 'Participant form',
    hint: 'Please complete all required tournament registration details. You can still edit the data later.',
    openBirthDatePicker: 'Choose date',
    flexibleWeightHint:
      'This age class uses flexible weights. Weight class selection is not required for registration.',
    requiredFieldsLegend: 'Fields marked with * are required.',
    saveError: 'The participant could not be saved. Please try again.',
    loadError: 'The participant could not be loaded.',
    selectAgeClassFirst: 'Select an age class first to choose a weight class.',
    fields: {
      givenName: 'Given name',
      familyName: 'Family name',
      gender: 'Gender',
      birthDate: 'Date of birth',
      club: 'Club',
      nationality: 'Nationality',
      weightClass: 'Weight class',
      ageClass: 'Age class',
      passNumber: 'Judo pass number',
      gradingSystem: 'Grading system',
      grade: 'Grade (kyu/dan)',
      licenseNumber: 'Competition licence number',
      contactPhone: 'Contact phone',
      coach: 'Coach / guardian'
    }
  },
  gender: {
    diverse: 'Diverse',
    female: 'Female',
    male: 'Male'
  },
  actions: {
    back: 'Back to participant list',
    reset: 'Reset',
    save: 'Save'
  },
  validation: {
    required: 'This field is required.',
    textTooLong: 'The entry is too long.',
    gender: {
      invalid: 'Please select a valid gender.'
    },
    birthDate: {
      invalid: 'Please enter a valid date of birth.',
      inFuture: 'Date of birth cannot be in the future.'
    },
    nationality: {
      invalid: 'Please select a valid country code.'
    },
    passNumber: {
      invalid:
        'Please enter a valid pass number (letters, digits, hyphen or slash, max. 32 characters).'
    },
    phone: {
      invalid: 'Please enter a valid phone number.'
    },
    weightClass: {
      ageMismatch: 'The selected weight class does not match the age class.'
    }
  },
  reference: {
    gradeNone: 'No grade',
    clubs: {
      unknown: 'Unknown'
    },
    nationalities: {
      DE: 'Germany',
      AT: 'Austria',
      CH: 'Switzerland'
    },
    weightClass: {
      minus: 'Up to {weight} kg',
      plus: 'Over {weight} kg'
    },
    ageClasses,
    gradingSystems,
    grades
  }
}
