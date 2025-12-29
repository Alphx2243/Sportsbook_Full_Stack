'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createApplication(data) {
    try {
        const application = await prisma.guideApplication.create({
            data: {
                email: data.email, option: data.option,
                sportName: data.sportname, level: data.level,
                resolved: data.resolved ?? false, time: data.time,
                description: data.description,
                avDays: Array.isArray(data.avdays) ? data.avdays.join(',') : data.avdays,
            },
        })
        revalidatePath('/')
        return application
    }
    catch (error) {
        console.error('Create application error:', error); return false
    }
}

export async function getApplications() {
    try {
        const applications = await prisma.guideApplication.findMany({
            where: { resolved: false },
            orderBy: { createdAt: 'desc' },
        })
        return applications
    } catch (error) {
        console.error('Get applications error:', error)
        return []
    }
}

export async function deleteApplication(id) {
    try {
        await prisma.guideApplication.delete({
            where: { id },
        })
        revalidatePath('/')
        return true
    } catch (error) {
        console.error('Delete application error:', error)
        return false
    }
}

