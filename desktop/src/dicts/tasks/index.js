/**
 * 任务相关字典配置
 *
 * 定时器类型支持三种:
 * 1. timeout - 单次执行（指定时间点）
 * 2. interval - 周期重复（固定间隔）
 * 3. cron - Cron 表达式（灵活配置）
 */

export const timerType = [
  {
    label: 'device.task.frequency.timeout',
    value: 'timeout',
  },
  {
    label: 'device.task.frequency.interval',
    value: 'interval',
  },
  {
    label: 'device.task.frequency.cron',
    value: 'cron',
  },
]

export const timeUnit = [
  // {
  //   label: 'time.unit.month',
  //   value: 'month',
  // },
  // {
  //   label: 'time.unit.week',
  //   value: 'week',
  // },
  {
    label: 'time.unit.day',
    value: 'day',
  },
  {
    label: 'time.unit.hour',
    value: 'hour',
  },
  {
    label: 'time.unit.minute',
    value: 'minute',
  },
  {
    label: 'time.unit.second',
    value: 'second',
  },
  {
    label: 'time.unit.millisecond',
    value: 'millisecond',
  },
]
