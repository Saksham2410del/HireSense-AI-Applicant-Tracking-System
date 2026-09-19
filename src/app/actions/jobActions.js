"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export async function createJob(formData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be signed in to create a job");
  }

  const title = formData.get("title");
  const company = formData.get("company");
  const location = formData.get("location");
  const description = formData.get("description");

  if (!title || !company || !location || !description) {
    throw new Error("Missing required fields");
  }

  await prisma.job.create({
    data: { title, company, location, description, clerkUserId: userId },
  });

  revalidatePath("/dashboard/jobs");
  redirect("/dashboard/jobs");
}
