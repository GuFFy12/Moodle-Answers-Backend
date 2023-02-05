import { Request, Response } from 'express';
import log4js, { Logger } from 'log4js';

import AnswerModel from '../models/answer.model.js';
import QuestionModel from '../models/question.model.js';
import UserModel from '../models/user.model.js';
import { IGetAnswersBody, IPostAnswerBody } from '../types/controllers.types.js';

export default class AnswersController {
	private readonly logger: Logger;

	public constructor() {
		this.logger = log4js.getLogger(this.constructor.name);
	}

	public readonly getAnswers = (req: Request, res: Response) => {
		void (async () => {
			const { cmId, question, answersOptions } = req.body as IGetAnswersBody;

			const questionId = (
				await QuestionModel.findOneAndUpdate(
					{ cmId, question, answersOptions },
					{},
					{ upsert: true, new: true }
				)
			)._id;

			return res.status(200).json(
				await AnswerModel.aggregate([
					{
						$match: {
							question: questionId,
						},
					},
					{
						$group: {
							_id: '$answers',
							percent: { $avg: '$percent' },
							count: { $sum: 1 },
							updatedAt: { $max: '$createdAt' },
						},
					},
					{
						$sort: { percent: -1, count: -1 },
					},
					{
						$limit: 3,
					},
				])
			);
		})();
	};

	public readonly postAnswers = (req: Request, res: Response) => {
		void (async () => {
			const { cmId, percent, questionsData } = req.body as IPostAnswerBody;

			const user = await UserModel.findOneAndUpdate(
				{ ip: req.clientIp },
				{ updatedAt: Date.now() },
				{ upsert: true, new: true }
			);

			for (const questionData of questionsData) {
				const questionId = (
					await QuestionModel.findOneAndUpdate(
						{ cmId, question: questionData.question, answersOptions: questionData.answersOptions },
						{},
						{ upsert: true, new: true }
					)
				)._id;

				await AnswerModel.create({
					user: user._id,
					question: questionId,
					percent,
					answers: questionData.answers,
				});
			}

			return res.status(200).json({ message: 'Quiz Data saved' });
		})();
	};
}
