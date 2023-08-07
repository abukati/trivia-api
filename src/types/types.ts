export interface Answer {
	answer: string;
	correct: boolean;
}

export interface Question {
	question: string;
	answers: Answer[];
}

export interface GeneratedGameResponse {
	difficulty: string;
	topic: string;
	questions: Question[];
}
