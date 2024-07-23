import { defineStore } from 'pinia'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import { nanoid } from 'nanoid'

import { useEventBus } from '@vueuse/core'

import { clearTimer, isIPWithPort, replaceIP, setTimer } from '$/utils/index.js'

dayjs.extend(duration)

export const useTaskStore = defineStore('app-task', () => {
  const event = useEventBus('app-task')

  const model = ref([
    {
      label: 'device.control.install',
      value: 'install',
    },
    {
      label: 'device.control.capture',
      value: 'screenshot',
    },
    {
      label: 'device.control.shell.name',
      value: 'shell',
    },
  ])

  const list = ref([])

  function add(form) {
    const task = {
      ...form,
      timerId: void 0,
      id: nanoid(),
    }

    event.emit(task)

    list.value.push(task)
  }

  function getTimeout(task) {
    let value = 0

    const { timerType } = task

    if (timerType === 'timeout') {
      value = dayjs(task.timeout).diff(dayjs())
    }
    else if (timerType === 'interval') {
      value = dayjs.duration(task.interval, task.intervalType).asMilliseconds()
    }

    return value
  }

  function start({ task, handler }) {
    const { timerType, devices } = task

    const files = task.extra ? task.extra.split(',') : void 0

    const timeout = getTimeout(task)

    task.timerId = setTimer(
      timerType,
      () => {
        handler(devices, { files })

        if (['timeout'].includes(timerType)) {
          clear(task)
        }
      },
      timeout,
    )
  }

  function clear(task) {
    const { timerType, timerId } = task
    if (timerId) {
      clearTimer(timerType, timerId)
      list.value = list.value.filter(item => item.id !== task.id)
    }
  }

  function on(name, callback) {
    event.on((...args) => {
      const [{ taskType }] = args

      if (taskType !== name) {
        return false
      }

      callback(...args)
    })

    return event
  }

  function emit(name, args) {
    event.emit({ taskType: name, ...args })
    return event
  }

  return { event, on, emit, list, model, add, start, clear }
})
