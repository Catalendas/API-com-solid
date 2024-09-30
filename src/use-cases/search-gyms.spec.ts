import { beforeEach, describe, expect, it } from 'vitest';
import { SearchGymsUseCase } from './search-gyms';
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let gymsRepository: InMemoryGymRepository;
let sut: SearchGymsUseCase;

describe('Fetch User Check-in History Use Case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymRepository();
        sut = new SearchGymsUseCase(gymsRepository);
    });

    it('should be able to search for gyms', async () => {
        await gymsRepository.create({
            title: 'JavaScript Gym',
            description: null,
            phone: '(19) 9999999',
            latitude: -22.7672064,
            longitude: -47.4054656,
        });

        await gymsRepository.create({
            title: 'TypeScript Gym',
            description: null,
            phone: '(19) 9999999',
            latitude: -22.7672064,
            longitude: -47.4054656,
        });

        const { gyms } = await sut.execute({
            query: 'JavaScript',
            page: 1,
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym' }),
        ]);
    });

    it('should be able to fetch paginated gyms search', async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `JavaScript Gym ${i}`,
                description: null,
                phone: '(19) 9999999',
                latitude: -22.7672064,
                longitude: -47.4054656,
            });
        }

        const { gyms } = await sut.execute({
            query: 'JavaScript',
            page: 2,
        });

        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym 21' }),
            expect.objectContaining({ title: 'JavaScript Gym 22' }),
        ]);
    });
});
