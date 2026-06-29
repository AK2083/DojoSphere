export default {
  autoUpload: {
    title: 'Send diagnostic data on errors',
    description:
      'The app always writes an anonymous system snapshot to the local error log at startup (OS version, app version). This toggle controls whether pseudonymized error data may be sent to a cloud diagnostics provider in the future. Cloud upload is not available yet.',
    enabled: 'Automatic diagnostic upload enabled',
    disabled: 'Automatic diagnostic upload disabled'
  },
  legal: {
    title: 'Data processing notice',
    body: 'Local logging includes a one-time anonymous system snapshot at startup, regardless of this toggle. Cloud upload would transmit only technical error codes — no email, tokens, or passwords. Cloud upload is not active in this version.',
    withdraw: 'Withdraw consent: disable the toggle.'
  }
}
