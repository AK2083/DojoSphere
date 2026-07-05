export default {
  page: {
    title: 'competitors.importParticipants.page.title'
  },
  actions: {
    back: 'competitors.importParticipants.actions.back',
    cancel: 'competitors.importParticipants.actions.cancel',
    next: 'competitors.importParticipants.actions.next',
    finish: 'competitors.importParticipants.actions.finish',
    ariaCancel: 'competitors.importParticipants.actions.ariaCancel',
    ariaNext: 'competitors.importParticipants.actions.ariaNext',
    ariaFinish: 'competitors.importParticipants.actions.ariaFinish'
  },
  steps: {
    file: {
      title: 'competitors.importParticipants.steps.file.title',
      description: 'competitors.importParticipants.steps.file.description',
      inputLabel: 'competitors.importParticipants.steps.file.inputLabel',
      ariaInput: 'competitors.importParticipants.steps.file.ariaInput',
      hint: 'competitors.importParticipants.steps.file.hint',
      reading: 'competitors.importParticipants.steps.file.reading',
      analyzing: 'competitors.importParticipants.steps.file.analyzing',
      ready: 'competitors.importParticipants.steps.file.ready',
      previewError: 'competitors.importParticipants.steps.file.previewError'
    },
    mapping: {
      title: 'competitors.importParticipants.steps.mapping.title',
      description: 'competitors.importParticipants.steps.mapping.description',
      sourceLabel: 'competitors.importParticipants.steps.mapping.sourceLabel',
      targetLabel: 'competitors.importParticipants.steps.mapping.targetLabel',
      excelColumn: 'competitors.importParticipants.steps.mapping.excelColumn',
      ariaSource: 'competitors.importParticipants.steps.mapping.ariaSource',
      ariaTarget: 'competitors.importParticipants.steps.mapping.ariaTarget',
      notMapped: 'competitors.importParticipants.steps.mapping.notMapped',
      notAssigned: 'competitors.importParticipants.steps.mapping.notAssigned',
      unnamedColumn: 'competitors.importParticipants.steps.mapping.unnamedColumn',
      requiredLegend: 'competitors.importParticipants.steps.mapping.requiredLegend',
      sampleLabel: 'competitors.importParticipants.steps.mapping.sampleLabel',
      rowCount: 'competitors.importParticipants.steps.mapping.rowCount',
      formField: 'competitors.importParticipants.steps.mapping.formField',
      missingRequired: 'competitors.importParticipants.steps.mapping.missingRequired',
      defaultApplied: 'competitors.importParticipants.steps.mapping.defaultApplied',
      defaultValues: {
        birthDate: 'competitors.importParticipants.steps.mapping.defaultValues.birthDate',
        passNumber: 'competitors.importParticipants.steps.mapping.defaultValues.passNumber'
      },
      badge: {
        header: 'competitors.importParticipants.steps.mapping.badge.header',
        data: 'competitors.importParticipants.steps.mapping.badge.data',
        manual: 'competitors.importParticipants.steps.mapping.badge.manual',
        default: 'competitors.importParticipants.steps.mapping.badge.default'
      }
    },
    import: {
      title: 'competitors.importParticipants.steps.import.title',
      description: 'competitors.importParticipants.steps.import.description',
      progressLabel: 'competitors.importParticipants.steps.import.progressLabel',
      complete: 'competitors.importParticipants.steps.import.complete',
      resultsListAria: 'competitors.importParticipants.steps.import.resultsListAria',
      statusSuccess: 'competitors.importParticipants.steps.import.statusSuccess',
      statusFailure: 'competitors.importParticipants.steps.import.statusFailure',
      summary: 'competitors.importParticipants.steps.import.summary',
      failedHint: 'competitors.importParticipants.steps.import.failedHint',
      errors: {
        generic: 'competitors.importParticipants.steps.import.errors.generic',
        noSession: 'competitors.importParticipants.steps.import.errors.noSession',
        unauthorized: 'competitors.importParticipants.steps.import.errors.unauthorized',
        fileTransfer: 'competitors.importParticipants.steps.import.errors.fileTransfer',
        databaseSchema: 'competitors.importParticipants.steps.import.errors.databaseSchema',
        databaseError: 'competitors.importParticipants.steps.import.errors.databaseError',
        emptyWorkbook: 'competitors.importParticipants.steps.import.errors.emptyWorkbook',
        parseFailed: 'competitors.importParticipants.steps.import.errors.parseFailed'
      },
      rowErrors: {
        importFailed: 'competitors.importParticipants.steps.import.rowErrors.importFailed',
        validationFailed: 'competitors.importParticipants.steps.import.rowErrors.validationFailed'
      }
    }
  },
  mapping: {
    targetFields: {
      weightKg: 'competitors.importParticipants.mapping.targetFields.weightKg'
    }
  }
}
