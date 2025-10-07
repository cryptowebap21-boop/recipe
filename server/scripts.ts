export const HUMANIZER_SCRIPT = `Humanizer Script:
Rewrite the following text so it appears written by a human, not an AI system. 
Important rules:
- Keep at least 97% of the original words and meaning the same.
- Do NOT heavily rewrite or polish the text. Keep it natural and close to the source.

Instead, subtly add small imperfections that make it read like authentic human writing:
- Occasionally drop or misplace punctuation (like a missing period, an odd comma, or a misplaced exclamation mark).
- Add very few small spelling mistakes (1–2 per 150 words max). Keep them realistic, not distracting.
- Replace a few words with near synonyms, casual forms, or slightly messy alternatives.
- Vary sentence rhythm: sometimes merge two short sentences, sometimes split a long one.
- Randomly add contractions (don't, it's, I'm) or informal words (kinda, gonna).
- Start a few sentences with "And" or "But" or "Because."
- Rarely insert a natural filler phrase (e.g. "you know," "I mean,") if it fits.
- Insert occasional ellipses (…) or double spaces between words, but sparingly.
- Slightly vary tone across sentences (a little casual here, a little formal there).

Final output must be highly readable, nearly identical to the original (97%+ same), and around 99% undetectable by AI detectors. 
Here is the text to humanize:

[USER TEXT]


Input: [USER_TEXT]`;

export const AI_CHECKER_SCRIPT = `AI Checker Script:
Analyze the following text and estimate the probability that it was written by AI. Evaluate based on:
- Sentence structure and rhythm
- Word choice and repetitiveness
- Predictability and lack of human-like imperfections
- Grammar consistency, tone, and overall fluency
- Signs of over-polished or generic phrasing common to AI writing

Return your analysis in the following structured format (JSON):
{
  "ai_probability": [number between 0–100],
  "confidence": "[Very confident / Maybe / Not confident]",
  "reasoning": "[1–3 sentences explaining why you assigned that probability]"
}

Rules for confidence:
- 0–39% → "Not confident"
- 40–79% → "Maybe"
- 80–100% → "Very confident"

Input: [USER_TEXT]`;
