export interface IGetAnswersBody {
	cmId: string;
	questionId: string;
}

export interface IPostAnswerBody {
	readonly cmId: number;
	readonly questionId: number;
	readonly percent?: number;
	readonly answers: Record<string, string>;
}
