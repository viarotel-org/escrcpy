import { clearTimer, setTimer } from '$/utils/index.js'

import dayjs from 'dayjs'

import duration from 'dayjs/plugin/duration'

import { nanoid } from 'nanoid'
import { defineStore } from 'pinia'

dayjs.extend(duration)

export const useTaskStore = defineStore(
  'app-task',
  () => {
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
        label: 'device.control.terminal.script.name',
        value: 'shell',
      },
      {
        label: 'device.mirror.start',
        value: 'mirror',
      },
    ])

    const list = ref([])

    function add(form) {
      const task = {
        ...form,
        timerId: void 0,
        id: nanoid(),
        taskStatus: 'start',
        formatTimeout: dayjs(form.timeout).format('YYYY-MM-DD HH:mm:ss'),
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
        value = dayjs
          .duration(task.interval, task.intervalType)
          .asMilliseconds()
      }

      return value
    }

    function start({ task, handler }) {
      const { timerType, devices } = task

      const files = task.extra ? task.extra.split(',') : void 0

      const timeout = getTimeout(task)

      if (timeout < 0) {
        ElMessage.warning(window.t('device.task.timeout.expired'))
        return false
      }

      task.timerId = setTimer(
        timerType,
        () => {
          handler(devices, { files })

          if (['timeout'].includes(timerType)) {
            stop(task)
          }
        },
        timeout,
      )

      Object.assign(task, {
        taskStatus: 'progress',
      })
    }

    function stop(task) {
      const { timerType, timerId } = task
      if (timerId) {
        clearTimer(timerType, timerId)
        Object.assign(task, {
          timerId: void 0,
          taskStatus: 'finished',
        })
      }
    }

    function restart(task) {
      event.emit(task)
    }

    function remove(task) {
      stop(task)
      list.value = list.value.filter(item => item.id !== task.id)
    }

    function removeAll(tasks) {
      for (let index = 0; index < tasks.length; index++) {
        const item = tasks[index]
        remove(item)
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

    return {
      event,
      on,
      emit,
      list,
      model,
      add,
      start,
      stop,
      restart,
      remove,
      removeAll,
    }
  },
  {
    persist: {
      paths: ['list'],
    },
  },
)
