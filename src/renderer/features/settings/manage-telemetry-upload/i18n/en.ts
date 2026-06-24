export default {
  autoUpload: {
    title: 'Send diagnostic data on errors',
    description:
      'On errors, sends pseudonymized technical data (error codes, module, HMAC identifier) to Grafana Cloud for troubleshooting. Independent of cloud mode.',
    enabled: 'Automatic diagnostic upload enabled',
    disabled: 'Automatic diagnostic upload disabled'
  },
  legal: {
    title: 'Data processing notice',
    body: 'Only technical error codes and context are transmitted — no email, tokens, or passwords. User identifiers are pseudonymized with HMAC. Processing by Grafana Labs as processor. Withdraw consent anytime by turning the toggle off.',
    grafanaPrivacy: 'Grafana privacy policy',
    withdraw: 'Withdraw consent: disable the toggle.'
  }
}
