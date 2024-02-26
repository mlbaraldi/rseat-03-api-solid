import { expect, test, describe, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate'
import { BcryptAdapter } from 'infra/bcrypt-adapter'
import { InvalidCredentialsError } from '@/errors/invalid-credentials-errors'

describe('Authenticate Services', () => {
  const bcrypt = new BcryptAdapter()
  let usersRepository: InMemoryUsersRepository
  let sut: AuthenticateService
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateService(usersRepository)
  })

  test('it shoud be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johnDoe@example.com',
      password_hash: await bcrypt.encrypt('123456'),
    })

    const { user } = await sut.execute({
      email: 'johnDoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  test('it shoud not be able to authenticate with incorrect email', async () => {
    expect(
      async () =>
        await sut.execute({
          email: 'johnDoe@example.com',
          password: '123456',
        }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  test('it shoud not be able to authenticate with incorrect password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johnDoe@example.com',
      password_hash: await bcrypt.encrypt('123456'),
    })
    await expect(
      async () =>
        await sut.execute({
          email: 'johnDoe@example.com',
          password: 'wrongpassword',
        }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
