export interface User {
  id: number
  email: string
  favs: Array<string>
}

export const users = new Array<User>(
  {
    id: 1,
    email: 'ben@b.com',
    favs: ['hooo', 'haaa', 'hiii'],
  },
  {
    id: 2,
    email: 'weab@oo.kr',
    favs: ['dbz', 'onepiece'],
  }
)
