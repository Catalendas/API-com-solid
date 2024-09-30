import fastify from 'fastify';
import { userRoutes } from './http/controllers/users/routes';
import { gymsRoutes } from './http/controllers/gyms/routes';
import { ZodError } from 'zod';
import { env } from './env';
import fastifyJwt from '@fastify/jwt';
import { checkInsRoutes } from './http/controllers/check-ins/routes';
import fastifyCookie from '@fastify/cookie';

export const app = fastify();

app.register(fastifyJwt, {
    cookie: {
        cookieName: 'refreshToken',
        signed: false,
    },
    secret: env.JWT_SECRET,
    sign: {
        expiresIn: '10m',
    },
});

app.register(fastifyCookie);

app.register(userRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({
            messag: 'Validation Error',
            issues: error.format(),
        });
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error);
    } else {
        // TODO Here we should log to on external tool like DataDog/NewRelic/Sentry
    }

    return reply.status(500).send({ message: 'Internal server error.' });
});
