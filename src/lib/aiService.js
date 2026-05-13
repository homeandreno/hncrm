// Simulated AI Service
// This service acts as a placeholder for OpenAI's API.
// Once you add an OPENAI_API_KEY to your environment, you can replace the mock logic here.

export const generateDraftReply = async (conversationContext) => {
  // Simulate network latency for API call
  await new Promise(resolve => setTimeout(resolve, 1500));

  // In a real implementation, you would pass `conversationContext` to OpenAI's completion endpoint:
  /*
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful customer support agent for HNRENO.' },
        { role: 'user', content: conversationContext }
      ]
    })
  });
  const data = await response.json();
  return data.choices[0].message.content;
  */

  // Mock response based on the context
  if (conversationContext.toLowerCase().includes('invoice')) {
    return "Hi there, I completely understand your concern. The invoice includes the one-time setup fee we discussed last week. Let me know if you'd like to jump on a call to review it!";
  } else if (conversationContext.toLowerCase().includes('hello')) {
    return "Hello! How can I assist you with your CRM today?";
  } else {
    return "Thank you for reaching out. I'm currently looking into this and will get back to you shortly.";
  }
};
