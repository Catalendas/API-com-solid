import { UserRepository } from '@/repositories/users-repository';
import bcryptjs from 'bcryptjs';
import { UserAlreadyExistisError } from './errors/user-alredy-exists-error';
import { User } from '@prisma/client';

interface RegisterUseCaseProps {
    name: string;
    email: string;
    password: string;
}

interface RegisterUseCaseResponse {
    user: User;
}

export class RegisterUseCase {
    constructor(private repository: UserRepository) {}

    async execute({
        password,
        email,
        name,
    }: RegisterUseCaseProps): Promise<RegisterUseCaseResponse> {
        const password_hash = await bcryptjs.hash(password, 6);

        const userWithSomeEmail = await this.repository.findByEmail(email);

        if (userWithSomeEmail) {
            throw new UserAlreadyExistisError();
        }

        const user = await this.repository.create({
            name,
            email,
            password_hash,
        });

        return {
            user,
        };
    }
}
