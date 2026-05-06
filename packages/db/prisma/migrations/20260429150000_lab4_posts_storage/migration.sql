PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'Oleksandra',
    "content" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "new_Post" ("id", "title", "author", "content", "tags", "createdAt", "updatedAt")
SELECT "id", "title", 'Oleksandra', "content", '', "createdAt", "updatedAt"
FROM "Post";

DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
DROP TABLE IF EXISTS "User";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
