import { makeFetchUserCheckInsHistoryUsecase } from '@/use-cases/factories/make-fetch-user-check-ins-history-usecase';

import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function history(request: FastifyRequest, reply: FastifyReply) {
    const checkInHistoryQuerySchema = z.object({
        page: z.coerce.number().min(1).default(1),
    });

    const { page } = checkInHistoryQuerySchema.parse(request.query);

    const fetchUserCheckInsHistoryUseCase =
        makeFetchUserCheckInsHistoryUsecase();

    const { checkIn } = await fetchUserCheckInsHistoryUseCase.execute({
        page,
        userId: request.user.sub,
    });

    return reply.status(200).send({
        checkIn,
    });
}
