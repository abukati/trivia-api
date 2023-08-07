import { ChatCompletionRequestMessage, Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';
import { GeneratedGameResponse } from '../types/types.js';

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
	organization: 'org-wV7Tz2PGpxmNjgoRU9SFNlxp'
});

const openai = new OpenAIApi(configuration);

let CACHED_RESPONSE: any = null;

export const requestJson = (prompt: string, jsonStructure: GeneratedGameResponse) => {
	return `${prompt}
  Do not include any explanations, only provide a RFC8259 compliant JSON response following this format without deviation.
  ${JSON.stringify(jsonStructure, null, 2)}`;
};

export const generateJson = async (messages: ChatCompletionRequestMessage[]) => {
	if (CACHED_RESPONSE !== null) {
		return CACHED_RESPONSE;
	}

	const completion = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages
	});
	CACHED_RESPONSE = completion;

	return completion;
};

const requestedAnswersStructure = {
	answer: 'An answer',
	correct: '1 or 0 based on true answer or false'
};

const requestedQuestionStructure = {
	question: 'A trivia question',
	answers: `An array of answers structured as the following: ${requestedAnswersStructure}`
};

export const requestedOutputStructure: GeneratedGameResponse = {
	topic: 'A string representation of the trivia game topic',
	difficulty: 'A string representation of the trivia game difficulty',
	questions: [
		{
			question: 'A trivia question',
			answers: [
				{
					answer: 'An answer',
					correct: true
				}
			]
		}
	]
};

export default async function createPrompt(message: string) {
	const messages: ChatCompletionRequestMessage[] = [
		{ role: 'system', content: 'Act as a trivia game generating API' },
		{ role: 'user', content: requestJson(message, requestedOutputStructure) }
	];
	const response = await generateJson(messages);

	return response;
}
