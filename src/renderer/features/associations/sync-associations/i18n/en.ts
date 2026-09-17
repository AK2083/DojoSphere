export default {
  dialog: {
    title: 'Sync associations from cloud',
    legal: {
      heading: 'Legal notice',
      body: 'This action downloads association data (club names, addresses, contact information, and federation hierarchy). The data are publicly available reference records.\n\nBy confirming, you acknowledge that this application will establish an internet connection to retrieve and store these data locally. No personal user data are transmitted in the process.',
      source: 'Data source: djb-registry'
    },
    actions: {
      cancel: 'Cancel',
      confirm: 'Download and sync',
      close: 'Close'
    },
    syncing: {
      progress: '{processed} / {total} associations updated',
      current: 'Updating: {name}'
    },
    done: {
      message: '{count} associations were synced successfully.',
      nothingNew: 'All associations are already up to date.'
    },
    error: 'Sync failed. Please check your internet connection and try again.',
    notSignedIn:
      'You must be signed in to your cloud account to sync associations. Please sign in and try again.'
  }
}
