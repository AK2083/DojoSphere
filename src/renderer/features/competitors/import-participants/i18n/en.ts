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
      hint: 'Supported format: Excel (.xlsx, .xls)',
      reading: 'Reading file…',
      analyzing: 'Detecting columns…',
      ready: 'File read successfully.',
      previewError: 'The file could not be read. Please check the format and try again.'
    },
    mapping: {
      title: 'Map columns',
      description:
        'Assign the matching column from the Excel file to each participant field. Given name and family name must be mapped; missing required form fields use a default value on import.',
      sourceLabel: 'File column',
      targetLabel: 'Participant field',
      excelColumn: 'Column from Excel',
      ariaSource: 'Select file column',
      ariaTarget: 'Select participant field',
      notMapped: '— not mapped —',
      notAssigned: '— do not assign —',
      unnamedColumn: '(no column name)',
      requiredLegend: '* Required field from the participant form',
      sampleLabel: 'Example',
      formField: 'Form',
      rowCount: '{count} data rows detected',
      missingRequired: 'Please map all required fields: {fields}',
      defaultApplied: 'Default: {value}',
      defaultValues: {
        birthDate: 'Jan 1, 2000',
        passNumber: '00000000'
      },
      badge: {
        header: 'Auto (column name)',
        data: 'Auto (data)',
        manual: 'Manual',
        default: 'Default'
      }
    },
    import: {
      title: 'Import',
      description: 'Participants are being imported.',
      progressLabel: 'Import progress',
      complete: 'Import complete.',
      resultsListAria: 'Import results',
      statusSuccess: '{name} imported successfully',
      statusFailure: '{name} could not be imported',
      summary: '{imported} imported, {failed} failed',
      failedHint: 'Failed participants were not saved. Check the mapping and required fields.',
      errors: {
        generic: 'The import could not be completed. Check the mapping and try again.',
        noSession: 'Your session has expired. Please sign in again and restart the import.',
        unauthorized: 'You do not have permission to import. Please contact an administrator.',
        fileTransfer:
          'The file could not be processed. Select the Excel file again and restart the import.',
        databaseSchema:
          'The local database is outdated. Fully quit the application and start it again, then retry the import.',
        databaseError:
          'A database error occurred while saving. Check the mapping and required fields, then try again.',
        emptyWorkbook:
          'No participant rows were found. Ensure given name and family name are mapped and the sheet contains data.',
        parseFailed:
          'The Excel file could not be read. Check the format (.xlsx or .xls) and try again.'
      },
      rowErrors: {
        importFailed:
          'Data is incomplete or invalid. Check required fields, club, and mapping for this row.',
        validationFailed:
          'This row does not meet all requirements. Correct the data in the Excel file.',
        duplicateCompetitor:
          'A participant with the same pass number, license number, or identity already exists in the database.',
        duplicateInImport:
          'This participant appears more than once in the Excel file. Remove the duplicate row and import again.'
      }
    }
  },
  mapping: {
    targetFields: {
      weightKg: 'Weight (kg)'
    }
  }
}
