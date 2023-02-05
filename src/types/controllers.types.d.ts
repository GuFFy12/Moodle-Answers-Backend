export interface IGetAnswersBody {
	readonly cmId: number;
	readonly question: string;
	readonly answersOptions: string[];
}

export interface IPostAnswerBody {
	readonly cmId: number;
	readonly percent?: number;
	readonly questionsData: IAnswer[];
}

export interface IAnswer {
	readonly question: string;
	readonly answersOptions: string[];
	readonly answers: string[];
}
