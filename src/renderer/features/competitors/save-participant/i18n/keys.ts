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
    selectAgeClassFirst: 'competitors.saveParticipant.form.selectAgeClassFirst',
    fields: {
      givenName: 'competitors.saveParticipant.form.fields.givenName',
      familyName: 'competitors.saveParticipant.form.fields.familyName',
      gender: 'competitors.saveParticipant.form.fields.gender',
      birthDate: 'competitors.saveParticipant.form.fields.birthDate',
      club: 'competitors.saveParticipant.form.fields.club',
      nationality: 'competitors.saveParticipant.form.fields.nationality',
      weightClass: 'competitors.saveParticipant.form.fields.weightClass',
      ageClass: 'competitors.saveParticipant.form.fields.ageClass',
      passNumber: 'competitors.saveParticipant.form.fields.passNumber',
      grade: 'competitors.saveParticipant.form.fields.grade',
      licenseNumber: 'competitors.saveParticipant.form.fields.licenseNumber',
      contactPhone: 'competitors.saveParticipant.form.fields.contactPhone',
      coach: 'competitors.saveParticipant.form.fields.coach'
    }
  },
  gender: {
    diverse: 'competitors.saveParticipant.gender.diverse',
    female: 'competitors.saveParticipant.gender.female',
    male: 'competitors.saveParticipant.gender.male'
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
    clubs: {
      unknown: 'competitors.saveParticipant.reference.clubs.unknown'
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
