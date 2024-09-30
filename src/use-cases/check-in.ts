import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-cordenates';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckinsError } from './errors/max-number-of-check-ins-error';

interface CheckinUseCaseRequest {
    userId: string;
    gymId: string;
    userLatitude: number;
    userLogitude: number;
}

interface CheckinUseCaseResponse {
    checkIn: CheckIn;
}

export class CheckinUseCase {
    constructor(
        private checkinsRepository: CheckInsRepository,
        private gymsRepository: GymsRepository,
    ) { }

    async execute({
        gymId,
        userId,
        userLatitude,
        userLogitude,
    }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
        const gym = await this.gymsRepository.findById(gymId);

        if (!gym) {
            throw new ResourceNotFoundError();
        }

        // Calculate distance between user and gym
        const distance = getDistanceBetweenCoordinates(
            { latitude: userLatitude, longitude: userLogitude },
            {
                latitude: gym.latitude.toNumber(),
                longitude: gym.longitude.toNumber(),
            },
        );

        const MAX_DISTANCE_IN_KILOMETERS = 0.1;

        if (distance > MAX_DISTANCE_IN_KILOMETERS) {
            throw new MaxDistanceError();
        }

        const checkInOnSameDay =
            await this.checkinsRepository.findByUserIdOnDate(
                userId,
                new Date(),
            );

        if (checkInOnSameDay) {
            throw new MaxNumberOfCheckinsError();
        }

        const checkIn = await this.checkinsRepository.create({
            gym_id: gymId,
            user_id: userId,
        });

        return {
            checkIn,
        };
    }
}
