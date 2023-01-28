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
			this.logger.info('getAnswers called');

			const { cmId, question } = req.query as unknown as IGetAnswersBody;

			const questionId = (
				await QuestionModel.findOneAndUpdate({ cmId, question }, {}, { upsert: true, new: true })
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
							_id: '$answer',
							percent: { $avg: '$percent' },
							count: { $sum: 1 },
							updatedAt: { $max: '$createdAt' },
						},
					},
					{
						$sort: { count: -1, percent: -1 },
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
			this.logger.info('postAnswers called');

			const { cmId, percent, answersData } = req.body as IPostAnswerBody;

			const user = await UserModel.findOneAndUpdate({ ip: req.clientIp }, {}, { upsert: true, new: true });

			for (const answerData of answersData) {
				const questionId = (
					await QuestionModel.findOneAndUpdate(
						{ cmId, question: answerData.question },
						{},
						{ upsert: true, new: true }
					)
				)._id;

				await AnswerModel.create({
					user: user._id,
					question: questionId,
					percent,
					answer: answerData.answer,
				});
			}

			return res.status(200).json({ message: 'Answers saved' });
		})();
	};
}
