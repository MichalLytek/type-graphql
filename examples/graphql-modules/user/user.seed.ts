import User from './user.type'

export default function createUsers(): User[] {
  return [
    {
      id: 1,
      age: 28,
      name: 'John Doe',
      email: 'john.doe@typegraphql.com'
    },
    {
      id: 2,
      age: 18,
      name: 'Ann Smith',
      email: 'ann.smith@typegraphql.com'
    }
  ]
}
