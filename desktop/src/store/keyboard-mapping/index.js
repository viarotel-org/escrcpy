import { nanoid } from 'nanoid'

function createProfile(name = 'Profile default') {
  const now = Date.now()

  return {
    id: `profile-${nanoid(8)}`,
    name,
    mappings: [],
    createdAt: now,
    updatedAt: now,
  }
}

function createDeviceConfig() {
  const profile = createProfile()

  return {
    version: 1,
    enabled: false,
    hintOpacity: 0.35,
    activeProfileId: profile.id,
    profiles: [profile],
  }
}

export const useKeyboardMappingStore = defineStore('keyboard-mapping', () => {
  const deviceId = ref('')
  const config = ref(createDeviceConfig())
  const editorOpen = ref(false)
  let editingSnapshot = null

  const activeProfile = computed(() => {
    return config.value.profiles.find(item => item.id === config.value.activeProfileId)
      || config.value.profiles[0]
  })

  function readAllConfigs() {
    return window.$preload.store.get('keyboardMapping.devices') || {}
  }

  function persist(force = false) {
    if (!deviceId.value) {
      return false
    }

    if (editorOpen.value && !force) {
      return true
    }

    const devices = readAllConfigs()
    devices[deviceId.value] = toRaw(config.value)
    window.$preload.store.set('keyboardMapping.devices', devices)
    return true
  }

  function normalizeConfig(value) {
    if (!value || !Array.isArray(value.profiles) || !value.profiles.length) {
      return createDeviceConfig()
    }

    const profiles = value.profiles.map((profile, index) => ({
      id: profile.id || `profile-${nanoid(8)}`,
      name: String(profile.name || `Profile ${index + 1}`),
      mappings: Array.isArray(profile.mappings) ? profile.mappings : [],
      createdAt: profile.createdAt || Date.now(),
      updatedAt: profile.updatedAt || Date.now(),
    }))

    return {
      version: 1,
      enabled: Boolean(value.enabled),
      hintOpacity: Math.max(0.1, Math.min(1, Number(value.hintOpacity) || 0.35)),
      activeProfileId: profiles.some(item => item.id === value.activeProfileId)
        ? value.activeProfileId
        : profiles[0].id,
      profiles,
    }
  }

  function load(targetDeviceId) {
    deviceId.value = targetDeviceId || ''
    const stored = readAllConfigs()[deviceId.value]
    config.value = normalizeConfig(stored)

    if (!stored && deviceId.value) {
      persist()
    }

    return config.value
  }

  function setEnabled(value) {
    config.value.enabled = Boolean(value)
    persist()
  }

  function setHintOpacity(value) {
    config.value.hintOpacity = Math.max(0.1, Math.min(1, Number(value) || 0.35))
    persist()
  }

  function replaceConfig(value) {
    config.value = normalizeConfig(value)
    return config.value
  }

  function selectProfile(profileId) {
    if (!config.value.profiles.some(item => item.id === profileId)) {
      return false
    }

    config.value.activeProfileId = profileId
    persist()
    return true
  }

  function addProfile(name) {
    const profile = createProfile(String(name || '').trim() || `Profile ${config.value.profiles.length + 1}`)
    config.value.profiles.push(profile)
    config.value.activeProfileId = profile.id
    persist()
    return profile
  }

  function copyProfile() {
    const source = activeProfile.value
    if (!source)
      return null
    const profile = createProfile(`${source.name} copy`)
    profile.mappings = JSON.parse(JSON.stringify(source.mappings || [])).map(item => ({
      ...item,
      id: `mapping-${nanoid(8)}`,
    }))
    config.value.profiles.push(profile)
    config.value.activeProfileId = profile.id
    persist()
    return profile
  }

  function deleteProfile(profileId = config.value.activeProfileId) {
    if (config.value.profiles.length <= 1)
      return false
    const index = config.value.profiles.findIndex(item => item.id === profileId)
    if (index < 0)
      return false
    config.value.profiles.splice(index, 1)
    if (config.value.activeProfileId === profileId) {
      config.value.activeProfileId = config.value.profiles[Math.max(0, index - 1)].id
    }
    persist()
    return true
  }

  function renameProfile(name, profileId = config.value.activeProfileId) {
    const profile = config.value.profiles.find(item => item.id === profileId)
    const nextName = String(name || '').trim()
    if (!profile || !nextName)
      return false
    profile.name = nextName
    profile.updatedAt = Date.now()
    persist()
    return true
  }

  function addMapping(type = 'tap', position = {}) {
    const mapping = {
      id: `mapping-${nanoid(8)}`,
      name: '',
      type,
      accelerator: '',
      enabled: true,
      x: 0.5,
      y: 0.5,
      endX: 0.65,
      endY: 0.5,
      duration: 180,
      keyCode: 3,
      upKey: 'W',
      downKey: 'S',
      leftKey: 'A',
      rightKey: 'D',
      interval: 90,
      dragDistance: 0.14,
      smoothness: 80,
      ...position,
    }

    activeProfile.value.mappings.push(mapping)
    activeProfile.value.updatedAt = Date.now()
    persist()
    return mapping
  }

  function updateMapping(mappingId, patch) {
    const mapping = activeProfile.value?.mappings.find(item => item.id === mappingId)

    if (!mapping) {
      return false
    }

    Object.assign(mapping, patch)
    activeProfile.value.updatedAt = Date.now()
    persist()
    return true
  }

  function removeMapping(mappingId) {
    const mappings = activeProfile.value?.mappings || []
    const index = mappings.findIndex(item => item.id === mappingId)

    if (index < 0) {
      return false
    }

    mappings.splice(index, 1)
    activeProfile.value.updatedAt = Date.now()
    persist()
    return true
  }

  async function setEditorOpen(value) {
    editorOpen.value = Boolean(value)
    await window.$preload.ipcRenderer.invoke('control:set-editor-open', {
      open: editorOpen.value,
      deviceId: deviceId.value,
      config: JSON.parse(JSON.stringify(toRaw(config.value))),
    })
  }

  async function beginEdit() {
    editingSnapshot = JSON.parse(JSON.stringify(toRaw(config.value)))
    await setEditorOpen(true)
  }

  async function saveEdit() {
    config.value.enabled = true
    persist(true)
    editingSnapshot = null
    await setEditorOpen(false)
  }

  async function cancelEdit() {
    if (editingSnapshot)
      config.value = normalizeConfig(editingSnapshot)
    editingSnapshot = null
    await setEditorOpen(false)
  }

  return {
    deviceId,
    config,
    editorOpen,
    activeProfile,
    load,
    persist,
    replaceConfig,
    setEnabled,
    setHintOpacity,
    selectProfile,
    addProfile,
    copyProfile,
    deleteProfile,
    renameProfile,
    addMapping,
    updateMapping,
    removeMapping,
    setEditorOpen,
    beginEdit,
    saveEdit,
    cancelEdit,
  }
})
