import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
prisma.user.create({
  data: {
    name: 'Marcelo',
    email: 'mlbaraldi@hotmail.com',
  },
})
export const app = fastify()
