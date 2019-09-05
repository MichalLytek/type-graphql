import Photon from "./prisma/generated/photon";

const photon = new Photon();

async function main() {
  await photon.posts.deleteMany({});
  await photon.users.deleteMany({});

  await photon.users.create({
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
  await photon.users.create({
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
  console.log("All data inserted!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await photon.disconnect();
  });
