export const runtime = 'edge';

export async function POST(req) {
  try {
    const { topic, source, mode, depth = 3, tags = [], steer = '' } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), { status: 500 });

    const system = `You are a knowledge graph assistant.
Return ONLY JSON with: nodes[{title, summary, bullets, tags, markdown}].
Rules:
- summary: 1–2 sentences max.
- markdown: 150–300 words, PRACTICAL & APPLIED. Include:
  * When to use (1–2 lines)
  * Step-by-step checklist (3–7 steps)
  * One concrete example with realistic numbers/inputs
  * Next actions (1 line)
- Avoid fluff. Deduplicate. Keep titles specific.`;

    // Map UI 'mode' into an applied style
    const styleMap = {
      summary: 'applied_overview',
      definitions: 'applied_definitions',
      examples: 'worked_examples',
      prerequisites: 'learning_path',
      related: 'adjacent_topics_applied',
      advanced: 'advanced_practice'
    };

    const user = {
      topic,
      mode,
      style: styleMap[mode] || 'applied_overview',
      depth,
      steer,
      tags,
      source // { title, summary, bullets[], tags[], markdown }
    };

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        response_format: { type: "json_object" }, // reliable, no schema headaches
        messages: [
          { role: "system", content: system },
          { role: "user", content: JSON.stringify(user) }
        ]
      })
    });

    if (!resp.ok) {
      const err = await resp.text();
      return new Response(JSON.stringify({ error: err }), { status: resp.status });
    }

    const data = await resp.json();
    const text = data?.choices?.[0]?.message?.content || "{}";
    let json; try { json = JSON.parse(text); } catch { json = { nodes: [] }; }

    // Normalize
    if (!Array.isArray(json.nodes)) json.nodes = [];
    json.nodes = json.nodes.slice(0, depth).map(n => ({
      title: String(n?.title ?? "Untitled").slice(0, 140),
      summary: String(n?.summary ?? ""),
      bullets: Array.isArray(n?.bullets) ? n.bullets.slice(0, 12).map(String) : [],
      tags: Array.isArray(n?.tags) ? Array.from(new Set(n.tags.concat(tags))).slice(0, 12).map(String) : tags,
      markdown: String(n?.markdown ?? "")
    }));

    return new Response(JSON.stringify(json), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
