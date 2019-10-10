# Migration `20190905093836-init`

This migration has been generated at 9/5/2019, 9:38:36 AM.
You can check out the [state of the datamodel](./datamodel.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "lift"."User"("age" INTEGER NOT NULL DEFAULT 0  ,"amount" REAL NOT NULL DEFAULT 0  ,"balance" REAL NOT NULL DEFAULT 0  ,"email" TEXT NOT NULL DEFAULT ''  ,"id" INTEGER NOT NULL  PRIMARY KEY AUTOINCREMENT ,"name" TEXT    ,"role" TEXT NOT NULL DEFAULT 'USER'  )
;

CREATE TABLE "lift"."Post"("author" INTEGER    REFERENCES "User"(id) ON DELETE SET NULL,"content" TEXT    ,"createdAt" DATE NOT NULL DEFAULT '1970-01-01 00:00:00'  ,"kind" TEXT    ,"published" BOOLEAN NOT NULL DEFAULT false  ,"title" TEXT NOT NULL DEFAULT ''  ,"updatedAt" DATE NOT NULL DEFAULT '1970-01-01 00:00:00'  ,"uuid" TEXT NOT NULL   ,PRIMARY KEY ("uuid"))
;

CREATE UNIQUE INDEX "lift"."User.id" ON "User"("id")

CREATE UNIQUE INDEX "lift"."User.email" ON "User"("email")

CREATE UNIQUE INDEX "lift"."Post.uuid" ON "Post"("uuid")
```

## Changes

```diff
diff --git datamodel.mdl datamodel.mdl
migration ..20190905093836-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,65 @@
+datasource db {
+  provider = "sqlite"
+  url      = "file:../dev.db"
+}
+
+type Numeric = Float
+
+generator typegraphql {
+  provider = "../../../src/bin.ts"
+  output   = "./generated/type-graphql"
+}
+
+generator photon {
+  provider = "photonjs"
+  output   = "./generated/photon"
+}
+
+/// Role enum comment
+enum Role {
+  // USER = "User"
+  USER
+  // ADMIN = "Admin"
+  ADMIN
+}
+
+/// User model comment
+model User {
+  /// User model field comment
+  id          Int     @id @unique
+  email       String  @unique
+  name        String?
+  age         Int
+  balance     Numeric
+  amount      Float
+  posts       Post[]
+  // maybePosts  Post[]?
+  role        Role
+  // address     Address
+  // address2 embed {
+  //   street  String
+  //   zipCode String
+  // }
+}
+
+// embed Address {
+//   street  String
+//   zipCode String
+// }
+
+enum PostKind {
+  BLOG
+  ADVERT
+}
+
+model Post {
+  uuid      String   @default(cuid()) @id @unique
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+  published Boolean
+  title     String
+  content   String?
+  author    User
+  // coAuthor  User?
+  kind      PostKind?
+}
```

## Photon Usage

You can use a specific Photon built for this migration (20190905093836-init)
in your `before` or `after` migration script like this:

```ts
import Photon from '@generated/photon/20190905093836-init'

const photon = new Photon()

async function main() {
  const result = await photon.users()
  console.dir(result, { depth: null })
}

main()

```
