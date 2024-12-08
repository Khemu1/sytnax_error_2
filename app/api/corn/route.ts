import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

// Cron job to delete expired or used tokens every 7 days (Sunday at 3 AM)
cron.schedule("0 3 * * 0", async () => {
  console.log("Deleting expired or used tokens...");
  try {
    const result = await prisma.token.deleteMany({
      where: {
        OR: [{ used: true }, { expiresAt: { lt: new Date() } }],
      },
    });
    console.log(`${result.count} tokens deleted`);
  } catch (error) {
    console.error("Error deleting tokens:", error);
  }
});

// Cron job to delete submissions older than 30 days every 7 days (Sunday at 3 AM)
cron.schedule("0 3 * * 0", async () => {
  console.log("Deleting submissions older than 30 days...");
  try {
    const result = await prisma.surveySubmission.deleteMany({
      where: {
        submittedAt: {
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });
    console.log(`${result.count} old submissions deleted`);
  } catch (error) {
    console.error("Error deleting old submissions:", error);
  }
});

export async function GET() {
  return new Response(
    JSON.stringify({ message: "Cron jobs scheduled to run every 7 days." }),
    { status: 200 }
  );
}
