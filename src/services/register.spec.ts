import { expect, test, describe } from 'vitest'
import { BcryptAdapter } from 'infra/bcrypt-adapter'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '@/errors/user-already-existsError'

describe('Register Services', () => {
  test('it shoud should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const { user } = await registerService.handle({
      email: 'johnDoe@example.com',
      name: 'John Doe',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  test('shoud not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)
    const email = 'johnDoe@example.com'

    await registerService.handle({
      email,
      name: 'John Doe',
      password: '123456',
    })

    await expect(() =>
      registerService.handle({
        email,
        name: 'John Doe',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
  test('it should has user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)
    const password = '123456'

    const { user } = await registerService.handle({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password,
    })

    const isHashed = await compare(password, user.password_hash)
    expect(isHashed).toBe(true)
  })
  test('it shoud hash user password upon registration', async () => {
    const bcryptAdapter = new BcryptAdapter()
    const senha = '1234567'
    const hashSenha = await bcryptAdapter.encrypt(senha)
    const isHashed = await compare(senha, hashSenha)

    expect(isHashed).toBe(true)
  })
})
