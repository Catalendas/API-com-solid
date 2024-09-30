import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FatchNearbyGymsUseCase } from './fatch-nearby-gyms';

let gymsRepository: InMemoryGymRepository;
let sut: FatchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymRepository();
        sut = new FatchNearbyGymsUseCase(gymsRepository);
    });

    it('should be able to fetch nearby gyms', async () => {
        await gymsRepository.create({
            title: 'Near Gym',
            description: null,
            phone: '(19) 9999999',
            latitude: -22.7672064,
            longitude: -47.4054656,
        });

        await gymsRepository.create({
            title: 'Far Gym',
            description: null,
            phone: '(19) 9999999',
            latitude: -23.0018407,
            longitude: -47.5106417,
        });

        const { gyms } = await sut.execute({
            userLatitude: -22.7672064,
            userLongitude: -47.4054656,
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })]);
    });
});
