import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient({
        datasources: {
            db: {
                url: "postgresql://postgres:yEqn8E8oGVhVSKkn@db.wvxvxxbvzcppebelcoux.supabase.co:5432/postgres",
            },
        },
    })
}

const globalForPrisma = global

const prisma = globalForPrisma.prisma_v3 ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma_v3 = prisma
