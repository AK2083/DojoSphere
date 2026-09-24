export default {
  page: {
    titleCreate: 'Add association',
    titleEdit: 'Edit association'
  },
  form: {
    ariaLabel: 'Association form',
    hint: 'Please fill in the association details. Fields marked with * are required; you can still edit the data later.',
    sameAsHeadquarters: 'Same as headquarters',
    saveError: 'The association could not be saved.',
    loadError: 'The association could not be loaded.',
    placeholders: {
      name: 'e.g. Judoclub Nord e.V.',
      shortName: 'e.g. JC Nord',
      websiteHost: 'www.jcnord.example',
      associationNumber: 'e.g. VR 2876 P',
      street: 'e.g. Dojo Street',
      houseNumber: 'e.g. 12a',
      postalCode: 'e.g. 20095',
      city: 'e.g. Hamburg',
      email: "e.g. info{'@'}jcnord.example",
      phone: 'e.g. 40 555 0100'
    },
    fieldHints: {
      name: 'Official association name as in the registry.',
      shortName: 'Short display name for lists and cards.',
      websiteHost: 'Association website address without https://.',
      associationNumber: 'Court registry number (Vereinsregister).',
      street: 'Street name of the address.',
      houseNumber: 'House number including an optional suffix.',
      postalCode: 'Five-digit German postal code.',
      city: 'City of the address.',
      email: 'Public contact email of the association.',
      phone: 'National phone number without country calling code.'
    }
  },
  actions: {
    back: 'Back to association list',
    reset: 'Reset',
    save: 'Save'
  },
  validation: {
    required: 'This field is required.',
    textTooLong: 'The text is too long.',
    email: {
      invalid: 'Please enter a valid email address.'
    },
    website: {
      invalid: 'Please enter a valid website without protocol (e.g. www.example.com).'
    },
    postalCode: {
      invalid: 'Please enter a five-digit postal code.'
    },
    houseNumber: {
      invalid: 'Please enter a valid house number.'
    },
    associationNumber: {
      invalid: 'Please enter a registry number (e.g. VR 2876 P).'
    },
    phone: {
      invalid: 'Please enter a valid phone number.'
    },
    city: {
      invalid: 'Please enter a valid city name.'
    }
  }
}
