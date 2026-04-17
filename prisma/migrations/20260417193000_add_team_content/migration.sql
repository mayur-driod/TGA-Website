-- Create table for admin-editable team page content
CREATE TABLE "team_content" (
  "id" TEXT NOT NULL DEFAULT 'main',
  "data" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "team_content_pkey" PRIMARY KEY ("id")
);
