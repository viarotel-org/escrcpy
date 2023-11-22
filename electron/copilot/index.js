import { relative } from 'node:path'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import createWebSocketServer from './wss/index'

export default async (mainWindow) => {
  const app = new Hono()

  app.notFound((c) => {
    return c.text('Escrcpy copilot 404', 404)
  })

  const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

  if (VITE_DEV_SERVER_URL) {
    app.get('/', (ctx) => {
      console.log('ctx', ctx.get('wss'))
      return ctx.redirect(`${VITE_DEV_SERVER_URL}copilot/index.html`)
    })
  }
  else {
    app.use(
      '/*',
      serveStatic({
        root: relative('./', process.env.DIST),
        rewriteRequestPath: (path) => {
          return path.replace(/^\//, '/copilot')
        },
      }),
    )
    app.use(
      '/assets/*',
      serveStatic({
        root: relative('./', `${process.env.DIST}/assets/`),
        rewriteRequestPath: (path) => {
          console.log('path', path)
          return path.replace(/^\/assets/, '/')
        },
      }),
    )
  }

  createWebSocketServer()

  serve({ fetch: app.fetch, port: 1996 })
}
