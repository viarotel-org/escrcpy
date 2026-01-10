/**
 * Task-related dictionary configuration
 *
 * Supported timer types:
 * 1. timeout - One-time execution (specific time)
 * 2. interval - Periodic repeat (fixed interval)
 * 3. cron - Cron expression (flexible configuration)
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
