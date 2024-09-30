import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/check-ins-repository';

interface FatchUserCheckInsHistoryUseCaseRequest {
    userId: string;
    page: number;
}

interface FatchUserCheckInsHistoryUseCaseResponse {
    checkIn: CheckIn[];
}

export class FatchUserCheckInsHistoryUseCase {
    constructor(private checkinsRepository: CheckInsRepository) { }

    async execute({
        userId,
        page,
    }: FatchUserCheckInsHistoryUseCaseRequest): Promise<FatchUserCheckInsHistoryUseCaseResponse> {
        const checkIn = await this.checkinsRepository.findManyByUserId(
            userId,
            page,
        );

        return {
            checkIn,
        };
    }
}
