import { InvalidCredentialsError } from '@/errors/invalid-credentials-errors'
import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { BcryptAdapter } from 'infra/bcrypt-adapter'

interface AuthenticateServiceRequest {
  email: string
  password: string
}

interface AuthenticateServiceResponse {
  user: User
}

export class AuthenticateService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const bcrypt = new BcryptAdapter()

    const doesPasswordMatches = await bcrypt.compare(
      password,
      user.password_hash,
    )

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }
    return { user }
  }
}
