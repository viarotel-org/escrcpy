import Input from './input/index.vue'
import InputNumber from './input-number/index.vue'
import InputPath from './input-path/index.vue'
import Select from './select/index.vue'
import SelectAudioCodec from './select-audio-codec/index.vue'
import SelectDisplay from './select-display/index.vue'
import SelectKeyboardInject from './select-keyboard-inject/index.vue'
import SelectLanguage from './select-language/index.vue'
import SelectVideoCodec from './select-video-codec/index.vue'
import Switch from './switch/index.vue'

export const inputModel = {
  PathInput: InputPath,
  AudioCodecSelect: SelectAudioCodec,
  VideoCodecSelect: SelectVideoCodec,
  DisplaySelect: SelectDisplay,
  KeyboardInjectSelect: SelectKeyboardInject,
  LanguageSelect: SelectLanguage,

  Input,
  InputNumber,
  InputPath,
  Select,
  SelectAudioCodec,
  SelectDisplay,
  SelectKeyboardInject,
  SelectLanguage,
  SelectVideoCodec,
  Switch,
}
