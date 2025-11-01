import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { StatisticsClient } from "./statistics-client";

export const dynamic = "force-dynamic";

export default async function StatisticsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return <StatisticsClient />;
}
