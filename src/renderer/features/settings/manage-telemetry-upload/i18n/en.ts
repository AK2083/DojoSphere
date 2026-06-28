export default {
  autoUpload: {
    title: 'Send diagnostic data on errors',
    description:
      'When enabled, pseudonymized technical error data may be sent to a cloud diagnostics provider in the future. Cloud upload is not available yet.',
    enabled: 'Automatic diagnostic upload enabled',
    disabled: 'Automatic diagnostic upload disabled'
  },
  legal: {
    title: 'Data processing notice',
    body: 'Only technical error codes and context would be transmitted — no email, tokens, or passwords. Cloud upload is not active in this version. Withdraw consent anytime by turning the toggle off.',
    withdraw: 'Withdraw consent: disable the toggle.'
  }
}
