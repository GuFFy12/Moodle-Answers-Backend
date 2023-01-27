export interface IGetAnswersBody {
	cmId: number;
	questionId: string;
}

export interface IPostAnswerBody {
	readonly cmId: number;
	readonly questionId: string;
	readonly percent?: number;
	readonly answers: Record<string, string>;
}
