'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
export async function createMatch(data) {
    try {
        const match = await prisma.match.create({
            data: {
                sportName: data.sportName, team1: data.team1,
                team2: data.team2, score1: data.score1,
                score2: data.score2, status: data.status,
            },
        })
        revalidatePath('/live-scores')
        return { success: true, match }
    }
    catch (error) {
        console.error('Create match error:', error)
        return { success: false, error: 'Failed to create match' }
    }
}

export async function getMatches(filters = {}) {
    try {
        const where = {}
        if (filters.status) where.status = filters.status
        if (filters.sportName) where.sportName = filters.sportName

        const matches = await prisma.match.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        })
        return { success: true, documents: matches, total: matches.length }
    }
    catch (error) {
        console.error('Get matches error:', error)
        return { success: false, documents: [], total: 0 }
    }
}

export async function updateMatch(id, data) {
    try {
        const match = await prisma.match.update({
            where: { id },
            data: {
                score1: data.score1, score2: data.score2,
                status: data.status,
            },
        })
        revalidatePath('/live-scores')
        return { success: true, match }
    }
    catch (error) {
        console.error('Update match error:', error)
        return { success: false, error: 'Failed to update match' }
    }
}

export async function deleteMatch(id) {
    try {
        await prisma.match.delete({ where: { id }, })
        revalidatePath('/live-scores')
        return { success: true }
    }
    catch (error) {
        console.error('Delete match error:', error)
        return { success: false, error: 'Failed to delete match' }
    }
}
