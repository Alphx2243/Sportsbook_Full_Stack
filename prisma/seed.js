const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log("DATABASE URL:", process.env.DATABASE_URL);
    const sports = [
        {
            name: 'Badminton',
            numberOfCourts: 3,
            totalEquipments: ['Racket:20', 'Shuttle:50'],
            equipmentsInUse: ['Racket:0', 'Shuttle:0'],
            courtsInUse: 0,
            numPlayers: 0,
            courtData: ['Court 1', 'Court 2', 'Court 3'],
        },
        {
            name: 'Squash',
            numberOfCourts: 2,
            totalEquipments: ['Racket:10', 'Ball:20'],
            equipmentsInUse: ['Racket:0', 'Ball:0'],
            courtsInUse: 0,
            numPlayers: 0,
            courtData: ['Court 1', 'Court 2'],
        },
        {
            name: 'Table Tennis',
            numberOfCourts: 4,
            totalEquipments: ['Racket:20', 'Ball:50'],
            equipmentsInUse: ['Racket:0', 'Ball:0'],
            courtsInUse: 0,
            numPlayers: 0,
            courtData: ['Table 1:0', 'Table 2:0', 'Table 3:0', 'Table 4:0'],
        },
        {
            name: 'Tennis',
            numberOfCourts: 2,
            totalEquipments: ['Racket:15', 'Ball:40'],
            equipmentsInUse: ['Racket:0', 'Ball:0'],
            courtsInUse: 0,
            numPlayers: 0,
            courtData: ['Court 1', 'Court 2'],
        },
        {
            name: 'Swimming',
            numberOfCourts: 1,
            totalEquipments: [],
            maxCapacity: 20,

            equipmentsInUse: [],
            courtsInUse: 0,
            numPlayers: 0,
            courtData: ['RPool'],
        },
        {
            name: 'Gym',
            numberOfCourts: 1,
            maxCapacity: 50,
            totalEquipments: [],
            equipmentsInUse: [],
            courtsInUse: 0,
            numPlayers: 0,
            courtData: ['Main Gym'],
        },
    ]

    for (const sport of sports) {
        const existing = await prisma.sport.findUnique({
            where: { name: sport.name },
        })
        if (!existing) {
            await prisma.sport.create({
                data: sport,
            })
            console.log(`Created sport: ${sport.name}`)
        } else {
            await prisma.sport.update({
                where: { name: sport.name },
                data: {
                    maxCapacity: sport.maxCapacity,
                    courtData: sport.courtData,
                    numberOfCourts: sport.numberOfCourts,
                    courtsInUse: 0,
                    numPlayers: 0,
                    equipmentsInUse: sport.equipmentsInUse || [],
                }
            })
            console.log(`Updated sport: ${sport.name}`)
        }
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
