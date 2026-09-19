"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { scanLimits } from "@/lib/plans";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function uploadAndAnalyzeResume(formData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be logged in to upload a resume");
  }

  let subscription = await prisma.userSubscription.findUnique({
    where: { clerkUserId: userId },
  });

  if (!subscription) {
    subscription = await prisma.userSubscription.create({
      data: { clerkUserId: userId },
    });
  }

  const limit = scanLimits[subscription.plan] || scanLimits.FREE;
  if (subscription.scanCount >= limit) {
    throw new Error("UPGRADE_REQUIRED: You have reached your monthly AI scan limit.");
  }

  const file = formData.get("resume");
  const jobId = formData.get("jobId");
  const name = formData.get("name");
  const email = formData.get("email");

  if (!file || !jobId || !name || !email) {
    throw new Error("Missing required fields");
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId, clerkUserId: userId },
  });
  if (!job) {
    throw new Error("Job not found");
  }

  const buffer = await file.arrayBuffer();
  const base64Data = Buffer.from(buffer).toString("base64");

  const prompt = `
    You are an expert technical recruiter and resume analyzer.
    Review the attached PDF Resume against the following Job Description.

    Job Title: ${job.title}
    Job Description: ${job.description}

    Return a raw JSON object with no markdown blocks, using exactly this structure:
    {
      "score": <integer from 0 to 100>,
      "summary": "<2-3 sentences summarizing their fit>",
      "strengths": ["<matched skill>"],
      "weaknesses": ["<missing requirement>"],
      "jargon": ["<overused buzzword>"],
      "flags": ["<grammatical mistake or red flag>"]
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { data: base64Data, mimeType: "application/pdf" } },
          { text: prompt },
        ],
      },
    ],
  });

  let score = 0;
  let feedback = JSON.stringify({ summary: "AI analysis could not be read." });

  try {
    const text = (response.text || "{}").replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(text);

    score = parsed.score || 0;
    feedback = JSON.stringify({
      summary: parsed.summary || "Analysis completed.",
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
      jargon: parsed.jargon || [],
      flags: parsed.flags || [],
    });
  } catch (err) {
    console.error("Could not parse Gemini response", err);
  }

  await prisma.$transaction([
    prisma.candidate.create({
      data: {
        name,
        email,
        resumeUrl: "uploaded-in-memory",
        matchScore: score,
        feedback,
        jobId,
      },
    }),
    prisma.userSubscription.update({
      where: { clerkUserId: userId },
      data: { scanCount: { increment: 1 } },
    }),
  ]);

  revalidatePath(`/dashboard/jobs/${jobId}`);
  return { success: true };
}
