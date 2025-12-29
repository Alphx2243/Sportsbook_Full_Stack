'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecretkey123')

export async function createAccount({ email, password, name, phone, rollNumber, sportsExperience, qrCodePath }) {
    try {
        const existingUser = await prisma.user.findUnique({ where: { email }, })

        if (existingUser) {
            throw new Error('User with this email already exists.')
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email, password: hashedPassword, name,
                phone, rollNumber,
                sportsExperience: sportsExperience || [], qrCodePath,
            },
        })
        await createSession(user)
        return { success: true, user }
    }
    catch (error) {
        console.error('Registration error:', error)
        return { success: false, error: error.message }
    }
}

export async function login({ email, password }) {
    try {
        const user = await prisma.user.findUnique({ where: { email }, })
        if (!user) {
            throw new Error('Invalid email or password.')
        }
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            throw new Error('Invalid email or password.')
        }
        await createSession(user)
        return { success: true, user }
    }
    catch (error) {
        console.error('Login error:', error)
        return { success: false, error: error.message }
    }
}

export async function updateUser(userId, data) {
    try {
        const { name, phone, rollNumber, sportsExperience } = data;
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name, phone,
                rollNumber, sportsExperience
            }
        });
        return user;
    }
    catch (error) {
        console.error("Update user error:", error);
        throw new Error("Failed to update user");
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
    return { success: true }
}

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies()
        const session = cookieStore.get('session')

        if (!session) return null
        const { payload } = await jwtVerify(session.value, SECRET_KEY)
        if (!payload || !payload.userId) return null
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true, email: true,
                name: true, phone: true,
                rollNumber: true, sportsExperience: true,
                qrCodePath: true,
            }
        })
        return user
    }
    catch (error) {
        return null
    }
}

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true, email: true,
                name: true, phone: true,
                rollNumber: true, sportsExperience: true,
                qrCodePath: true,
            }
        });
        return { documents: users, total: users.length };
    }
    catch (error) {
        console.error("Get users error:", error);
        return { documents: [], total: 0 };
    }
}

async function createSession(user) {
    const token = await new SignJWT({ userId: user.id, email: user.email })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d').sign(SECRET_KEY)
    const cookieStore = await cookies()
    cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    })
}
