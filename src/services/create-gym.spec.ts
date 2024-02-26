import { expect, test, describe, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/in-memory/in-memory-gyms-repository'
import { CreateGymService } from './create-gym'

describe('Create Gym Services', () => {
  let sut: CreateGymService
  let gymRepository: InMemoryGymsRepository

  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository()
    sut = new CreateGymService(gymRepository)
  })
  test('it shoud be able to create gym', async () => {
    const { gym } = await sut.create({
      title: 'gym01',
      description: null,
      phone: null,
      latitude: 12.123123,
      longitude: -23.123123,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
