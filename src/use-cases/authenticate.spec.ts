import { beforeEach, describe, expect, it } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepository: InMemoryUserRepository;
let sut: AuthenticateUseCase;

describe('Auth Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUserRepository();
        sut = new AuthenticateUseCase(usersRepository);
    });

    it('should be able to authenticate', async () => {
        await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password_hash: await hash('123456', 6),
        });

        const { user } = await sut.execute({
            email: 'johndoe@email.com',
            password: '123456',
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it('should not be able to authenticate with wrong email', async () => {
        expect(() =>
            sut.execute({
                email: 'johndoe@email.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it('should not be able to authenticate with wrong password', async () => {
        await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password_hash: await hash('123456', 6),
        });

        expect(() =>
            sut.execute({
                email: 'johndoe@email.com',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});
