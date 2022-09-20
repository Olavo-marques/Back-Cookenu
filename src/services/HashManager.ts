import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

export class HashManager {
    public hash = async (normalPassword: string): Promise<string> => {
        const rounds = Number(process.env.BCRIPT_COST)
        const salt = await bcrypt.genSalt(rounds)
        const hash = await bcrypt.hash(normalPassword, salt)
        
        return hash
    }

    public compare = async (normalPassword: string, hash: string): Promise<boolean> => {
        return bcrypt.compare(normalPassword, hash)
    }
}