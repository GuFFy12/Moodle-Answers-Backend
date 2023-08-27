import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Md5 } from 'ts-md5';

import { PathsDto, QuestionDataDto } from './dto/postQuizData.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
	constructor(private prisma: PrismaService) {}

	async getAnswersGroupedByQuestion(questionWhereInput: Prisma.QuestionWhereInput, { skip = 0, take = 5 }) {
		const groupedAnswers = this.prisma.answer.groupBy({
			by: ['answers'],
			where: { question: questionWhereInput },
			orderBy: [{ _count: { answers: 'desc' } }, { _avg: { percent: 'desc' } }],
			_avg: { percent: true },
			_count: { answers: true },
			_max: { createdAt: true },
			skip,
			take,
		});

		const answersCount = this.prisma.answer.count({ where: { question: questionWhereInput } });

		return Object.fromEntries(
			await Promise.all(
				Object.entries({
					groupedAnswers,
					answersCount,
				}).map(async ([k, v]) => [k, await v]),
			),
		);
	}

	async upsertUserPathsQuestionAndCreateAnswers(
		userCreateInput: Prisma.UserCreateInput,
		courseCreateInput: Prisma.CourseCreateInput,
		sectionCreateInput: Prisma.SectionCreateWithoutCourseInput,
		moduleCreateInput: Prisma.ModuleCreateWithoutSectionInput,
		percent: number | null,
		questionsData: QuestionDataDto[],
	) {
		const user = await this.prisma.user.upsert({
			where: { id: userCreateInput.id },
			create: userCreateInput,
			update: { lastIp: userCreateInput.lastIp },
		});

		const course = await this.prisma.course.upsert({
			where: { id: courseCreateInput.id },
			create: courseCreateInput,
			update: {},
		});

		const section = await this.prisma.section.upsert({
			where: {
				courseId_sectionId: {
					courseId: course.id,
					sectionId: sectionCreateInput.sectionId,
				},
			},
			create: {
				courseId: course.id,
				sectionId: sectionCreateInput.sectionId,
				name: sectionCreateInput.name,
			},
			update: {},
		});

		const module = await this.prisma.module.upsert({
			where: { id: moduleCreateInput.id },
			create: {
				sectionId: section.id,
				id: moduleCreateInput.id,
				name: moduleCreateInput.name,
			},
			update: {},
		});

		return Promise.all(
			questionsData.map((questionData) => {
				const question_questionType_answerOptions_md5 = Md5.hashStr(
					questionData.question + questionData.questionType + questionData.answerOptions.join(),
				);

				return this.prisma.question.upsert({
					where: {
						moduleId_question_questionType_answerOptions_md5: {
							moduleId: module.id,
							question_questionType_answerOptions_md5,
						},
					},
					create: {
						moduleId: module.id,
						question_questionType_answerOptions_md5,
						question: questionData.question,
						questionType: questionData.questionType,
						answerOptions: questionData.answerOptions,
						answers: {
							create: {
								userId: user.id,
								percent,
								answers: questionData.answers,
							},
						},
					},
					update: {
						answers: {
							create: {
								userId: user.id,
								percent,
								answers: questionData.answers,
							},
						},
					},
					select: {
						moduleId: true,
						question: true,
						answerOptions: true,
					},
				});
			}),
		);
	}
}
