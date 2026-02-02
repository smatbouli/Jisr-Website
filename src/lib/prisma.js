import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient({
        datasources: {
            db: {
                url: "postgresql://postgres.wvxvxxbvzcppebelcoux:yEqn8E8oGVhVSKkn@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
            },
        },
    })
}

const globalForPrisma = global

const prisma = globalForPrisma.prisma_v3 ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma_v3 = prisma
