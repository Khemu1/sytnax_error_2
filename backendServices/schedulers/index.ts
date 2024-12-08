import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { CustomError } from "@/middleware/CustomError"; // Ensure this is the correct path

const prisma = new PrismaClient().$extends(withAccelerate());

async function manualTrigger() {
  console.log("Manually triggering scheduled task...");
  try {
    const result = await prisma.token.deleteMany({
      where: {
        OR: [{ used: true }, { expiresAt: { lt: new Date() } }],
      },
    });
    console.log(`${result.count} tokens deleted (manual trigger)`);
  } catch (error) {
    console.error("Error manually triggering task:", error);
    throw new CustomError("Error manually triggering task", 500, "", true);
  }
}

export async function GET() {
  try {
    await manualTrigger();
    return new Response(
      JSON.stringify({ message: "Manual trigger executed successfully." }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "Manual trigger failed." }), {
      status: 500,
    });
  }
}
