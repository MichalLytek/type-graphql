# Migration `20190817133322-init`

This migration has been generated at 8/17/2019, 1:33:22 PM.
You can check out the [state of the datamodel](./datamodel.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "lift"."User"("id" TEXT NOT NULL  ,"email" TEXT NOT NULL DEFAULT '' ,"name" TEXT   ,"age" INTEGER NOT NULL DEFAULT 0 ,"balance" REAL NOT NULL DEFAULT 0 ,"amount" REAL NOT NULL DEFAULT 0 ,"role" TEXT NOT NULL DEFAULT 'USER' ,PRIMARY KEY ("id"))
;

CREATE TABLE "lift"."Post"("id" TEXT NOT NULL  ,"createdAt" DATE NOT NULL  ,"updatedAt" DATE NOT NULL DEFAULT '1970-01-01 00:00:00' ,"published" BOOLEAN NOT NULL DEFAULT false ,"title" TEXT NOT NULL DEFAULT '' ,"content" TEXT   ,"kind" TEXT   ,"author" TEXT   REFERENCES "User"(id) ON DELETE SET NULL,PRIMARY KEY ("id"))
;

CREATE UNIQUE INDEX "lift"."User.id._UNIQUE" ON "User"("id")

CREATE UNIQUE INDEX "lift"."User.email._UNIQUE" ON "User"("email")

CREATE UNIQUE INDEX "lift"."Post.id._UNIQUE" ON "Post"("id")
```

## Changes

```diff
diff --git datamodel.mdl datamodel.mdl
migration ..20190817133322-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,58 @@
+datasource db {
+  provider = "sqlite"
+  url      = "file:./dev.db"
+}
+
+type Numeric = Float
+
+generator photon {
+  provider = "photonjs"
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
+  id          String  @default(cuid()) @id @unique
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
+  id        String   @default(cuid()) @id @unique
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+  published Boolean
+  title     String
+  content   String?
+  author    User?
+  kind      PostKind?
+}
```

## Photon Usage

You can use a specific Photon built for this migration (20190817133322-init)
in your `before` or `after` migration script like this:

```ts
import Photon from '@generated/photon/20190817133322-init'

const photon = new Photon()

async function main() {
  const result = await photon.users()
  console.dir(result, { depth: null })
}

main()

```
