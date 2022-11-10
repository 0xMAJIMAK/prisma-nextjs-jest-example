import prisma from "../../client";

// Resets the database to a clean state whilst leaving the tables behind, only for LOCAL JEST testing purposes DO NOT USE IN PRODUCTION
export async function resetDB() {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== "_prisma_migrations")
    .map((name) => `"public"."${name}"`)
    .join(", ");

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} RESTART IDENTITY CASCADE;`);
  } catch (error) {
    console.log({ error });
  }
}
