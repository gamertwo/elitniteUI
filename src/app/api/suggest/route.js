export const runtime = 'edge';

export async function POST(req) {
  try {
    const { topic, node } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), { status: 500 });

    const system = `You are a research navigator. Given a topic and the current node (title/summary/tags),
suggest 4–6 concrete next exploration paths for a knowledge graph tool.

Return ONLY JSON:
{
  "suggestions": [
    { "mode": "summary|definitions|examples|prerequisites|related|advanced",
      "steer": "short instruction to steer generation",
      "why": "1 short line why this is useful" }
  ],
  "tags": ["optional", "tags", "to", "add"],
  "questions": ["optional follow-up question", "..."]
}

Rules:
- Make suggestions distinct and practical.
- Keep steer ≤ 90 chars. Keep why ≤ 90 chars.
- Prefer applied angles, e.g., 'Checklist for first project', 'Common pitfalls', 'Tooling setup'.
- Only use the allowed modes above.`;

    const user = { topic, node };

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: JSON.stringify(user) }
        ]
      })
    });

    if (!resp.ok) {
      const err = await resp.text();
      return new Response(JSON.stringify({ error: err }), { status: resp.status });
    }

    const data = await resp.json();
    const text = data?.choices?.[0]?.message?.content || '{}';
    let json; try { json = JSON.parse(text); } catch { json = { suggestions: [], tags: [], questions: [] }; }

    if (!Array.isArray(json.suggestions)) json.suggestions = [];
    if (!Array.isArray(json.tags)) json.tags = [];
    if (!Array.isArray(json.questions)) json.questions = [];

    // light normalization
    json.suggestions = json.suggestions
      .filter(s => s?.mode && s?.steer)
      .slice(0, 6)
      .map(s => ({
        mode: String(s.mode),
        steer: String(s.steer).slice(0, 120),
        why: String(s.why || '')
      }));

    json.tags = json.tags.slice(0, 10).map(String);
    json.questions = json.questions.slice(0, 6).map(String);

    return new Response(JSON.stringify(json), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
