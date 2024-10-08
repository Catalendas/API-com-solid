import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { FatchUserCheckInsHistoryUseCase } from './fatech-user-check-ins-history';

let checkInRepository: InMemoryCheckInsRepository;
let sut: FatchUserCheckInsHistoryUseCase;

describe('Fetch User Check-in History Use Case', () => {
    beforeEach(async () => {
        checkInRepository = new InMemoryCheckInsRepository();
        sut = new FatchUserCheckInsHistoryUseCase(checkInRepository);
    });

    it('should be able to fetch check-in history', async () => {
        await checkInRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        });

        await checkInRepository.create({
            gym_id: 'gym-02',
            user_id: 'user-01',
        });

        const { checkIn } = await sut.execute({
            userId: 'user-01',
            page: 1,
        });

        expect(checkIn).toHaveLength(2);
        expect(checkIn).toEqual([
            expect.objectContaining({ gym_id: 'gym-01' }),
            expect.objectContaining({ gym_id: 'gym-02' }),
        ]);
    });

    it('should be able to fetch paginated check-in history', async () => {
        for (let i = 1; i <= 22; i++) {
            await checkInRepository.create({
                gym_id: `gym-${i}`,
                user_id: 'user-01',
            });
        }

        const { checkIn } = await sut.execute({
            userId: 'user-01',
            page: 2,
        });

        expect(checkIn).toHaveLength(2);
        expect(checkIn).toEqual([
            expect.objectContaining({ gym_id: 'gym-21' }),
            expect.objectContaining({ gym_id: 'gym-22' }),
        ]);
    });
});
