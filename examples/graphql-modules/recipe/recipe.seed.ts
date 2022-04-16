import Recipe from './recipe.type'

export default function createRecipes(): Recipe[] {
  return [
    {
      id: 1,
      title: 'Spaghetti',
      creationDate: new Date('2020-07-05T12:42:12Z'),
      description: 'Italian food',
      authorId: 1
    },
    {
      id: 2,
      title: 'Tortilla',
      creationDate: new Date('2020-07-04T11:24:11Z'),
      description: 'Spanish food',
      authorId: 1
    },
    {
      id: 3,
      title: 'Hamburger',
      creationDate: new Date('2020-07-03T15:32:22Z'),
      authorId: 2
    }
  ]
}
