import { FatchUserCheckInsHistoryUseCase } from '../fatech-user-check-ins-history';
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';

export function makeFetchUserCheckInsHistoryUsecase() {
    const checkInsRepository = new PrismaCheckInsRepository();
    const useCase = new FatchUserCheckInsHistoryUseCase(checkInsRepository);

    return useCase;
}
