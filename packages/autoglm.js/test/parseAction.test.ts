import { expect, it } from 'vitest'
import { parseAction } from '@/actions/parse'

it('should parse do action', () => {
  const actionStr = 'do(action="Launch", app="微信")'
  const action = parseAction(actionStr)
  expect(action).toMatchInlineSnapshot(`
    {
      "_metadata": "do",
      "action": "Launch",
      "app": "微信",
    }
  `)
})

it('should parse do action simple type', () => {
  const actionStr = 'do(action="Type", text="你好呀")'
  const action = parseAction(actionStr)
  expect(action).toMatchInlineSnapshot(`
    {
      "_metadata": "do",
      "action": "Type",
      "text": "你好呀",
    }
  `)
})

it('should parse do action 一点也不 simple type', () => {
  const actionStr = `do(action="Type", text="旅行攻略：
- 滑雪场门票：约10元（摆渡车）
- 雪具租赁：雪服80元/人，护目镜30元/人，护具80元/人

**避雷建议：**
1. 景区内很多摆渡车都收费，需要注意
2. 雪景可能因为下雪而斑驳，需要找合适的拍照地点
3. 滑雪时间从拿雪具开始算，不是从进雪场开始
4. 景区天气变化较大，游客需要做好防雷准备")`
  const action = parseAction(actionStr)
  expect(action).toMatchInlineSnapshot(`
    {
      "_metadata": "do",
      "action": "Type",
      "text": "旅行攻略：
    - 滑雪场门票：约10元（摆渡车）
    - 雪具租赁：雪服80元/人，护目镜30元/人，护具80元/人

    **避雷建议：**
    1. 景区内很多摆渡车都收费，需要注意
    2. 雪景可能因为下雪而斑驳，需要找合适的拍照地点
    3. 滑雪时间从拿雪具开始算，不是从进雪场开始
    4. 景区天气变化较大，游客需要做好防雷准备",
    }
  `)
})

it('should parse finish action', () => {
  const actionStr = 'finish(message="任务完成")'
  const action = parseAction(actionStr)
  expect(action).toMatchInlineSnapshot(`
    {
      "_metadata": "finish",
      "message": "任务完成",
    }
  `)
})

it('有换行就会有问题', () => {
  const actionStr = `finish(message="任务完成
  1. 任务完成
  2. 任务完成")`
  const action = parseAction(actionStr)
  expect(action).toMatchInlineSnapshot(`
    {
      "_metadata": "finish",
      "message": "任务完成
      1. 任务完成
      2. 任务完成",
    }
  `)
})
