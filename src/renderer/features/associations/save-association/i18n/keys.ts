import fieldKeys from '../../i18n/fields-keys'

/** i18n keys for the save-association slice. */
const translationKeys = {
  page: {
    titleCreate: 'associations.saveAssociation.page.titleCreate',
    titleEdit: 'associations.saveAssociation.page.titleEdit'
  },
  form: {
    ariaLabel: 'associations.saveAssociation.form.ariaLabel',
    hint: 'associations.saveAssociation.form.hint',
    sameAsHeadquarters: 'associations.saveAssociation.form.sameAsHeadquarters',
    saveError: 'associations.saveAssociation.form.saveError',
    loadError: 'associations.saveAssociation.form.loadError',
    fields: fieldKeys,
    placeholders: {
      name: 'associations.saveAssociation.form.placeholders.name',
      shortName: 'associations.saveAssociation.form.placeholders.shortName',
      websiteHost: 'associations.saveAssociation.form.placeholders.websiteHost',
      associationNumber: 'associations.saveAssociation.form.placeholders.associationNumber',
      street: 'associations.saveAssociation.form.placeholders.street',
      houseNumber: 'associations.saveAssociation.form.placeholders.houseNumber',
      postalCode: 'associations.saveAssociation.form.placeholders.postalCode',
      city: 'associations.saveAssociation.form.placeholders.city',
      email: 'associations.saveAssociation.form.placeholders.email',
      phone: 'associations.saveAssociation.form.placeholders.phone'
    },
    fieldHints: {
      name: 'associations.saveAssociation.form.fieldHints.name',
      shortName: 'associations.saveAssociation.form.fieldHints.shortName',
      websiteHost: 'associations.saveAssociation.form.fieldHints.websiteHost',
      associationNumber: 'associations.saveAssociation.form.fieldHints.associationNumber',
      street: 'associations.saveAssociation.form.fieldHints.street',
      houseNumber: 'associations.saveAssociation.form.fieldHints.houseNumber',
      postalCode: 'associations.saveAssociation.form.fieldHints.postalCode',
      city: 'associations.saveAssociation.form.fieldHints.city',
      email: 'associations.saveAssociation.form.fieldHints.email',
      phone: 'associations.saveAssociation.form.fieldHints.phone'
    }
  },
  status: {
    active: 'associations.getAssociationOverview.status.active',
    inactive: 'associations.getAssociationOverview.status.inactive'
  },
  actions: {
    back: 'associations.saveAssociation.actions.back',
    reset: 'associations.saveAssociation.actions.reset',
    save: 'associations.saveAssociation.actions.save'
  },
  validation: {
    required: 'associations.saveAssociation.validation.required',
    textTooLong: 'associations.saveAssociation.validation.textTooLong',
    email: {
      invalid: 'associations.saveAssociation.validation.email.invalid'
    },
    website: {
      invalid: 'associations.saveAssociation.validation.website.invalid'
    },
    postalCode: {
      invalid: 'associations.saveAssociation.validation.postalCode.invalid'
    },
    houseNumber: {
      invalid: 'associations.saveAssociation.validation.houseNumber.invalid'
    },
    associationNumber: {
      invalid: 'associations.saveAssociation.validation.associationNumber.invalid'
    },
    phone: {
      invalid: 'associations.saveAssociation.validation.phone.invalid'
    },
    city: {
      invalid: 'associations.saveAssociation.validation.city.invalid'
    }
  }
}

export default translationKeys
