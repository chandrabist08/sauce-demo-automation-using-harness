const ACTION_WORDS = /\b(create|add|write|build|generate|implement)\b/i;
const PLAYWRIGHT_WORDS = /\b(helper|spec|config|test|selector|route|fixture)\b/i;

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const event = JSON.parse(Buffer.concat(chunks).toString() || '{}');
const prompt = event?.prompt ?? '';

if (ACTION_WORDS.test(prompt) && PLAYWRIGHT_WORDS.test(prompt)) {
  const injected = `[Search-first rule]: Before creating or writing any file, search for existing implementations using grep or glob. Only create if nothing suitable exists.\n\n${prompt}`;
  process.stdout.write(JSON.stringify({ prompt: injected }));
} else {
  process.stdout.write(JSON.stringify({ prompt }));
}
