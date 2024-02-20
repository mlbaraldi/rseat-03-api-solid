import { UsersRepository } from '@/protocols/users-repository'
import { BcryptAdapter } from 'infra/bcrypt-adapter'
import { UserAlreadyExistsError } from '@/errors/user-already-existsError'
import type { User } from '@prisma/client'
interface RegisterServiceRequest {
  name: string
  email: string
  password: string
}

interface RegisterServiceResponse {
  id: string
  user: User
}

export class RegisterService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private usersRepository: UsersRepository) {}

  async handle({
    name,
    email,
    password,
  }: RegisterServiceRequest): Promise<RegisterServiceResponse> {
    const bcrypt = new BcryptAdapter()
    const password_hash = await bcrypt.encrypt(password)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}
