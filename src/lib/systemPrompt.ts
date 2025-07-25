export async function getSystemPrompt(): Promise<string> {
  const response = await fetch('./prompts/system_prompt.md');
  return await response.text();
}