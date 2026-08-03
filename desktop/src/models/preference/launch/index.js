export default {
  label: 'preferences.launch.name',
  field: 'scrcpy',

  children: {
    newDisplay: {
      label: 'preferences.launch.newDisplay.name',
      field: '--new-display',
      type: 'Select',
      value: undefined,
      placeholder: 'preferences.launch.newDisplay.placeholder',
      tips: 'preferences.launch.newDisplay.tips',
      options: [
        {
          label: 'Desktop',
          options: [
            { label: 'HD 16:9 1280x720/160', value: '1280x720/160' },
            { label: 'FHD 16:9 1920x1080/160', value: '1920x1080/160' },
            { label: 'QHD 16:9 2560x1440/160', value: '2560x1440/160' },
            { label: '4K UHD 16:9 3840x2160/160', value: '3840x2160/160' },
            { label: 'FHD Retina 16:9 3840x2160/320', value: '3840x2160/320' },
            { label: 'QHD Retina 16:9 5120x2880/320', value: '5120x2880/320' },
            { label: '4K Retina 16:9 7680x4320/320', value: '7680x4320/320' },
            { label: 'WXGA 16:10 1280x800/160', value: '1280x800/160' },
            { label: 'WXGA+ 16:10 1440x900/160', value: '1440x900/160' },
            { label: 'WSXGA+ 16:10 1680x1050/160', value: '1680x1050/160' },
            { label: 'WUXGA 16:10 1920x1200/160', value: '1920x1200/160' },
            { label: 'WQXGA 16:10 2560x1600/160', value: '2560x1600/160' },
            { label: '4K 16:10 3840x2400/160', value: '3840x2400/160' },
            { label: 'WUXGA Retina 16:10 3840x2400/320', value: '3840x2400/320' },
            { label: 'WQXGA Retina 16:10 5120x3200/320', value: '5120x3200/320' },
            { label: '8K 16:10 7680x4800/320', value: '7680x4800/320' },
          ],
        },
        {
          label: 'Mac',
          options: [
            { label: 'MacBook Air 13" 2560x1664/224', value: '2560x1664/224' },
            { label: 'MacBook Air 15" 2880x1864/224', value: '2880x1864/224' },
            { label: 'MacBook Pro 13" 2560x1600/227', value: '2560x1600/227' },
            { label: 'MacBook Pro 14" 3024x1964/254', value: '3024x1964/254' },
            { label: 'MacBook Pro 16" 3456x2234/254', value: '3456x2234/254' },
            { label: 'iMac 24" 4480x2520/218', value: '4480x2520/218' },
            { label: 'Pro Display XDR 32" 6016x3384/218', value: '6016x3384/218' },
          ],
        },
        {
          label: 'Ultrawide',
          options: [
            { label: 'UW FHD 2560x1080/160', value: '2560x1080/160' },
            { label: 'UW QHD 3440x1440/160', value: '3440x1440/160' },
            { label: 'UW QHD+ 3840x1600/160', value: '3840x1600/160' },
            { label: 'UW 5K 5120x2160/160', value: '5120x2160/160' },
          ],
        },
        {
          label: 'iPad',
          options: [
            { label: 'iPad Mini 2266x1488/326', value: '2266x1488/326' },
            { label: 'iPad 10th 2360x1640/264', value: '2360x1640/264' },
            { label: 'iPad Air 11" 2360x1640/264', value: '2360x1640/264' },
            { label: 'iPad Air 13" 2732x2048/264', value: '2732x2048/264' },
            { label: 'iPad Pro 11" 2388x1668/264', value: '2388x1668/264' },
            { label: 'iPad Pro 13" 2752x2064/264', value: '2752x2064/264' },
          ],
        },
        {
          label: 'iPhone',
          options: [
            { label: 'iPhone SE 1334x750/326', value: '1334x750/326' },
            { label: 'iPhone XR 1792x828/326', value: '1792x828/326' },
            { label: 'iPhone 12 Pro 2532x1170/460', value: '2532x1170/460' },
            { label: 'iPhone 14 Pro Max 2796x1290/460', value: '2796x1290/460' },
            { label: 'iPhone 16 2556x1179/460', value: '2556x1179/460' },
            { label: 'iPhone 17 / 17 Pro 2622x1206/460', value: '2622x1206/460' },
            { label: 'iPhone 17 Pro Max 2868x1320/460', value: '2868x1320/460' },
            { label: 'iPhone Air 2736x1260/460', value: '2736x1260/460' },
          ],
        },
        {
          label: 'Samsung',
          options: [
            { label: 'Galaxy S8+ 1440x2960/529', value: '1440x2960/529' },
            { label: 'Galaxy S20 Ultra 1440x3200/511', value: '1440x3200/511' },
            { label: 'Galaxy A51/71 1080x2400/405', value: '1080x2400/405' },
            { label: 'Galaxy Tab S4 2560x1600/287', value: '2560x1600/287' },
          ],
        },
        {
          label: 'Google Pixel',
          options: [
            { label: 'Pixel 3 XL 1440x2960/523', value: '1440x2960/523' },
            { label: 'Pixel 4 1080x2280/444', value: '1080x2280/444' },
            { label: 'Pixel 7 1080x2400/416', value: '1080x2400/416' },
          ],
        },
        {
          label: 'Surface',
          options: [
            { label: 'Surface Pro 7 2736x1824/267', value: '2736x1824/267' },
            { label: 'Surface Duo 1800x1350/401', value: '1800x1350/401' },
          ],
        },
        {
          label: 'Fold',
          options: [
            { label: 'Galaxy Z Fold 5 Unfolded 2176x1812/374', value: '2176x1812/374' },
            { label: 'Galaxy Z Fold 5 Folded 904x2316/480', value: '904x2316/480' },
          ],
        },
      ],
    },
    displayImePolicy: {
      label: 'preferences.launch.displayImePolicy.name',
      field: '--display-ime-policy',
      type: 'Select',
      value: 'local',
      placeholder: 'preferences.launch.displayImePolicy.placeholder',
      tips: 'preferences.launch.displayImePolicy.tips',
      options: [
        { label: 'local', value: 'local', placeholder: 'preferences.launch.displayImePolicy.local.placeholder' },
      ],
    },
    flexDisplay: {
      label: 'preferences.launch.flexDisplay.name',
      field: '--flex-display',
      type: 'Switch',
      value: undefined,
      unset: [false],
      placeholder: 'preferences.launch.flexDisplay.placeholder',
    },
    noVdDestroyContent: {
      label: 'preferences.launch.noVdDestroyContent.name',
      field: '--no-vd-destroy-content',
      type: 'Switch',
      value: undefined,
      unset: [false],
      placeholder: 'preferences.launch.noVdDestroyContent.placeholder',
      tips: 'preferences.launch.noVdDestroyContent.tips',
    },
  },
}
