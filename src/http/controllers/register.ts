import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { RegisterService } from '@/services/register'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsError } from '@/errors/user-already-existsError'

export async function register(req: FastifyRequest, res: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(req.body)

  try {
    const userRepository = new PrismaUsersRepository()
    const registerService = new RegisterService(userRepository)
    await registerService.handle({ name, email, password })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return res.status(409).send({ message: error.message })
    }
    return error
  }

  return res.status(201).send()
}
