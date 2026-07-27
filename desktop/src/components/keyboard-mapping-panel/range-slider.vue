<template>
  <label class="block">
    <span class="mb-2 flex items-center justify-between text-gray-300">
      <span>{{ label }}</span>
      <b class="font-normal text-gray-100">{{ value }}{{ suffix }}</b>
    </span>
    <input
      class="mapping-range-slider"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="value"
      @input="emit('change', Number($event.target.value))"
    >
  </label>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: '',
  },
  value: {
    type: Number,
    default: 0,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 1,
  },
  suffix: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['change'])
</script>

<style scoped>
.mapping-range-slider {
  width: 100%;
  height: 18px;
  margin: 0;
  appearance: none;
  cursor: pointer;
  background: transparent;
}

.mapping-range-slider::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 999px;
  background: #4b4f52;
}

.mapping-range-slider::-webkit-slider-thumb {
  width: 18px;
  height: 18px;
  margin-top: -7px;
  appearance: none;
  border: 2px solid #19a997;
  border-radius: 50%;
  background: #f4f7f7;
  box-shadow: 0 1px 4px rgb(0 0 0 / 45%);
}

.mapping-range-slider:focus-visible {
  outline: 1px solid #19a997;
  outline-offset: 3px;
  border-radius: 999px;
}
</style>
