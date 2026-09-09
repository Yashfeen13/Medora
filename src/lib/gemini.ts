// ============================================
// Medora — Gemini AI MCQ Batch Generator
// ============================================

import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { GeneratedMCQ } from './types';
import { isDuplicateQuestion } from './daily-pool';

// Schema for structured MCQ output
const mcqResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    questions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          question: { type: SchemaType.STRING },
          option_a: { type: SchemaType.STRING },
          option_b: { type: SchemaType.STRING },
          option_c: { type: SchemaType.STRING },
          option_d: { type: SchemaType.STRING },
          correct_answer: { type: SchemaType.STRING },
          explanation: { type: SchemaType.STRING },
          incorrect_explanation: { type: SchemaType.STRING },
          difficulty: { type: SchemaType.STRING },
        },
        required: [
          'question', 'option_a', 'option_b', 'option_c', 'option_d',
          'correct_answer', 'explanation', 'incorrect_explanation', 'difficulty',
        ],
      },
    },
  },
  required: ['questions'],
};

function buildPrompt(
  subject: string,
  topic: string,
  mode: 'university' | 'usmle',
  count: number,
  existingQuestions: string[] = []
): string {
  const isUSMLE = mode === 'usmle';

  const modeInstruction = isUSMLE
    ? `TEST TYPE: USMLE Preparation
       - Format: Vignette-style patient scenarios (age, sex, history, symptoms, physical exam, labs/imaging where appropriate).
       - Focus: Clinical reasoning, application of medical principles, next best step in management, pathophysiology, and differential diagnosis.
       - Difficulty: Challenging Step 1 / Step 2 level conceptual questions.`
    : `TEST TYPE: University Preparation
       - Format: Standard university exam MCQs testing core textbook knowledge and medical fundamentals.
       - Focus: Concepts, definitions, mechanisms, anatomical relationships, diagnostic standards, and high-yield exam knowledge.
       - Difficulty: Balanced mix of basic, intermediate, and advanced MBBS university exam questions.`;

  const existingBlock = existingQuestions.length > 0
    ? `\n\nDO NOT REPEAT OR PARAPHRASE: The following questions ALREADY exist in the daily pool. Generate completely NEW and DISTINCT concepts that do NOT duplicate, paraphrase, or rephrase any of these stems:\n${existingQuestions.slice(-25).map((q, i) => `${i + 1}. ${q}`).join('\n')}`
    : '';

  return `You are an expert medical education content author creating MCQs for Medora.

SUBJECT: ${subject}
TOPIC: ${topic}
COUNT: Exactly ${count} questions

${modeInstruction}

CRITICAL RULES:
1. STRICT TOPIC RELEVANCE: Generate questions ONLY from the specified topic "${topic}" under "${subject}". Do NOT generate questions from other unrelated topics in ${subject}.
2. NO REPETITION OR PARAPHRASING: Do not repeat, rephrase, or substantially recreate any previously generated question or concept.
3. 4 OPTIONS: Each question MUST have exactly 4 options (A, B, C, D).
4. EXACT 1 CORRECT ANSWER: The correct_answer MUST be exactly one of "A", "B", "C", "D".
5. RANDOM CORRECT LETTER: Distribute correct answers approximately 25% across A, B, C, D. Do NOT default to "A".
6. PLAUSIBLE DISTRACTORS: Wrong options must be medically plausible distractors, but unambiguously incorrect.
7. EXPLANATIONS: Provide clear educational rationale explaining WHY the correct answer is right and why wrong options are incorrect.
8. DIFFICULTY: Exactly one of "easy", "medium", "hard".${existingBlock}

Generate exactly ${count} high-quality, distinct MCQs specifically for "${topic}".`;
}

export async function generateMCQBatch(
  subject: string,
  topic: string,
  mode: 'university' | 'usmle',
  count: number = 15,
  existingQuestions: string[] = []
): Promise<GeneratedMCQ[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('your-gemini')) {
    throw new Error('Gemini API key is not configured in .env.local');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: mcqResponseSchema,
        temperature: 0.85,
        maxOutputTokens: 8192,
      },
    });

    const prompt = buildPrompt(subject, topic, mode, count, existingQuestions);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    const validQuestions: GeneratedMCQ[] = [];
    for (const q of parsed.questions) {
      if (
        q.question &&
        q.option_a &&
        q.option_b &&
        q.option_c &&
        q.option_d &&
        ['A', 'B', 'C', 'D'].includes(q.correct_answer) &&
        q.explanation &&
        ['easy', 'medium', 'hard'].includes(q.difficulty)
      ) {
        const candidate: GeneratedMCQ = {
          question: q.question,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correct_answer: q.correct_answer,
          explanation: q.explanation,
          incorrect_explanation: q.incorrect_explanation || '',
          difficulty: q.difficulty,
        };

        // Application-level Duplicate Prevention
        const existingObjs = existingQuestions.map(stem => ({ question: stem } as any));
        if (!isDuplicateQuestion(candidate.question, [...existingObjs, ...validQuestions as any])) {
          validQuestions.push(candidate);
        }
      }
    }

    return validQuestions;
  } catch (error) {
    console.error('Gemini MCQ generation error:', error);
    throw error;
  }
}
