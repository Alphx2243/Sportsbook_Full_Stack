'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { triggerSocketUpdate } from '@/lib/socket-trigger'

export async function createSport(data) {
    try {
        const sport = await prisma.sport.create({
            data: {
                name: data.name, numberOfCourts: parseInt(data.courts),
                totalEquipments: data.totalEquipments || [],
                equipmentsInUse: data.eqinuse || [], courtsInUse: parseInt(data.crtinuse || 0),
                numPlayers: parseInt(data.numplayers || 0), courtData: data.CourtData,
            },
        })
        revalidatePath('/')
        await triggerSocketUpdate()
        return sport
    }
    catch (error) {
        console.error('Create sport error:', error); return false
    }
}

export async function updateSport(id, data) {
    try {
        const sport = await prisma.sport.update({
            where: { id },
            data: {
                name: data.name, numberOfCourts: data.courts ? parseInt(data.courts) : undefined,
                totalEquipments: data.totalEquipments, equipmentsInUse: data.eqinuse,
                courtsInUse: data.crtinuse ? parseInt(data.crtinuse) : undefined,
                numPlayers: data.numplayers !== undefined ? parseInt(data.numplayers) : undefined,
                courtData: data.CourtData,
            },
        })
        revalidatePath('/')
        await triggerSocketUpdate()
        return sport
    }
    catch (error) {
        console.error('Update sport error:', error); return false
    }
}
export async function deleteSport(id) {
    try {
        await prisma.sport.delete({ where: { id }, })
        revalidatePath('/')
        await triggerSocketUpdate()
        return true
    }
    catch (error) {
        console.error('Delete sport error:', error); return false
    }
}
export async function getSport(id) {
    try {
        const sport = await prisma.sport.findUnique({ where: { id }, })
        return sport
    }
    catch (error) {
        console.error('Get sport error:', error); return false
    }
}

export async function getSports() {
    try {
        const sports = await prisma.sport.findMany({ orderBy: { name: 'asc' }, })
        return { documents: sports, total: sports.length }
    }
    catch (error) {
        console.error('Get sports error:', error); return { documents: [], total: 0 }
    }
}
