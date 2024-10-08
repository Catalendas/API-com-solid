import { Gym } from '@prisma/client';
import { GymsRepository } from '@/repositories/gyms-repository';

interface CreateGymUseCaseProps {
    title: string;
    description: string | null;
    phone: string | null;
    latitude: number;
    longitude: number;
}

interface CreateGymUseCaseResponse {
    gym: Gym;
}

export class CreateGymUseCase {
    constructor(private repository: GymsRepository) { }

    async execute({
        title,
        description,
        phone,
        latitude,
        longitude,
    }: CreateGymUseCaseProps): Promise<CreateGymUseCaseResponse> {
        const gym = await this.repository.create({
            title,
            description,
            phone,
            latitude,
            longitude,
        });

        return {
            gym,
        };
    }
}
