import mongoose from 'mongoose';

import { IQuestionSchema } from '../types/models.types.js';

const { model, Schema } = mongoose;

const QuestionSchema = new Schema(
	{
		cmId: Schema.Types.Number,
		question: Schema.Types.String,
		answersOptions: [Schema.Types.String],
	},
	{ timestamps: { createdAt: true, updatedAt: false } }
);

export default model<IQuestionSchema>('Questions', QuestionSchema);
