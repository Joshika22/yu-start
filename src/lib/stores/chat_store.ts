import { get, writable } from 'svelte/store';
import { userStore } from './user_store';
import type { Content } from '@google-cloud/vertexai';

export type ChatMessage = {
	name: 'Yu-Bot' | string;
	message: string;
};
export const chatStore = writable<ChatMessage[]>([
	{
		name: 'Yu-Bot',
		message:
			"I'm Yu-Bot, dedicated to boosting your productivity and keeping your tasks neatly arranged."
	}
]);

export const chatApiService = {
	sendMessage: async (message: string) => {
		const history: Content[] = get(chatStore)
			.slice(1)
			.map((chatMessage, index) => {
				return {
					role: chatMessage.name === 'Yu-Bot' ? 'model' : 'user',
					parts: [
						{
							text: chatMessage.message
						}
					]
				};
			});
		const userName = get(userStore)?.firstName;
		chatStore.update((chatMessages) => {
			chatMessages.push({
				name: userName!,
				message
			});
			return chatMessages;
		});
		const response = await fetch('/api/chat', {
			method: 'POST',
			body: JSON.stringify({ history, message }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const responseJson: { response: string } = await response.json();
		chatStore.update((chatMessages) => {
			chatMessages.push({
				name: 'Yu-Bot',
				message: responseJson.response ?? "Error: I'm unable to process your request."
			});
			return chatMessages;
		});
	}
};
