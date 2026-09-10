import fieldKeys from '../../i18n/fields-keys'

/** i18n keys for the save-club slice. */
const translationKeys = {
  page: {
    titleCreate: 'clubs.saveClub.page.titleCreate',
    titleEdit: 'clubs.saveClub.page.titleEdit'
  },
  form: {
    ariaLabel: 'clubs.saveClub.form.ariaLabel',
    hint: 'clubs.saveClub.form.hint',
    sameAsHeadquarters: 'clubs.saveClub.form.sameAsHeadquarters',
    saveError: 'clubs.saveClub.form.saveError',
    loadError: 'clubs.saveClub.form.loadError',
    fields: fieldKeys,
    placeholders: {
      name: 'clubs.saveClub.form.placeholders.name',
      shortName: 'clubs.saveClub.form.placeholders.shortName',
      websiteHost: 'clubs.saveClub.form.placeholders.websiteHost',
      clubNumber: 'clubs.saveClub.form.placeholders.clubNumber',
      street: 'clubs.saveClub.form.placeholders.street',
      houseNumber: 'clubs.saveClub.form.placeholders.houseNumber',
      postalCode: 'clubs.saveClub.form.placeholders.postalCode',
      city: 'clubs.saveClub.form.placeholders.city',
      email: 'clubs.saveClub.form.placeholders.email',
      phone: 'clubs.saveClub.form.placeholders.phone'
    }
  },
  status: {
    active: 'clubs.getClubOverview.status.active',
    inactive: 'clubs.getClubOverview.status.inactive'
  },
  actions: {
    back: 'clubs.saveClub.actions.back',
    reset: 'clubs.saveClub.actions.reset',
    save: 'clubs.saveClub.actions.save'
  },
  validation: {
    required: 'clubs.saveClub.validation.required',
    textTooLong: 'clubs.saveClub.validation.textTooLong',
    email: {
      invalid: 'clubs.saveClub.validation.email.invalid'
    },
    website: {
      invalid: 'clubs.saveClub.validation.website.invalid'
    },
    postalCode: {
      invalid: 'clubs.saveClub.validation.postalCode.invalid'
    },
    houseNumber: {
      invalid: 'clubs.saveClub.validation.houseNumber.invalid'
    },
    clubNumber: {
      invalid: 'clubs.saveClub.validation.clubNumber.invalid'
    },
    phone: {
      invalid: 'clubs.saveClub.validation.phone.invalid'
    },
    city: {
      invalid: 'clubs.saveClub.validation.city.invalid'
    }
  }
}

export default translationKeys
