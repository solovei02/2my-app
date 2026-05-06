PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

INSERT INTO "User" ("id", "email", "displayName", "passwordHash", "createdAt", "updatedAt")
VALUES (1, 'student@example.com', 'Student', '$2b$10$HlzqLbkll46htAM5IqOZVe15eP/PL./lTaRZw/266PYrE6Kz4ju4G', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_Post" ("id", "title", "content", "authorId", "createdAt", "updatedAt")
SELECT "id", "title", "content", 1, "createdAt", "updatedAt"
FROM "Post";

DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
