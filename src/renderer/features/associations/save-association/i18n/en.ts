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
      associationNumber: 'e.g. 020123',
      street: 'e.g. Dojo Street',
      houseNumber: 'e.g. 12',
      postalCode: 'e.g. 20095',
      city: 'e.g. Hamburg',
      email: "e.g. info{'@'}jcnord.example",
      phone: 'e.g. 40 555 0100'
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
      invalid: 'Please enter an association number using digits only.'
    },
    phone: {
      invalid: 'Please enter a valid phone number.'
    },
    city: {
      invalid: 'Please enter a valid city name.'
    }
  }
}
