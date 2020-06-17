import "reflect-metadata";

import {
  FindManyClientArgs,
  FloatFilter,
} from "./prisma/generated/type-graphql";
import { PrismaClient } from "./prisma/generated/client";

async function main() {
  const prisma = new PrismaClient({
    // see dataloader for relations in action
    log: ["query"],
  });

  class UserWhereInput {
    name!: undefined;
    posts!: undefined;
    balance!: FloatFilter;
    get accountBalance(): FloatFilter {
      return this.balance;
    }
    set accountBalance(balance: FloatFilter) {
      this.balance = balance;
    }
  }

  const whereInput = new UserWhereInput();
  whereInput.accountBalance = { gte: 5 };
  console.log(whereInput.accountBalance);

  const args: FindManyClientArgs = {
    where: whereInput,
    // where: {
    //   balance: { gte: 5 },
    //   name: undefined,
    //   posts: undefined,
    // },
  };

  console.log(await prisma.user.findMany(args));

  await prisma.disconnect();
}

main().catch(console.error);
