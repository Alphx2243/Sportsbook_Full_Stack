'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { triggerSocketUpdate } from '@/lib/socket-trigger'

export async function createBooking(data) {
    try {
        const existingBooking = await prisma.booking.findFirst({
            where: {
                userId: data.userId,
                status: 'active'
            }
        })

        if (existingBooking) {
            return { success: false, error: 'You already have an active booking. Please return items from your previous booking first.' }
        }

        const booking = await prisma.booking.create({
            data: {
                userId: data.userId, sportName: data.sportName,
                issuedEquipments: data.equipmentsIssued || [],
                numberOfPlayers: parseInt(data.numberOfPlayers || 0),
                startTime: data.startTime, endTime: data.endTime,
                date: data.date, qrDetail: data.qrdetail,
                status: data.status, endDate: data.enddate,
                courtNo: data.CourtNo,
            },
        })
        revalidatePath('/')
        await triggerSocketUpdate()
        return { success: true, booking }
    }
    catch (error) {
        console.error('Create booking error:', error)
        return { success: false, error: 'Failed to create booking' }
    }
}

export async function updateBooking(id, data) {
    try {
        const booking = await prisma.booking.update({
            where: { id },
            data: {
                userId: data.userId, sportName: data.sportName,
                issuedEquipments: data.equipmentsIssued,
                numberOfPlayers: data.numberOfPlayers ? parseInt(data.numberOfPlayers) : undefined,
                startTime: data.startTime, endTime: data.endTime,
                scanned: data.scanned, qrDetail: data.qrdetail,
                status: data.status, endDate: data.enddate,
                courtNo: data.CourtNo,
            },
        })
        revalidatePath('/')
        await triggerSocketUpdate()
        return booking
    }
    catch (error) {
        console.error('Update booking error:', error)
        return false
    }
}

export async function deleteBooking(id) {
    try {
        await prisma.booking.delete({ where: { id }, })
        revalidatePath('/')
        await triggerSocketUpdate()
        return true
    }
    catch (error) {
        console.error('Delete booking error:', error)
        return false
    }
}

export async function getBooking(id) {
    try {
        const booking = await prisma.booking.findUnique({ where: { id }, })
        return booking
    }
    catch (error) {
        console.error('Get booking error:', error)
        return false
    }
}

export async function getBookings(filters = {}) {
    try {
        const where = {}
        if (filters.userId) where.userId = filters.userId
        if (filters.status) where.status = filters.status
        if (filters.date) where.date = filters.date
        if (filters.timeRange) {
            where.startTime = { lte: filters.timeRange }
            where.endTime = { gt: filters.timeRange }
        }
        const bookings = await prisma.booking.findMany({
            where, orderBy: { createdAt: 'desc' }, include: { user: true }
        })
        return { documents: bookings, total: bookings.length }
    }
    catch (error) {
        console.error('Get bookings error:', error)
        return { documents: [], total: 0 }
    }
}

export async function extendBooking(bookingId, extensionMinutes) {
    try {
        const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
        if (!booking) return { success: false, error: 'Booking not found' }
        const originalStartDate = new Date(`${booking.date}T${booking.startTime}`)
        const currentEndDate = new Date(`${booking.endDate || booking.date}T${booking.endTime}`)
        const newEndDate = new Date(currentEndDate.getTime() + extensionMinutes * 60000)
        const totalDurationMs = newEndDate.getTime() - originalStartDate.getTime()
        const totalDurationMinutes = totalDurationMs / (1000 * 60)

        if (totalDurationMinutes > 240) {
            return { success: false, error: 'Total booking duration cannot exceed 4 hours' }
        }

        const newEndTime = newEndDate.toTimeString().split(' ')[0] // HH:mm:ss
        const newEndDateStr = newEndDate.toISOString().split('T')[0] // YYYY-MM-DD

        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                endTime: newEndTime, endDate: newEndDateStr
            }
        })
        revalidatePath('/')
        await triggerSocketUpdate()
        return { success: true, booking: updatedBooking }
    }
    catch (error) {
        console.error('Extend booking error:', error)
        return { success: false, error: 'Failed to extend booking' }
    }
}

