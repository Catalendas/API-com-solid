import { prisma } from '@/lib/prisma';
import { Gym, Prisma } from '@prisma/client';
import { FindManyNearByPrams, GymsRepository } from '../gyms-repository';

export class PrismaGymsRepository implements GymsRepository {
    async create(data: Prisma.GymCreateInput) {
        const gym = await prisma.gym.create({
            data,
        });

        return gym;
    }

    async findById(gymId: string) {
        const user = await prisma.gym.findUnique({
            where: {
                id: gymId,
            },
        });

        return user;
    }

    async findManyNearBy({ latitude, longitude }: FindManyNearByPrams) {
        const gyms = await prisma.$queryRaw<Gym[]>`
            SELECT * from "Gyms"
            WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( "latitude" ) ) * cos( radians( "longitude" ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( "latitude" ) ) ) ) <= 10
        `;

        return gyms;
    }

    async searchMany(query: string, page: number) {
        const gyms = await prisma.gym.findMany({
            where: {
                title: {
                    contains: query,
                },
            },
            take: 20,
            skip: (page - 1) * 20,
        });

        return gyms;
    }
}
