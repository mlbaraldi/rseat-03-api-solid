import { expect, test, describe, beforeEach } from 'vitest'
import { BcryptAdapter } from 'infra/bcrypt-adapter'
import { RegisterService } from './register'
import { InMemoryUsersRepository } from '@/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '@/errors/user-already-exists-error'

describe('Register Services', () => {
  const bcrypt = new BcryptAdapter()
  let sut: RegisterService
  let usersRepository: InMemoryUsersRepository

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterService(usersRepository)
  })
  test('it shoud should be able to register', async () => {
    const { user } = await sut.handle({
      email: 'johnDoe@example.com',
      name: 'John Doe',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  test('shoud not be able to register with same email twice', async () => {
    const email = 'johnDoe@example.com'
    await sut.handle({
      email,
      name: 'John Doe',
      password: '123456',
    })

    await expect(() =>
      sut.handle({
        email,
        name: 'John Doe',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
  test('it should has user password upon registration', async () => {
    const password = '123456'

    const { user } = await sut.handle({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password,
    })

    const isHashed = await bcrypt.compare(password, user.password_hash)
    expect(isHashed).toBe(true)
  })
  test('it shoud hash user password upon registration', async () => {
    const bcryptAdapter = new BcryptAdapter()
    const senha = '1234567'
    const hashSenha = await bcryptAdapter.encrypt(senha)
    const isHashed = await bcrypt.compare(senha, hashSenha)

    expect(isHashed).toBe(true)
  })
})