export async function expireBooking(bookingId) {
    try {
        const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
        if (!booking || booking.status !== 'active') {
            return { success: false, error: 'Booking not found or already inactive' }
        }
        const sport = await prisma.sport.findFirst({ where: { name: booking.sportName } })

        if (!sport) {
            return { success: false, error: 'Associated Sport not found' }
        }
        await prisma.booking.update({
            where: { id: bookingId }, data: { status: 'expired' }
        })
        const courtNo = booking.courtNo
        let newCourtData = sport.courtData || []
        newCourtData = newCourtData.map((item, i) => {
            const targetIndex = parseInt(courtNo) - 1
            if (i === targetIndex) {
                const name = item.split(':')[0]
                return `${name}:0`
            }
            return item
        })
        const issuedEq = booking.issuedEquipments || []
        let newEqInUse = sport.equipmentsInUse || []
        newEqInUse = [...newEqInUse]
        issuedEq.forEach(issued => {
            const [name, count] = issued.split(':')
            const issuedCount = parseInt(count)
            newEqInUse = newEqInUse.map(eq => {
                const [eqName, eqCount] = eq.split(':')
                if (eqName === name) {
                    const currentVal = parseInt(eqCount)
                    return `${eqName}:${Math.max(0, currentVal - issuedCount)}`
                }
                return eq
            })
        })
        await prisma.sport.update({
            where: { id: sport.id },
            data: {
                courtsInUse: Math.max(0, (sport.courtsInUse || 0) - 1),
                numPlayers: Math.max(0, (sport.numPlayers || 0) - (booking.numberOfPlayers || 0)),
                courtData: newCourtData, equipmentsInUse: newEqInUse
            }
        })
        revalidatePath('/')
        revalidatePath('/dashboard')
        revalidatePath('/book-court')
        await triggerSocketUpdate()
        return { success: true }
    }
    catch (error) {
        console.error('Expire booking error:', error)
        return { success: false, error: 'Failed to expire booking' }
    }
}

export async function secureBooking(data) {
    try {
        const result = await prisma.$transaction(async (tx) => {
            const existingBooking = await tx.booking.findFirst({
                where: { userId: data.userId, status: 'active' }
            })
            if (existingBooking) {
                throw new Error('You already have an active booking. Please return items from your previous booking first.')
            }
            const sport = await tx.sport.findFirst({ where: { name: data.sportName } })
            if (!sport) {
                throw new Error('Sport not found.')
            }
            const isCapacityBased = sport.maxCapacity && sport.maxCapacity > 0
            const alreadyBookedPlayers = sport.numPlayers || 0
            const numPlayers = parseInt(data.numberOfPlayers || 0)
            const courtNo = data.CourtNo
            if (isCapacityBased) {
                if (alreadyBookedPlayers + numPlayers > sport.maxCapacity) {
                    throw new Error('Facility is full!')
                }
            }
            else {
                const cData = sport.courtData || []
                const courtIndex = parseInt(courtNo) - 1
                if (cData[courtIndex] && cData[courtIndex].split(':')[1] === '1') {
                    throw new Error('Court already booked!')
                }

                const currentCData = cData.length ? cData : Array.from({ length: sport.numberOfCourts }, (_, i) => `Court${i + 1}:0`)
                const newCourtData = currentCData.map((item, i) => {
                    const name = item.split(':')[0]
                    if (i === courtIndex) return `${name}:1`
                    return item
                })

                await tx.sport.update({
                    where: { id: sport.id },
                    data: {
                        courtsInUse: { increment: 1 }, courtData: newCourtData, numPlayers: { increment: numPlayers }
                    }
                })
            }
            if (data.equipmentsIssued && data.equipmentsIssued.length > 0) {
                let currentEqInUse = sport.equipmentsInUse || []
                const newEqInUse = [...currentEqInUse]

                data.equipmentsIssued.forEach(issued => {
                    const [name, count] = issued.split(':')
                    const issuedCount = parseInt(count)

                    const eqIndex = newEqInUse.findIndex(eq => eq.startsWith(name + ':'))
                    if (eqIndex !== -1) {
                        const [eqName, eqCount] = newEqInUse[eqIndex].split(':')
                        newEqInUse[eqIndex] = `${eqName}:${parseInt(eqCount) + issuedCount}`
                    }
                    else {
                        newEqInUse.push(`${name}:${issuedCount}`)
                    }
                })

                if (!isCapacityBased) { }

                await tx.sport.update({
                    where: { id: sport.id },
                    data: {
                        equipmentsInUse: newEqInUse,
                        ...(isCapacityBased && { numPlayers: { increment: numPlayers } })
                    }
                })
            }
            else if (isCapacityBased) {
                await tx.sport.update({
                    where: { id: sport.id }, data: { numPlayers: { increment: numPlayers } }
                })
            }
            // console.log("Data=> ", data.endTime);

            const booking = await tx.booking.create({
                data: {
                    userId: data.userId, sportName: data.sportName,
                    issuedEquipments: data.equipmentsIssued || [],
                    numberOfPlayers: numPlayers, startTime: data.startTime,
                    endTime: data.endTime, date: data.date,
                    qrDetail: data.qrdetail, status: data.status,
                    endDate: data.enddate, courtNo: data.CourtNo,
                },
            })
            return booking
        })
        revalidatePath('/')
        await triggerSocketUpdate()
        return { success: true, booking: result }
    }
    catch (error) {
        console.error('Secure booking error:', error)
        return { success: false, error: error.message || 'Failed to create booking' }
    }
}
