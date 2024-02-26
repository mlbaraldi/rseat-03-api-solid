import { hash, compare } from 'bcryptjs'
import { Encrypter } from '@/adapters/encrypter'

export class BcryptAdapter implements Encrypter {
  async encrypt(value: string): Promise<string> {
    const passwordHash = await hash(value, 6)
    return passwordHash
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash)
  }
}
