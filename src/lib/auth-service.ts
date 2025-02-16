import jwt, { SignOptions } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import db from '@/db';
import { User, users } from '@/db/schema';
import env from '@/env';

interface JWTPayload {
    userId: number;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

const { sign } = jwt;

export class AuthService {
    static async validateUser(email: string, password: string): Promise<User | null> {
        const user = await db.query.users.findFirst({
            where(fields, operators) {
                return operators.eq(fields.email, email);
            },
        });
        if (!user) return null;

        const isValidPassword = await compare(password, user.password);
        if (!isValidPassword) return null;

        return user;
    }

    static async createUser(email: string, password: string): Promise<User> {
        const [user] = await db.insert(users).values({
            email,
            password,
        }).returning();

        return user;
    }

    static generateToken(user: User): string {
        const payload: JWTPayload = {
            userId: user.id,
            email: user.email,
            role: user.role
        };

        return sign(payload, env.JWT_SECRET_KEY, {
            expiresIn: env.JWT_EXPIRES_IN,
            issuer: env.JWT_ISSUER,
        } as SignOptions);
    }
}