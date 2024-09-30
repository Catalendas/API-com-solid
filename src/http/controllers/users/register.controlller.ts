import { UserAlreadyExistisError } from '@/use-cases/errors/user-alredy-exists-error';
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-usecase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { name, email, password } = registerBodySchema.parse(request.body);

    try {
        const registerUsecase = makeRegisterUseCase();

        await registerUsecase.execute({ name, email, password });
    } catch (error) {
        if (error instanceof UserAlreadyExistisError) {
            return reply.status(409).send({
                message: error.message,
            });
        }

        throw error;
    }

    return reply.status(201).send();
}
