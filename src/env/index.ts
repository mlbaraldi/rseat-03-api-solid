import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
})

const envData = envSchema.safeParse(process.env)

if (!envData.success) {
  console.error('🧨Invalid env variables', envData.error.format())
  throw new Error('Invalid env variables')
}

export const env = envData.data
