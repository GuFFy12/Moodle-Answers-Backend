export interface IGetAnswersBody {
	readonly cmId: string;
	readonly questionId: string;
}

export interface IPostAnswerBody {
	readonly cmId: number;
	readonly questionId: number;
	readonly answerType: string;
	readonly percent: number;
	readonly answers: Record<string, string>;
}
