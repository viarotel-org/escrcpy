/**
 * Task Store - Scheduled task management
 *
 * A scheduling system implemented with croner@9.1.0, supporting three timer types:
 * 1. Single run (timeout): execute once at a specified time
 * 2. Repeating interval (interval): execute at fixed intervals
 * 3. Cron expression (cron): flexible scheduling via cron expressions
 *
 * Execution precision ≤1s provided by croner's high-precision timers
 */

import { Cron } from 'croner'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { nanoid } from 'nanoid'
import { defineStore } from 'pinia'

dayjs.extend(duration)

/**
 * Task status constants
 */
export const TaskStatus = {
  START: 'start', // Initial status
  PROGRESS: 'progress', // In progress
  FINISHED: 'finished', // Completed
  FAILED: 'failed', // Failed
}

/**
 * Timer type constants
 */
export const TimerType = {
  TIMEOUT: 'timeout', // Single run
  INTERVAL: 'interval', // Repeating interval
  CRON: 'cron', // Cron expression
}

export const useTaskStore = defineStore(
  'app-task',
  () => {
    // Event bus for task event dispatch
    const event = useEventBus('app-task')

    /**
     * Task type model (supports Copilot extension)
     * New task types can be added via the registerTaskType method
     */
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
        label: 'terminal.script.name',
        value: 'shell',
      },
      {
        label: 'device.mirror.start',
        value: 'mirror',
      },
      {
        label: 'device.control.copilot',
        value: 'copilot',
      },
    ])

    // Task list
    const list = ref([])

    // Cron instance map used to manage croner instances
    const cronInstances = new Map()

    /**
     * Register a new task type
     * @param {Object} taskType - Task type configuration
     * @param {string} taskType.label - Display label (i18n key)
     * @param {string} taskType.value - Task type value
     */
    function registerTaskType(taskType) {
      const exists = model.value.some(item => item.value === taskType.value)
      if (!exists) {
        model.value.push(taskType)
      }
    }

    /**
     * Add a task
     * @param {Object} form - Task form data
     * @returns {Object} Created task object
     */
    function add(form) {
      const task = {
        ...form,
        cronJob: void 0, // croner instance reference
        id: nanoid(),
        taskStatus: TaskStatus.START,
        formatTimeout: form.timeout
          ? dayjs(form.timeout).format('YYYY-MM-DD HH:mm:ss')
          : '',
        createdAt: Date.now(),
      }

      // Emit task event to notify relevant modules
      event.emit(task)

      list.value.push(task)

      return task
    }

    /**
     * Convert a task configuration to a cron expression
     * @param {Object} task - Task object
     * @returns {string|null} Cron expression or null
     */
    function convertTaskToCronExpression(task) {
      const { timerType, timeout, interval, intervalType, cronExpression } = task

      switch (timerType) {
        case TimerType.TIMEOUT: {
          // Single run: convert to a cron expression for a specific time
          if (!timeout) {
            return null
          }
          const date = dayjs(timeout)
          // Cron format: second minute hour day month week
          return `${date.second()} ${date.minute()} ${date.hour()} ${date.date()} ${date.month() + 1} *`
        }

        case TimerType.INTERVAL: {
          // Interval execution: convert to interval cron expression
          if (!interval) {
            return null
          }
          const intervalValue = Number.parseInt(interval)

          switch (intervalType) {
            case 'second':
              // croner supports second-level granularity; use 6-field cron
              return `*/${intervalValue} * * * * *`
            case 'minute':
              return `*/${intervalValue} * * * *`
            case 'hour':
              return `0 */${intervalValue} * * *`
            case 'day':
              return `0 0 */${intervalValue} * *`
            case 'millisecond':
              // Millisecond intervals are not supported by cron; use 1-second minimum
              console.warn('Millisecond interval not supported by Cron, using 1 second minimum')
              return '* * * * * *'
            default:
              return `*/${intervalValue} * * * *`
          }
        }

        case TimerType.CRON: {
          // Use Cron expression directly
          return cronExpression || null
        }

        default:
          return null
      }
    }

    /**
     * Compute delay until the task's next execution (milliseconds)
     * Compatible with legacy timeout/interval logic
     * @param {Object} task - Task object
     * @returns {number} Delay in milliseconds
     */
    function getTimeout(task) {
      let value = 0

      const { timerType } = task

      if (timerType === TimerType.TIMEOUT) {
        value = dayjs(task.timeout).diff(dayjs())
      }
      else if (timerType === TimerType.INTERVAL) {
        value = dayjs
          .duration(task.interval, task.intervalType)
          .asMilliseconds()
      }
      else if (timerType === TimerType.CRON) {
        // For Cron type, compute delay until next execution
        try {
          const cron = new Cron(task.cronExpression, { legacyMode: false })
          const nextRun = cron.nextRun()
          if (nextRun) {
            value = nextRun.getTime() - Date.now()
          }
        }
        catch (error) {
          console.error('Failed to calculate next cron run:', error)
          value = -1
        }
      }

      return value
    }

    /**
     * Start a task
     * Uses croner@9.1.0 to create timers, ensuring execution precision ≤1s
     *
     * @param {Object} options - Start options
     * @param {Object} options.task - Task object
     * @param {Function} options.handler - Task handler function
     */
    function start({ task, handler }) {
      const { timerType, devices, id } = task

      const files = task.extra ? task.extra.split(',') : void 0

      // Check whether the task has expired
      const timeout = getTimeout(task)
      if (timeout < 0 && timerType !== TimerType.CRON) {
        ElMessage.warning(window.t('device.task.timeout.expired'))
        return false
      }

      // Clear any existing timer
      stopCronJob(id)

      try {
        // Convert to cron expression
        const cronExpression = convertTaskToCronExpression(task)

        if (!cronExpression) {
          console.error('Failed to convert task to cron expression')
          return false
        }

        // Create croner instance
        const cronOptions = {
          legacyMode: false,
          protect: true, // Prevent overlapping executions
        }

        // For single-run tasks, set maxRuns to 1
        if (timerType === TimerType.TIMEOUT) {
          cronOptions.maxRuns = 1
        }

        const cronJob = new Cron(cronExpression, cronOptions, () => {
          // Execute task handler function
          handler(devices, {
            files,
            extra: task.extra,
            taskId: id,
            taskType: task.taskType,
          })

          // Stop single-run task after execution
          if (timerType === TimerType.TIMEOUT) {
            stop(task)
          }
        })

        // Store cron instance
        cronInstances.set(id, cronJob)

        // Update task status
        Object.assign(task, {
          cronJob: id, // Use id as reference handle
          taskStatus: TaskStatus.PROGRESS,
        })

        return true
      }
      catch (error) {
        console.error('Failed to start task with croner:', error)
        ElMessage.error(window.t('device.task.start.failed'))
        return false
      }
    }

    /**
     * Stop Cron timer
     * @param {string} taskId - Task ID
     */
    function stopCronJob(taskId) {
      const cronJob = cronInstances.get(taskId)
      if (cronJob) {
        cronJob.stop()
        cronInstances.delete(taskId)
      }
    }

    /**
     * Stop a task
     * @param {Object} task - Task object
     */
    function stop(task) {
      if (!task) {
        return false
      }

      // Stop Cron timer
      stopCronJob(task.id)

      // Update task status
      Object.assign(task, {
        cronJob: void 0,
        taskStatus: TaskStatus.FINISHED,
      })
    }

    /**
     * Restart a task
     * @param {Object} task - Task object
     */
    function restart(task) {
      // For single-run tasks, update execution time
      if (task.timerType === TimerType.TIMEOUT) {
        // Re-emit event for handler to decide how to handle it
        event.emit({ ...task, taskStatus: TaskStatus.START })
      }
      else {
        event.emit(task)
      }
    }

    /**
     * Remove a task
     * @param {Object} task - Task object
     */
    function remove(task) {
      stop(task)
      list.value = list.value.filter(item => item.id !== task.id)
    }

    /**
     * Remove multiple tasks
     * @param {Array} tasks - Array of task objects
     */
    function removeAll(tasks) {
      for (let index = 0; index < tasks.length; index++) {
        const item = tasks[index]
        remove(item)
      }
    }

    /**
     * Register a task event listener
     * Allows modules to register handlers for specific task types
     *
     * @param {string} name - Task type name
     * @param {Function} callback - Callback function
     * @returns {Object} Event bus instance
     */
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

    /**
     * Emit a task event
     * @param {string} name - Task type name
     * @param {Object} args - Event arguments
     * @returns {Object} Event bus instance
     */
    function emit(name, args) {
      event.emit({ taskType: name, ...args })
      return event
    }

    /**
     * Get the next execution time for a task
     * @param {Object} task - Task object
     * @returns {Date|null} Next execution time or null
     */
    function getNextExecution(task) {
      const cronJob = cronInstances.get(task.id)
      if (cronJob) {
        return cronJob.nextRun()
      }
      return null
    }

    /**
     * Get task execution statistics
     * @param {Object} task - Task object
     * @returns {Object} Statistics
     */
    function getTaskStats(task) {
      const cronJob = cronInstances.get(task.id)
      if (cronJob) {
        return {
          isRunning: cronJob.isRunning(),
          isBusy: cronJob.isBusy(),
          nextRun: cronJob.nextRun(),
          previousRun: cronJob.previousRun(),
        }
      }
      return null
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
      registerTaskType,
      getTimeout,
      getNextExecution,
      getTaskStats,
      TaskStatus,
      TimerType,
    }
  },
  {
    persist: {
      paths: ['list'],
    },
  },
)
