"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function uploadAndAnalyzeResume(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be logged in to upload a resume");
  }

  // Enforce tier limits
  let subscription = await prisma.userSubscription.findUnique({
    where: { clerkUserId: userId },
  });

  if (!subscription) {
    subscription = await prisma.userSubscription.create({
      data: { clerkUserId: userId, plan: "FREE", scanCount: 0 },
    });
  }

  const limits: Record<string, number> = {
    FREE: 3,
    PLUS: 50,
    PRO: 200,
  };

  const limit = limits[subscription.plan] || 3;
  if (subscription.scanCount >= limit) {
    throw new Error(
      "UPGRADE_REQUIRED: You have reached your monthly AI scan limit.",
    );
  }

  const file = formData.get("resume") as File;
  const jobId = formData.get("jobId") as string;
  const candidateName = formData.get("name") as string;
  const candidateEmail = formData.get("email") as string;

  if (!file || !jobId || !candidateName || !candidateEmail) {
    throw new Error("Missing required fields");
  }

  // Convert PDF to base64 for Gemini ingestion
  const arrayBuffer = await file.arrayBuffer();
  const base64Data = Buffer.from(arrayBuffer).toString("base64");

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new Error("Job not found");

  const prompt = `
    You are an expert technical recruiter and resume analyzer. 
    Review the attached PDF Resume against the following Job Description.
    
    Job Title: ${job.title}
    Job Description: ${job.description}
    
    You must return a raw JSON object (with NO markdown blocks like \`\`\`json) with the exact following structure:
    {
      "score": <integer from 0 to 100 representing the match percentage>,
      "summary": "<2-3 sentences summarizing their fit>",
      "strengths": ["<matched skill 1>", "<matched keyword 2>"],
      "weaknesses": ["<missing skill 1>", "<missing requirement 2>"],
      "jargon": ["<overused buzzword>", "<unnecessary jargon>"],
      "flags": ["<grammatical mistake>", "<repetitive phrase>", "<red flag>"]
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: [
      {
        inlineData: {
          data: base64Data,
          mimeType: "application/pdf",
        },
      },
      prompt,
    ],
  });

  let aiScore = 0;
  let aiFeedbackString = "{}";
  try {
    const rawText = response.text || "{}";
    const cleanedText = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    const parsed = JSON.parse(cleanedText);

    aiScore = parsed.score || 0;
    // Store complex analysis data as stringified JSON in the DB
    aiFeedbackString = JSON.stringify({
      summary: parsed.summary || "Analysis completed.",
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
      jargon: parsed.jargon || [],
      flags: parsed.flags || [],
    });
  } catch (e) {
    console.error("Failed to parse Gemini response:", e);
    aiFeedbackString = JSON.stringify({
      summary: "AI analysis completed but format was unexpected.",
    });
  }

  await prisma.$transaction([
    prisma.candidate.create({
      data: {
        name: candidateName,
        email: candidateEmail,
        resumeUrl: "uploaded-in-memory",
        matchScore: aiScore,
        feedback: aiFeedbackString,
        jobId: jobId,
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
