import { expect, test, describe, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/in-memory/in-memory-check-ins-repository'
import { CheckInService } from './check-in'

describe('CheckIns Service', () => {
  let sut: CheckInService
  let checkInsRepository: InMemoryCheckInsRepository

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInService(checkInsRepository)
  })
  test('it shoud be able to checkIn', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'Gym01',
      userId: 'User01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
