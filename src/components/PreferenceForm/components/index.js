import Input from './Input/index.vue'
import InputNumber from './InputNumber/index.vue'
import InputPath from './InputPath/index.vue'
import Select from './Select/index.vue'
import SelectAudioCodec from './SelectAudioCodec/index.vue'
import SelectDisplay from './SelectDisplay/index.vue'
import SelectKeyboardInject from './SelectKeyboardInject/index.vue'
import SelectLanguage from './SelectLanguage/index.vue'
import SelectVideoCodec from './SelectVideoCodec/index.vue'
import Switch from './Switch/index.vue'

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
