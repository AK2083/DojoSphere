export default {
  page: {
    title: 'Import participants'
  },
  actions: {
    back: 'Back to participant list',
    cancel: 'Cancel',
    next: 'Next',
    finish: 'Finish',
    ariaCancel: 'Cancel import',
    ariaNext: 'Next step',
    ariaFinish: 'Finish import'
  },
  steps: {
    file: {
      title: 'Select file',
      description: 'Choose an Excel file with participant data to import.',
      inputLabel: 'Excel file',
      ariaInput: 'Select Excel file for import',
      hint: 'Supported format: Excel (.xlsx, .xls)'
    },
    mapping: {
      title: 'Map columns',
      description: 'Assign a column from the file to a participant form field.',
      sourceLabel: 'File column',
      targetLabel: 'Participant field',
      ariaSource: 'Select file column',
      ariaTarget: 'Select participant field'
    },
    import: {
      title: 'Import',
      description: 'Participants are being imported.',
      progressLabel: 'Import progress',
      complete: 'Import complete.',
      resultsListAria: 'Import results',
      statusSuccess: '{name} imported successfully',
      statusFailure: '{name} could not be imported'
    }
  },
  mapping: {
    sourceColumns: {
      givenName: 'Given name',
      familyName: 'Family name',
      club: 'Club'
    }
  }
}
