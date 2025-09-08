export const runtime = 'edge';

export async function POST(req) {
  try {
    const { topic, nodeText, mode, tags, customInstruction } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), { status: 500 });
    }

    const system = `You are a research graph assistant. Return ONLY valid JSON:
{
  "nodes": [
    { "title": "string", "summary": "string", "bullets": ["string"], "tags": ["string"], "markdown": "string" }
  ]
}
Keep it factual, deduplicated, and relevant to expanding a knowledge graph.`;

    const userPayload = {
      topic,
      sourceNode: nodeText,
      mode,                 // "definitions" | "summary" | "examples" | "prerequisites" | "advanced" | "related"
      tags,
      customInstruction
    };

    // Use Chat Completions (stable) with JSON mode
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        temperature: 0.3,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: JSON.stringify(userPayload) }
        ]
      })
    });

    if (!resp.ok) {
      const err = await resp.text();
      return new Response(JSON.stringify({ error: err }), { status: resp.status });
    }

    const data = await resp.json();
    const text = data?.choices?.[0]?.message?.content || '';
    let json;
    try { json = JSON.parse(text); } catch { json = { nodes: [] }; }

    // Minimal shape guard
    if (!Array.isArray(json.nodes)) json.nodes = [];
    json.nodes = json.nodes.map(n => ({
      title: n?.title ?? 'Untitled',
      summary: n?.summary ?? '',
      bullets: Array.isArray(n?.bullets) ? n.bullets : [],
      tags: Array.isArray(n?.tags) ? n.tags : [],
      markdown: n?.markdown ?? ''
    }));

    return new Response(JSON.stringify(json), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
