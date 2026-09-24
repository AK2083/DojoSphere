export default {
  dialog: {
    title: 'Update association data',
    legal: {
      heading: 'Legal notice',
      body: 'By confirming, freely available association reference data from the internet (names, addresses, contact details, and federation hierarchy) will be downloaded from a remote server and stored locally on this device.\n\nAssociations you deleted locally will be imported again on the next update if they still exist in the cloud source. Unchanged associations that are already present locally are skipped.\n\nThese are publicly available directory records. An internet connection is required for the download.',
      gdpr: 'Privacy (GDPR): No personal data from your user account is transmitted to third parties. Only the public reference data named above are downloaded and stored locally. Processing is limited to local use in DojoSphere. You can delete locally stored data at any time by resetting the application data.',
      source: 'Data source: publicly available association / federation directories'
    },
    actions: {
      cancel: 'Cancel',
      confirm: 'Download',
      close: 'Close'
    },
    syncing: {
      loading: 'Loading association data…',
      percent: '{percent} percent loaded'
    },
    results: {
      listAria: 'Imported associations',
      statusSuccess: '{name} imported successfully',
      statusFailure: '{name} was not imported',
      statusPending: '{name} is being imported',
      empty: 'No new or missing associations found to import.'
    },
    error: 'Update failed. Please check your internet connection and try again.',
    toast: {
      imported: '{count} associations imported',
      none: '0 associations imported'
    }
  }
}
