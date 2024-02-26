import { expect, test, describe, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/in-memory/in-memory-check-ins-repository'
import { CheckInService } from './check-in'
import { InMemoryGymsRepository } from '@/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from '@/errors/max-number-of-checkins'
import { MaxDistanceError } from '@/errors/max-distance-error'

describe('CheckIns Service', () => {
  let sut: CheckInService
  let checkInsRepository: InMemoryCheckInsRepository
  let gymsRepository: InMemoryGymsRepository

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInService(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'TSAcademy',
      description: 'testcase',
      latitude: -23.4400053,
      longitude: -51.8978392,
      phone: '',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('it shoud be able to checkIn', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'User01',
      userLatitude: -23.4400053,
      userLongitude: -51.8978392,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  test('it shoud not be able to checkIn twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'User01',
      userLatitude: -23.4400053,
      userLongitude: -51.8978392,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'User01',
        userLatitude: -23.4400053,
        userLongitude: -51.8978392,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  test('it shoud  be able to checkIn twice in different day', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'User01',
      userLatitude: -23.4400053,
      userLongitude: -51.8978392,
    })

    vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'User01',
      userLatitude: -23.4400053,
      userLongitude: -51.8978392,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  test('it shoud not be able to checkIn on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'TSAcademy 2',
      description: 'testcase 2',
      latitude: new Decimal(-23.4381952),
      longitude: new Decimal(-51.9592282),
      phone: '',
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'User01',
        userLatitude: -23.4400053,
        userLongitude: -51.8978392,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
