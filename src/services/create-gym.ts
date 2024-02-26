import { GymsRepository } from '@/repositories/gyms-repository'
import type { Gym } from '@prisma/client'

interface createGymServiceRequest {
  title: string
  description: string | null
  latitude: number
  longitude: number
  phone: string | null
}

interface createGymServiceResponse {
  gym: Gym
}

export class CreateGymService {
  constructor(private gymsRepository: GymsRepository) {}

  async create({
    title,
    description,
    latitude,
    longitude,
    phone,
  }: createGymServiceRequest): Promise<createGymServiceResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      latitude,
      longitude,
      phone,
    })

    return { gym }
  }
}
