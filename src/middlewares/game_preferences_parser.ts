import { Request, Response, NextFunction } from 'express';
import { generateJson, requestJson, requestedOutputStructure } from '../services/gpt.service.js';
import { ChatCompletionRequestMessage } from 'openai';

export async function parseGamePreferences(req: Request, res: Response, next: NextFunction) {
	const { difficulty, topic, answerOptions } = req.body;

	if (difficulty === undefined || topic === undefined) {
		res.json({
			status: 400,
			message: 'Missing body parameters\n' + JSON.stringify(req.body)
		});
		return;
	}

	const generateGameMessage = `
	Create a json string of a ${difficulty} difficulty trivia game,
	5 questions, 4 answers per question, with only one correct answer.
	Questions must be ${topic} themed. Mark the correct answer.
`;

	const messages: ChatCompletionRequestMessage[] = [
		{ role: 'system', content: 'Act as a trivia game generating API' },
		{ role: 'user', content: requestJson(generateGameMessage, requestedOutputStructure) }
	];

	const response = await generateJson(messages);

	const prompt_result = response.data.choices[0].message;

	if (prompt_result === undefined) {
		res.json({
			status: '400',
			message: response.status
		});
		return;
	}

	const message = prompt_result.content;

	if (message !== undefined) {
		const json = JSON.parse(message);
		req.body.game = json;
		res.json({
			status: 200,
			message: json
		});
		return;
	}

	res.json({
		status: 400,
		message: 'Invalid parameters passed: \n' + req.query
	});
	return;
}
