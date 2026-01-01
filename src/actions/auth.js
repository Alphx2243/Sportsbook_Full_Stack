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

export async function requestPasswordReset(email) {
    try {
        console.log("Request Password Reset function Line 124");
        const user = await prisma.user.findUnique({ where: { email } }); // fine
        console.log("Request Password Reset function Line 126");
        if (!user) {
            return { success: true, message: "If an account exists with this email, a reset link has been sent." };
        }

        const token = uuidv4();
        const expiry = new Date(Date.now() + 3600000); // 1 hour

        console.log("Request Password Reset function Line 134");
        await prisma.user.update({  // fine
            where: { id: user.id },
            data: {
                resetToken: token,
                resetTokenExpiry: expiry,
            },
        });
        console.log("Request Password Reset function Line 142");

        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

        console.log("Request Password Reset function Line 146");
        await sendResetEmail(email, resetLink);
        console.log("Request Password Reset function Line 148");

        return { success: true, message: "Reset link sent to your email." };
    } catch (error) {
        console.error("Request password reset error:", error);
        return { success: false, error: "Failed to process request." };
    }
}

export async function resetPassword(token, newPassword) {
    try {
        console.log("resetPassword Function Line 153");
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() },
            },
        });
        console.log("resetPassword Function Line 160");

        if (!user) {
            return { success: false, error: "Invalid or expired reset token." };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log("resetPassword Function Line 167");


        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        console.log("resetPassword Function Line 177");
        return { success: true, message: "Password updated successfully." };
    } catch (error) {
        console.error("Reset password error:", error);
        return { success: false, error: "Failed to reset password." };
    }
}

async function sendResetEmail(email, link) {
    const nodemailer = require('nodemailer');
    console.log("sendResetEmail Function Line 195");
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_PORT === '465',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.SMTP_FROM || '"SportsBook" <noreply@sportsbook.com>',
        to: email,
        subject: "Password Reset Request",
        html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #3b82f6;">Password Reset</h2>
        <p>Hello,</p>
        <p>You requested a password reset for your SportsBook account. Click the button below to reset it. This link will expire in 1 hour.</p>
        <div style="text-align: center; margin: 30px 0;">
        <a href="${link}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>Best regards,<br>The SportsBook Team</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">If the button doesn't work, copy and paste this link: <br> ${link}</p>
        </div>
        `,
    });
    console.log("sendResetEmail Function Line 207");
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
