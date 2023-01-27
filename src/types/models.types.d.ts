import mongoose from 'mongoose';

export interface ISettingsSchema {
	readonly port: number;
	readonly windowMs: number;
	readonly max: number;
	readonly maxLogSize: number;
	readonly maxLogBackups: number;
}

export interface IAnswerSchema {
	readonly user: mongoose.Types.ObjectId;
	readonly question: mongoose.Types.ObjectId;
	readonly percent?: number;
	readonly answer: string[];
	readonly createdAt: Date;
}

export interface IQuestionSchema {
	readonly cmId: number;
	readonly questionId: string;
	readonly createdAt: Date;
}

export interface IUserSchema {
	readonly ip: string;
	readonly createdAt: Date;
}
