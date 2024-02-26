import { expect, test, describe, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/in-memory/in-memory-users-repository'
import { BcryptAdapter } from 'infra/bcrypt-adapter'
import { GetUserProfileService } from './get-user-profile'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'

describe('Get user Profile Service', () => {
  const bcrypt = new BcryptAdapter()
  let usersRepository: InMemoryUsersRepository
  let sut: GetUserProfileService
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileService(usersRepository)
  })

  test('it shoud be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johnDoe@example.com',
      password_hash: await bcrypt.encrypt('123456'),
    })

    const { user } = await sut.execute({
      id: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John Doe')
  })

  test('it shoud not be able get profile with wrong ID', async () => {
    await expect(
      async () =>
        await sut.execute({
          id: 'wrongID1234',
        }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
