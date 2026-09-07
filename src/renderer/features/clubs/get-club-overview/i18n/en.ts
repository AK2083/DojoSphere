export default {
  toolbar: {
    ariaLabel: 'Club list toolbar',
    placeholderAction: 'Filter (not available yet)'
  },
  list: {
    ariaLabel: 'Clubs list',
    empty: 'No clubs registered yet.',
    loadingPlaceholder: 'Loading club',
    columns: {
      city: 'City',
      website: 'Website',
      status: 'Status',
      district: 'District',
      country: 'Country',
      association: 'Association',
      regionalAssociation: 'Regional association',
      clubNumber: 'Club number',
      headquarters: 'Headquarters',
      trainingVenue: 'Training venue',
      billingAddress: 'Billing address',
      email: 'Email address',
      phone: 'Phone number'
    }
  },
  status: {
    active: 'Active',
    inactive: 'Inactive'
  },
  loadError: 'Clubs could not be loaded.',
  stubUnavailable: 'This action is not available yet.',
  actions: {
    add: 'Add club',
    edit: 'Edit club',
    ariaEdit: 'Edit {name}',
    delete: 'Delete club',
    ariaDelete: 'Delete {name}'
  },
  entry: {
    showDetails: 'Show additional details',
    hideDetails: 'Hide additional details',
    emptyValue: '—'
  }
}
