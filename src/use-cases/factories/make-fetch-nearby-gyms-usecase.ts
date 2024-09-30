import { FatchNearbyGymsUseCase } from '../fatch-nearby-gyms';
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';

export function makeFetchNearbyGymsUsecase() {
    const gymsRepository = new PrismaGymsRepository();
    const useCase = new FatchNearbyGymsUseCase(gymsRepository);

    return useCase;
}
