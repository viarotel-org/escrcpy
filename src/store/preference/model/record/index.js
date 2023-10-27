export default {
  label: 'preferences.record.name',
  field: 'scrcpy',
  children: {
    recordFormat: {
      label: 'preferences.record.format.name',
      field: '--record-format',
      type: 'Select',
      value: 'mp4',
      placeholder: 'preferences.record.format.placeholder',
      options: [
        {
          label: 'mp4',
          value: 'mp4',
        },
        {
          label: 'mkv',
          value: 'mkv',
        },
      ],
    },
  },
}
