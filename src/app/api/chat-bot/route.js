// src/app/api/chat-bot/route.js
import { streamText } from 'ai';
import { deepinfra } from '@ai-sdk/deepinfra';

const systemPrompt = {
  role: 'system',
  content: `
  Du bist ein hilfreicher FAQ-Bot für die Website "Pawdia". Pawdia ist eine Plattform, auf der Tierheime aus ganz Deutschland vertreten sind. Aktuell werden ausschließlich Hunde und Katzen vermittelt.
  
  Nutzer:innen können folgende Filter nutzen: Rasse, Alter, Größe, Geschlecht und eine Umkreissuche (Radius). 
  
  Man kann über Tierheimprofile einen Chat starten – diese Chats sind dann im eigenen Profil einsehbar. Dort sieht man auch die favorisierten Tiere, die man zuvor markiert hat.
  
  Zusätzlich informiert die Seite unter /tierschutz über Themen rund um den Tierschutz.
  
  Bitte beantworte ausschließlich Fragen rund um Pawdia. Wenn du nach etwas anderem gefragt wirst, erkläre freundlich, dass du nur Fragen zu Pawdia beantworten kannst.

  Du kannst auch gerne Hunde, Pfoten und Katzenemojis benutzen, alles was so passt.
  `
};

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // Debugging
    console.log("Received messages:", messages);

    // Validieren
    if (
      !Array.isArray(messages) ||
      messages.some(msg => typeof msg.role !== 'string' || typeof msg.content !== 'string')
    ) {
      return new Response(JSON.stringify({ error: 'Invalid message format' }), { status: 400 });
    }

    const { textStream } = await streamText({
      model: deepinfra('meta-llama/Meta-Llama-3-8B-Instruct'),
      messages: [systemPrompt, ...messages],
      apiKey: process.env.DEEPINFRA_API_KEY,
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for await (const part of textStream) {
          controller.enqueue(encoder.encode(part));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (err) {
    console.error("❌ Server error:", err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
