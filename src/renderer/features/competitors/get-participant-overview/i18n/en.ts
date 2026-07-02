export default {
  toolbar: {
    ariaLabel: 'Participant list toolbar',
    placeholderAction: 'Filter (not available yet)'
  },
  list: {
    ariaLabel: 'Participants list',
    empty: 'No participants registered yet.',
    loadingPlaceholder: 'Loading participant',
    columns: {
      givenName: 'Given name',
      familyName: 'Family name',
      gender: 'Gender',
      birthDate: 'Date of birth',
      club: 'Club',
      nationality: 'Nationality',
      weightClass: 'Weight class',
      ageClass: 'Age class',
      passNumber: 'Judo pass number',
      grade: 'Grade (kyu/dan)',
      licenseNumber: 'Competition licence number',
      clubContactEmail: 'Club contact email',
      contactPhone: 'Contact phone',
      coach: 'Coach / guardian'
    }
  },
  gender: {
    female: 'Female',
    male: 'Male',
    diverse: 'Diverse'
  },
  emptyGrade: '—',
  loadError: 'Participants could not be loaded.',
  actions: {
    add: 'Add participant',
    edit: 'Edit participant',
    ariaEdit: 'Edit {name}',
    delete: 'Delete participant',
    ariaDelete: 'Delete {name}'
  },
  entry: {
    showDetails: 'Show additional details',
    hideDetails: 'Hide additional details'
  }
}
