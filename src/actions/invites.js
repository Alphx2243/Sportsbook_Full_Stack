'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createInvite(data) {
    try {
        const invite = await prisma.invite.create({
            data: {
                sport: data.sport, venue: data.venue,
                date: data.date, time: data.time,
                email: data.email, name: data.name,
                mobileNumber: data.mobilenumber, show: data.show ?? true,
            },
        })
        revalidatePath('/')
        return invite
    }
    catch (error) {
        console.error('Create invite error:', error)
        return false
    }
}

export async function getInvites() {
    try {
        const invites = await prisma.invite.findMany({ where: { show: true }, orderBy: { createdAt: 'desc' }, })
        return invites
    }
    catch (error) {
        console.error('Get invites error:', error)
        return []
    }
}

export async function editInvite(id) {
    try {
        const invite = await prisma.invite.update({ where: { id }, data: { show: false }, })
        revalidatePath('/')
        return invite
    }
    catch (error) {
        console.error('Edit invite error:', error)
        return false
    }
}

export async function deleteInvite(id) {
    try {
        await prisma.invite.delete({ where: { id }, })
        revalidatePath('/')
        return true
    }
    catch (error) {
        console.error('Delete invite error:', error); return false
    }
}
