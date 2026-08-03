export default {
  label: 'preferences.camera.name',
  field: 'scrcpy',
  children: {
    cameraFacing: {
      label: 'preferences.camera.cameraFacing.name',
      field: '--camera-facing',
      type: 'Select',
      value: undefined,
      placeholder: 'preferences.camera.cameraFacing.placeholder',
      options: [
        { label: 'preferences.camera.cameraFacing.front', value: 'front' },
        { label: 'preferences.camera.cameraFacing.back', value: 'back' },
        {
          label: 'preferences.camera.cameraFacing.external',
          value: 'external',
        },
      ],
    },
    cameraSize: {
      label: 'preferences.camera.cameraSize.name',
      field: '--camera-size',
      type: 'Input',
      value: undefined,
      placeholder: 'preferences.camera.cameraSize.placeholder',
    },
    cameraAr: {
      label: 'preferences.camera.cameraAr.name',
      field: '--camera-ar',
      type: 'Input',
      value: undefined,
      placeholder: 'preferences.camera.cameraAr.placeholder',
    },
    cameraFps: {
      hidden: ['global'],
      label: 'preferences.camera.cameraFps.name',
      field: '--camera-fps',
      type: 'CameraFpsSelect',
      value: undefined,
      placeholder: 'preferences.camera.cameraFps.placeholder',
      append: 'fps',
    },
    cameraTorch: {
      label: 'preferences.camera.cameraTorch.name',
      field: '--camera-torch',
      type: 'Switch',
      value: undefined,
      unset: [false],
    },
    cameraZoom: {
      hidden: ['global'],
      label: 'preferences.camera.cameraZoom.name',
      field: '--camera-zoom',
      type: 'CameraZoomSlider',
      value: undefined,
      placeholder: 'preferences.camera.camera-zoom.placeholder',
    },
  },
}
