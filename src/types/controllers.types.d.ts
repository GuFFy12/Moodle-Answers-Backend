export interface IGetAnswersBody {
	cmId: number;
	question: string;
}

export interface IPostAnswerBody {
	readonly cmId: number;
	readonly percent?: number;
	readonly answers: Record<string, string[]>;
}
