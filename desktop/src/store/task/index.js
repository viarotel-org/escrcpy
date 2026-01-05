/**
 * 任务 Store - 计划任务管理
 *
 * 基于 croner@9.1.0 实现的定时任务系统，支持三种执行频率:
 * 1. 单次执行 (timeout): 在指定时间点执行一次
 * 2. 周期重复 (interval): 按固定时间间隔重复执行
 * 3. Cron 表达式 (cron): 基于 Cron 表达式的灵活定时配置
 *
 * 执行精度 ≤1s，通过 croner 的高精度定时器实现
 */

import { Cron } from 'croner'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { nanoid } from 'nanoid'
import { defineStore } from 'pinia'

dayjs.extend(duration)

/**
 * 任务状态常量
 */
export const TaskStatus = {
  START: 'start', // 初始状态
  PROGRESS: 'progress', // 执行中
  FINISHED: 'finished', // 已完成
  FAILED: 'failed', // 失败
}

/**
 * 执行频率类型常量
 */
export const TimerType = {
  TIMEOUT: 'timeout', // 单次执行
  INTERVAL: 'interval', // 周期重复
  CRON: 'cron', // Cron 表达式
}

export const useTaskStore = defineStore(
  'app-task',
  () => {
    // 事件总线，用于任务事件分发
    const event = useEventBus('app-task')

    /**
     * 任务类型模型（扩展支持 Copilot）
     * 可通过 registerTaskType 方法扩展新任务类型
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

    // 任务列表
    const list = ref([])

    // Cron 实例映射表，用于管理 croner 实例
    const cronInstances = new Map()

    /**
     * 注册新的任务类型
     * @param {Object} taskType - 任务类型配置
     * @param {string} taskType.label - 显示标签（i18n key）
     * @param {string} taskType.value - 任务类型值
     */
    function registerTaskType(taskType) {
      const exists = model.value.some(item => item.value === taskType.value)
      if (!exists) {
        model.value.push(taskType)
      }
    }

    /**
     * 添加任务
     * @param {Object} form - 任务表单数据
     * @returns {Object} 创建的任务对象
     */
    function add(form) {
      const task = {
        ...form,
        cronJob: void 0, // croner 实例引用标识
        id: nanoid(),
        taskStatus: TaskStatus.START,
        formatTimeout: form.timeout
          ? dayjs(form.timeout).format('YYYY-MM-DD HH:mm:ss')
          : '',
        createdAt: Date.now(),
      }

      // 发送任务事件，通知相关模块处理
      event.emit(task)

      list.value.push(task)

      return task
    }

    /**
     * 将任务配置转换为 Cron 表达式
     * @param {Object} task - 任务对象
     * @returns {string|null} Cron 表达式或 null
     */
    function convertTaskToCronExpression(task) {
      const { timerType, timeout, interval, intervalType, cronExpression } = task

      switch (timerType) {
        case TimerType.TIMEOUT: {
          // 单次执行：转换为特定时间点的 Cron 表达式
          if (!timeout) {
            return null
          }
          const date = dayjs(timeout)
          // Cron 格式: 秒 分 时 日 月 周
          return `${date.second()} ${date.minute()} ${date.hour()} ${date.date()} ${date.month() + 1} *`
        }

        case TimerType.INTERVAL: {
          // 周期执行：转换为间隔 Cron 表达式
          if (!interval) {
            return null
          }
          const intervalValue = Number.parseInt(interval)

          switch (intervalType) {
            case 'second':
              // croner 支持秒级，使用 6 位 Cron
              return `*/${intervalValue} * * * * *`
            case 'minute':
              return `*/${intervalValue} * * * *`
            case 'hour':
              return `0 */${intervalValue} * * *`
            case 'day':
              return `0 0 */${intervalValue} * *`
            case 'millisecond':
              // 毫秒级不支持 Cron，使用最小秒级
              console.warn('Millisecond interval not supported by Cron, using 1 second minimum')
              return '* * * * * *'
            default:
              return `*/${intervalValue} * * * *`
          }
        }

        case TimerType.CRON: {
          // 直接使用 Cron 表达式
          return cronExpression || null
        }

        default:
          return null
      }
    }

    /**
     * 计算任务下次执行的延迟时间（毫秒）
     * 用于兼容原有 timeout/interval 逻辑
     * @param {Object} task - 任务对象
     * @returns {number} 延迟毫秒数
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
        // 对于 Cron 类型，计算到下次执行的时间
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
     * 启动任务
     * 使用 croner@9.1.0 创建定时器，保证执行精度 ≤1s
     *
     * @param {Object} options - 启动选项
     * @param {Object} options.task - 任务对象
     * @param {Function} options.handler - 任务执行处理函数
     */
    function start({ task, handler }) {
      const { timerType, devices, id } = task

      const files = task.extra ? task.extra.split(',') : void 0

      // 检查任务是否已过期
      const timeout = getTimeout(task)
      if (timeout < 0 && timerType !== TimerType.CRON) {
        ElMessage.warning(window.t('device.task.timeout.expired'))
        return false
      }

      // 清除可能存在的旧定时器
      stopCronJob(id)

      try {
        // 转换为 Cron 表达式
        const cronExpression = convertTaskToCronExpression(task)

        if (!cronExpression) {
          console.error('Failed to convert task to cron expression')
          return false
        }

        // 创建 croner 实例
        const cronOptions = {
          legacyMode: false,
          protect: true, // 防止重叠执行
        }

        // 对于单次执行，设置 maxRuns 为 1
        if (timerType === TimerType.TIMEOUT) {
          cronOptions.maxRuns = 1
        }

        const cronJob = new Cron(cronExpression, cronOptions, () => {
          // 执行任务处理函数
          handler(devices, {
            files,
            extra: task.extra,
            taskId: id,
            taskType: task.taskType,
          })

          // 单次执行完成后停止任务
          if (timerType === TimerType.TIMEOUT) {
            stop(task)
          }
        })

        // 保存 Cron 实例
        cronInstances.set(id, cronJob)

        // 更新任务状态
        Object.assign(task, {
          cronJob: id, // 使用 id 作为引用标识
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
     * 停止 Cron 定时器
     * @param {string} taskId - 任务 ID
     */
    function stopCronJob(taskId) {
      const cronJob = cronInstances.get(taskId)
      if (cronJob) {
        cronJob.stop()
        cronInstances.delete(taskId)
      }
    }

    /**
     * 停止任务
     * @param {Object} task - 任务对象
     */
    function stop(task) {
      if (!task) {
        return false
      }

      // 停止 Cron 定时器
      stopCronJob(task.id)

      // 更新任务状态
      Object.assign(task, {
        cronJob: void 0,
        taskStatus: TaskStatus.FINISHED,
      })
    }

    /**
     * 重新启动任务
     * @param {Object} task - 任务对象
     */
    function restart(task) {
      // 对于单次执行任务，需要更新执行时间
      if (task.timerType === TimerType.TIMEOUT) {
        // 重新发送事件让处理器决定如何处理
        event.emit({ ...task, taskStatus: TaskStatus.START })
      }
      else {
        event.emit(task)
      }
    }

    /**
     * 移除任务
     * @param {Object} task - 任务对象
     */
    function remove(task) {
      stop(task)
      list.value = list.value.filter(item => item.id !== task.id)
    }

    /**
     * 批量移除任务
     * @param {Array} tasks - 任务数组
     */
    function removeAll(tasks) {
      for (let index = 0; index < tasks.length; index++) {
        const item = tasks[index]
        remove(item)
      }
    }

    /**
     * 注册任务事件监听器
     * 用于各模块注册对应任务类型的处理逻辑
     *
     * @param {string} name - 任务类型名称
     * @param {Function} callback - 回调函数
     * @returns {Object} 事件总线实例
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
     * 发送任务事件
     * @param {string} name - 任务类型名称
     * @param {Object} args - 事件参数
     * @returns {Object} 事件总线实例
     */
    function emit(name, args) {
      event.emit({ taskType: name, ...args })
      return event
    }

    /**
     * 获取任务的下次执行时间
     * @param {Object} task - 任务对象
     * @returns {Date|null} 下次执行时间
     */
    function getNextExecution(task) {
      const cronJob = cronInstances.get(task.id)
      if (cronJob) {
        return cronJob.nextRun()
      }
      return null
    }

    /**
     * 获取任务执行统计
     * @param {Object} task - 任务对象
     * @returns {Object} 统计信息
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
