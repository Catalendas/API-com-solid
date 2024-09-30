import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

let usersRepository: InMemoryGymRepository;
let sut: CreateGymUseCase;

describe('Create Gym Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryGymRepository();
        sut = new CreateGymUseCase(usersRepository);
    });

    it('should be able to create gym', async () => {
        const { gym } = await sut.execute({
            title: 'Academia do Jhon Doe',
            description: 'Academia Muito grande',
            phone: '(19) 9999999',
            latitude: -22.7672064,
            longitude: -47.4054656,
        });

        expect(gym.id).toEqual(expect.any(String));
    });
});
