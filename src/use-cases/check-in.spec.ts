import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckinUseCase } from './check-in';
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckinsError } from './errors/max-number-of-check-ins-error';
import { MaxDistanceError } from './errors/max-distance-error';

let checkInRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymRepository;
let sut: CheckinUseCase;

describe('Auth Use Case', () => {
    beforeEach(async () => {
        checkInRepository = new InMemoryCheckInsRepository();
        gymsRepository = new InMemoryGymRepository();
        sut = new CheckinUseCase(checkInRepository, gymsRepository);

        await gymsRepository.create({
            id: 'gym-01',
            title: 'Academia do Jhon Doe',
            description: 'Acxademia Muito grande',
            phone: '(19) 9999999',
            latitude: -22.7672064,
            longitude: -47.4054656,
        });

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be able to check in', async () => {
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -22.7672064,
            userLogitude: -47.4054656,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2024, 8, 18, 8, 0, 0));

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -22.7672064,
            userLogitude: -47.4054656,
        });

        await expect(() =>
            sut.execute({
                gymId: 'gym-01',
                userId: 'user-01',
                userLatitude: -22.7672064,
                userLogitude: -47.4054656,
            }),
        ).rejects.toBeInstanceOf(MaxNumberOfCheckinsError);
    });

    it('should not be able to check in twice in different days', async () => {
        vi.setSystemTime(new Date(2024, 8, 18, 8, 0, 0));

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -22.7672064,
            userLogitude: -47.4054656,
        });

        vi.setSystemTime(new Date(2024, 8, 21, 8, 0, 0));

        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -22.7672064,
            userLogitude: -47.4054656,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check in on distant gym', async () => {
        gymsRepository.items.push({
            id: 'gym-01',
            title: 'JavaScript Gym',
            latitude: new Decimal(-22.7590659),
            longitude: new Decimal(-47.4068607),
            phone: '',
            description: '',
        });

        await expect(() =>
            sut.execute({
                gymId: 'gym-01',
                userId: 'user-01',
                userLatitude: -27.7672064,
                userLogitude: -47.4054656,
            }),
        ).rejects.toBeInstanceOf(MaxDistanceError);
    });
});
