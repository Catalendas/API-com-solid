import { makeCheckInUsecase } from '@/use-cases/factories/make-check-in-usecase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const createCheckInParamsSchema = z.object({
        gymId: z.string().uuid(),
    });

    const createCheckInBodySchema = z.object({
        latitude: z.number().refine((value) => {
            return Math.abs(value) <= 90;
        }),
        longitude: z.number().refine((value) => {
            return Math.abs(value) <= 180;
        }),
    });

    const { latitude, longitude } = createCheckInBodySchema.parse(request.body);

    const { gymId } = createCheckInParamsSchema.parse(request.params);

    const checkInUsecase = makeCheckInUsecase();

    await checkInUsecase.execute({
        userLatitude: latitude,
        userLogitude: longitude,
        gymId,
        userId: request.user.sub,
    });

    return reply.status(201).send();
}
