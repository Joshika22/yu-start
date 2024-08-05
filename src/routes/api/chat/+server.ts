import { functionDeclarations, getFunctions, model } from '$lib/server/gen_ai/vertex_ai';
import type { Content } from '@google-cloud/vertexai';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals, url, request }) => {
	const user = locals.user;
	if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

	const body: {
		message: string;
		history: Content[];
	} = await request.json();

	if (!body.history || !body.message)
		return json({ error: 'Message is required' }, { status: 400 });

	const chat = model.startChat({
		tools: functionDeclarations,
		history: body.history
	});

	const functions = getFunctions(user.id);
	await chat.sendMessage(`You are Yu-bot, a chatbot in a task management app. Your primary functions are to create and fetch user tasks. Ensure your responses are concise and helpful. Do not use any specific formatting. 
Remember to always keep the user's needs in focus and assist them efficiently with their task management.`);

	const result = await chat.sendMessage(body.message);

	if (!result.response.candidates) {
		return json({ error: 'No candidates found' }, { status: 500 });
	}

	const candidates = result.response.candidates;
	const functionCall = candidates[0].content.parts[0].functionCall!;

	if (!functionCall) {
		const textMessage = candidates[0].content.parts[0].text;
		if (!textMessage) {
			return json({ error: 'No function call or text message found' }, { status: 500 });
		}
		return json({ response: textMessage }, { status: 200 });
	}

	const response = await functions[functionCall.name](functionCall.args);
	const result2 = await chat.sendMessage([
		{
			functionResponse: {
				name: functionCall.name,
				response: {
					response
				}
			}
		}
	]);
	const candidates2 = result2.response.candidates!;
	const textMessage = candidates2[0].content.parts[0].text;
	if (!textMessage) {
		return json({ response: 'No text message found' }, { status: 500 });
	}

	return json({ response: textMessage }, { status: 200 });
};
