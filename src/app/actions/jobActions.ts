"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export async function createJob(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to create a job");
  }

  const title = formData.get("title") as string;
  const company = formData.get("company") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;

  if (!title || !company || !location || !description) {
    throw new Error("Missing required fields");
  }

  await prisma.job.create({
    data: {
      title,
      company,
      location,
      description,
      clerkUserId: userId,
    },
  });

  revalidatePath("/dashboard/jobs");
  redirect("/dashboard/jobs");
}
