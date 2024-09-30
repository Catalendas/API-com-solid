import { Gym } from '@prisma/client';
import { GymsRepository } from '@/repositories/gyms-repository';

interface FatchNearbyGymsUseCaseRequest {
    userLatitude: number;
    userLongitude: number;
}

interface FatchNearbyGymsUseCaseResponse {
    gyms: Gym[];
}

export class FatchNearbyGymsUseCase {
    constructor(private gymsRepository: GymsRepository) { }

    async execute({
        userLatitude,
        userLongitude,
    }: FatchNearbyGymsUseCaseRequest): Promise<FatchNearbyGymsUseCaseResponse> {
        const gyms = await this.gymsRepository.findManyNearBy({
            latitude: userLatitude,
            longitude: userLongitude,
        });

        return {
            gyms,
        };
    }
}
