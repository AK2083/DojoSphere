/** i18n keys for the save-participant slice. */
const translationKeys = {
  page: {
    titleCreate: 'competitors.saveParticipant.page.titleCreate',
    titleEdit: 'competitors.saveParticipant.page.titleEdit'
  },
  form: {
    ariaLabel: 'competitors.saveParticipant.form.ariaLabel',
    hint: 'competitors.saveParticipant.form.hint',
    openBirthDatePicker: 'competitors.saveParticipant.form.openBirthDatePicker',
    flexibleWeightHint: 'competitors.saveParticipant.form.flexibleWeightHint',
    requiredFieldsLegend: 'competitors.saveParticipant.form.requiredFieldsLegend',
    saveError: 'competitors.saveParticipant.form.saveError',
    duplicateError: 'competitors.saveParticipant.form.duplicateError',
    loadError: 'competitors.saveParticipant.form.loadError',
    selectAgeClassFirst: 'competitors.saveParticipant.form.selectAgeClassFirst',
    fields: {
      givenName: 'competitors.saveParticipant.form.fields.givenName',
      familyName: 'competitors.saveParticipant.form.fields.familyName',
      gender: 'competitors.saveParticipant.form.fields.gender',
      birthDate: 'competitors.saveParticipant.form.fields.birthDate',
      association: 'competitors.saveParticipant.form.fields.association',
      nationality: 'competitors.saveParticipant.form.fields.nationality',
      weightClass: 'competitors.saveParticipant.form.fields.weightClass',
      ageClass: 'competitors.saveParticipant.form.fields.ageClass',
      passNumber: 'competitors.saveParticipant.form.fields.passNumber',
      gradingSystem: 'competitors.saveParticipant.form.fields.gradingSystem',
      grade: 'competitors.saveParticipant.form.fields.grade',
      licenseNumber: 'competitors.saveParticipant.form.fields.licenseNumber',
      contactPhone: 'competitors.saveParticipant.form.fields.contactPhone',
      contactPerson: 'competitors.saveParticipant.form.fields.contactPerson',
      startEligible: 'competitors.saveParticipant.form.fields.startEligible',
      registrationStatus: 'competitors.saveParticipant.form.fields.registrationStatus',
      remarks: 'competitors.saveParticipant.form.fields.remarks'
    },
    placeholders: {
      givenName: 'competitors.saveParticipant.form.placeholders.givenName',
      familyName: 'competitors.saveParticipant.form.placeholders.familyName',
      passNumber: 'competitors.saveParticipant.form.placeholders.passNumber',
      licenseNumber: 'competitors.saveParticipant.form.placeholders.licenseNumber',
      contactPhone: 'competitors.saveParticipant.form.placeholders.contactPhone',
      contactPerson: 'competitors.saveParticipant.form.placeholders.contactPerson',
      remarks: 'competitors.saveParticipant.form.placeholders.remarks'
    },
    fieldHints: {
      givenName: 'competitors.saveParticipant.form.fieldHints.givenName',
      familyName: 'competitors.saveParticipant.form.fieldHints.familyName',
      gender: 'competitors.saveParticipant.form.fieldHints.gender',
      birthDate: 'competitors.saveParticipant.form.fieldHints.birthDate',
      association: 'competitors.saveParticipant.form.fieldHints.association',
      nationality: 'competitors.saveParticipant.form.fieldHints.nationality',
      ageClass: 'competitors.saveParticipant.form.fieldHints.ageClass',
      weightClass: 'competitors.saveParticipant.form.fieldHints.weightClass',
      passNumber: 'competitors.saveParticipant.form.fieldHints.passNumber',
      gradingSystem: 'competitors.saveParticipant.form.fieldHints.gradingSystem',
      grade: 'competitors.saveParticipant.form.fieldHints.grade',
      licenseNumber: 'competitors.saveParticipant.form.fieldHints.licenseNumber',
      contactPhone: 'competitors.saveParticipant.form.fieldHints.contactPhone',
      contactPerson: 'competitors.saveParticipant.form.fieldHints.contactPerson',
      registrationStatus: 'competitors.saveParticipant.form.fieldHints.registrationStatus',
      remarks: 'competitors.saveParticipant.form.fieldHints.remarks',
      startEligible: 'competitors.saveParticipant.form.fieldHints.startEligible'
    }
  },
  gender: {
    diverse: 'competitors.saveParticipant.gender.diverse',
    female: 'competitors.saveParticipant.gender.female',
    male: 'competitors.saveParticipant.gender.male'
  },
  registrationStatus: {
    none: 'competitors.saveParticipant.registrationStatus.none',
    registered: 'competitors.saveParticipant.registrationStatus.registered',
    lateRegistration: 'competitors.saveParticipant.registrationStatus.lateRegistration'
  },
  actions: {
    back: 'competitors.saveParticipant.actions.back',
    reset: 'competitors.saveParticipant.actions.reset',
    save: 'competitors.saveParticipant.actions.save'
  },
  validation: {
    required: 'competitors.saveParticipant.validation.required',
    textTooLong: 'competitors.saveParticipant.validation.textTooLong',
    gender: {
      invalid: 'competitors.saveParticipant.validation.gender.invalid'
    },
    birthDate: {
      invalid: 'competitors.saveParticipant.validation.birthDate.invalid',
      inFuture: 'competitors.saveParticipant.validation.birthDate.inFuture'
    },
    nationality: {
      invalid: 'competitors.saveParticipant.validation.nationality.invalid'
    },
    passNumber: {
      invalid: 'competitors.saveParticipant.validation.passNumber.invalid'
    },
    phone: {
      invalid: 'competitors.saveParticipant.validation.phone.invalid'
    },
    weightClass: {
      ageMismatch: 'competitors.saveParticipant.validation.weightClass.ageMismatch'
    }
  },
  reference: {
    gradeNone: 'competitors.saveParticipant.reference.gradeNone',
    associations: {
      unknown: 'competitors.saveParticipant.reference.associations.unknown'
    },
    nationalities: {
      DE: 'competitors.saveParticipant.reference.nationalities.DE',
      AT: 'competitors.saveParticipant.reference.nationalities.AT',
      CH: 'competitors.saveParticipant.reference.nationalities.CH'
    },
    weightClass: {
      minus: 'competitors.saveParticipant.reference.weightClass.minus',
      plus: 'competitors.saveParticipant.reference.weightClass.plus'
    }
  }
}

export default translationKeys
