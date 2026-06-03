-- CreateEnum
CREATE TYPE "role" AS ENUM ('ADMIN', 'MEMBER', 'MAINTAINER');

-- CreateEnum
CREATE TYPE "status" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "approval_status" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "diagram_type" AS ENUM ('FLOWCHART', 'SEQUENCE', 'CLASS', 'STATE', 'ENTITY_RELATIONSHIP', 'USER_JOURNEY', 'GANTT', 'PIE_CHART', 'QUADRANT_CHART', 'REQUIREMENT', 'GITGRAPH', 'MINDMAP', 'TIMELINE', 'SANKEY', 'C4_CONTEXT', 'C4_CONTAINER', 'C4_COMPONENT', 'C4_DYNAMIC', 'C4_DEPLOYMENT');

-- CreateTable
CREATE TABLE "Users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teams" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team_Members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "team_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "role" NOT NULL,
    "joined_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_Members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team_Invites" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "team_id" UUID NOT NULL,
    "invited_by" UUID NOT NULL,
    "invited_user_id" UUID,
    "status" "status" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_Invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagrams" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "diagram_type" NOT NULL,
    "mermaid_code" TEXT NOT NULL,
    "created_by" UUID NOT NULL,
    "team_id" UUID,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Diagrams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagram_Approval_Requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "diagram_id" UUID NOT NULL,
    "team_id" UUID NOT NULL,
    "requested_by" UUID NOT NULL,
    "reviewed_by" UUID,
    "status" "approval_status" NOT NULL DEFAULT 'PENDING',
    "requested_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMPTZ,

    CONSTRAINT "Diagram_Approval_Requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Team_Members" ADD CONSTRAINT "Team_Members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team_Members" ADD CONSTRAINT "Team_Members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team_Invites" ADD CONSTRAINT "Team_Invites_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team_Invites" ADD CONSTRAINT "Team_Invites_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team_Invites" ADD CONSTRAINT "Team_Invites_invited_user_id_fkey" FOREIGN KEY ("invited_user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagrams" ADD CONSTRAINT "Diagrams_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagrams" ADD CONSTRAINT "Diagrams_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagram_Approval_Requests" ADD CONSTRAINT "Diagram_Approval_Requests_diagram_id_fkey" FOREIGN KEY ("diagram_id") REFERENCES "Diagrams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagram_Approval_Requests" ADD CONSTRAINT "Diagram_Approval_Requests_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagram_Approval_Requests" ADD CONSTRAINT "Diagram_Approval_Requests_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagram_Approval_Requests" ADD CONSTRAINT "Diagram_Approval_Requests_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
