import { Gym, Prisma } from '@prisma/client';

export interface FindManyNearByPrams {
    latitude: number;
    longitude: number;
}

export interface GymsRepository {
    create(data: Prisma.GymCreateInput): Promise<Gym>;
    searchMany(query: string, page: number): Promise<Gym[]>;
    findById(gymId: string): Promise<Gym | null>;
    findManyNearBy(data: FindManyNearByPrams): Promise<Gym[]>;
}
