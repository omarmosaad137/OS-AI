export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, mode, context } = request.body || {};

    if (!prompt && !context) {
      return response.status(400).json({ error: 'Prompt or context is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return response.status(200).json({
        demo: true,
        text: `Demo AI response. Add OPENAI_API_KEY in Vercel Environment Variables to enable live AI.\n\nMode: ${mode || 'general'}\n\nPrompt:\n${prompt || ''}\n\nContext:\n${context || ''}`
      });
    }

    const aiPrompt = [
      'You are OS Legal AI, an internal legal drafting assistant for a UAE law firm.',
      'Draft in clear professional legal English unless Arabic is requested.',
      'Do not invent case law, article numbers, or facts. If a legal citation is needed but not provided, say it must be verified.',
      'Keep outputs practical, structured, and client/lawyer friendly.',
      '',
      `Mode: ${mode || 'general'}`,
      '',
      'Context:',
      context || '',
      '',
      'User request:',
      prompt || ''
    ].join('\n');

    const openaiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        input: aiPrompt
      })
    });

    if (!openaiResponse.ok) {
      const details = await openaiResponse.text();
      return response.status(500).json({ error: 'OpenAI API request failed', details });
    }

    const data = await openaiResponse.json();
    const text =
      data.output_text ||
      data.output?.map(item => item.content?.map(content => content.text).join('\n')).join('\n') ||
      'No text returned.';

    return response.status(200).json({ text });
  } catch (error) {
    return response.status(500).json({ error: error.message || 'AI request failed' });
  }
}
