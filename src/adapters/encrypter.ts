export interface Encrypter {
  encrypt: (value: string) => Promise<string>
  compare: (password: string, hash: string) => Promise<boolean>
}
