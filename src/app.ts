import fastify from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

app.register(appRoutes)
app.setErrorHandler((err, _req, res) => {
  if (err instanceof ZodError) {
    return res
      .status(400)
      .send({ message: 'Validation Error', issues: err.format() })
  }

  if (env.NODE_ENV === 'dev') {
    console.error(err)
  }

  if (env.NODE_ENV === 'production') {
    // todo
  }

  return res.status(500).send({ message: 'Internal Server Error.' })
})
