import { hash } from 'bcryptjs'
import { Encrypter } from '@/protocols/encrypter'

export class BcryptAdapter implements Encrypter {
  async encrypt(value: string): Promise<string> {
    const passwordHash = await hash(value, 6)
    return passwordHash
  }
}
