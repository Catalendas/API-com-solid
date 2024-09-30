import { makeValidateCheckinUsecase } from '@/use-cases/factories/make-validate-check-in-usecase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function validate(request: FastifyRequest, reply: FastifyReply) {
    const validateCheckInParamsSchema = z.object({
        checkInId: z.string().uuid(),
    });

    const { checkInId } = validateCheckInParamsSchema.parse(request.params);

    const checkInUsecase = makeValidateCheckinUsecase();

    await checkInUsecase.execute({
        checkInId,
    });

    return reply.status(204).send();
}
