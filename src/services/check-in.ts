import { MaxNumberOfCheckInsError } from '@/errors/max-number-of-checkins'
import { GymsRepository } from './../repositories/gyms-repository'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'
import { getDistanceBetweenCoordinates } from 'infra/get-distance-between.coordinates'
import { MaxDistanceError } from '@/errors/max-distance-error'

interface CheckInServiceRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInServiceResponse {
  checkIn: CheckIn
}

export class CheckInService {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private GymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const gym = await this.GymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KM = 0.1
    if (distance > MAX_DISTANCE_IN_KM) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )
    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError()
    }

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }
    return { checkIn }
  }
}
