export interface IGetAnswersBody {
	cmId: number;
	question: string;
}

export interface IPostAnswerBody {
	readonly cmId: number;
	readonly percent?: number;
	readonly answersData: IAnswer[];
}

export interface IAnswer {
	question: string;
	answer: string[];
}
