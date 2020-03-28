import { PrismaClient } from "./prisma/generated/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.patient.deleteMany({});

  await prisma.user.create({
    data: {
      age: 50,
      amount: 123,
      balance: 0,
      email: "test1@test.test",
      name: "Test",
      role: "ADMIN",
      posts: {
        create: [
          {
            title: "Post title 1",
            content: "Content 1",
            kind: "BLOG",
            createdAt: new Date("2019-08-16"),
            published: true,
            updatedAt: new Date("2019-08-17"),
          },
          {
            title: "Post title 2",
            content: "Content 2",
            kind: "ADVERT",
            createdAt: new Date("2019-08-17"),
            published: false,
          },
        ],
      },
    },
  });
  await prisma.user.create({
    data: {
      age: 1,
      amount: 123,
      balance: 0,
      email: "test2@test.test",
      name: "Test",
      role: "USER",
      posts: {
        create: [
          {
            title: "Post title 3",
            content: "Content 3",
            kind: "BLOG",
            createdAt: new Date("2019-08-16"),
            published: true,
            updatedAt: new Date("2019-08-17"),
          },
          {
            title: "Post title 4",
            content: "Content 4",
            kind: "ADVERT",
            createdAt: new Date("2019-08-17"),
            published: false,
          },
          {
            title: "Post title 5",
            content: "Content 5",
            kind: "BLOG",
            createdAt: new Date("2019-08-16"),
            published: true,
            updatedAt: new Date("2019-08-17"),
          },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Famous stars",
      slug: "famous-stars",
      number: 1,
    },
  });
  await prisma.category.create({
    data: {
      name: "Famous stars",
      slug: "famous-stars-2",
      number: 2,
    },
  });

  await prisma.patient.create({
    data: {
      email: "test@test.test",
      firstName: "John",
      lastName: "Doe",
    },
  });
  await prisma.patient.create({
    data: {
      email: "test2@test.test",
      firstName: "John",
      lastName: "Bravo",
    },
  });

  await prisma.director.create({
    data: {
      firstName: "Bob",
      lastName: "Nolan",
      movies: {
        create: [{ title: "Hello World" }, { title: "Hello World 2" }],
      },
    },
  });

  await prisma.movie.create({
    data: {
      title: "Hello World 3",
      director: {
        create: {
          firstName: "Alice",
          lastName: "Allen",
        },
      },
    },
  });

  console.log("All data inserted!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.disconnect();
  });
