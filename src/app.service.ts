import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Md5 } from 'ts-md5';

import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
	constructor(private prisma: PrismaService) {}

	getAnswersGroupedByQuestion(questionWhereInput: Prisma.QuestionWhereInput, skip = 0, take = 5) {
		//TODO: Nulls last
		return this.prisma.answer.groupBy({
			by: ['answers'],
			where: { question: questionWhereInput },
			orderBy: [{ _count: { answers: 'desc' } }, { _avg: { percent: 'desc' } }],
			_avg: { percent: true },
			_count: { answers: true },
			_max: { createdAt: true },
			skip,
			take,
		});
	}

	upsertUser(userCreateWithoutAnswersInput: Prisma.UserUncheckedCreateWithoutAnswersInput) {
		return this.prisma.user.upsert({
			where: { id: userCreateWithoutAnswersInput.id },
			create: userCreateWithoutAnswersInput,
			update: { lastIp: userCreateWithoutAnswersInput.lastIp },
		});
	}

	upsertCourse(courseUncheckedCreateInput: Prisma.CourseUncheckedCreateInput) {
		return this.prisma.course.upsert({
			where: { id: courseUncheckedCreateInput.id },
			create: courseUncheckedCreateInput,
			update: {},
		});
	}

	upsertSection(sectionUncheckedCreateInput: Prisma.SectionUncheckedCreateInput) {
		return this.prisma.section.upsert({
			where: {
				courseId_sectionId: {
					courseId: sectionUncheckedCreateInput.courseId,
					sectionId: sectionUncheckedCreateInput.sectionId,
				},
			},
			create: sectionUncheckedCreateInput,
			update: {},
		});
	}

	upsertModule(moduleUncheckedCreateInput: Prisma.ModuleUncheckedCreateInput) {
		return this.prisma.module.upsert({
			where: { id: moduleUncheckedCreateInput.id },
			create: moduleUncheckedCreateInput,
			update: {},
		});
	}

	async upsertQuestionAndCreateAnswer(
		moduleId: number,
		question: string,
		answerOptions: string[],
		answerCreateManyQuestionInput: Prisma.AnswerCreateManyQuestionInput,
	) {
		const question_answerOptions_md5 = Md5.hashStr(question + answerOptions.join());

		return this.prisma.question.upsert({
			where: {
				moduleId_question_answerOptions_md5: { moduleId, question_answerOptions_md5 },
			},
			create: {
				moduleId,
				question_answerOptions_md5,
				question,
				answerOptions,
				answers: {
					create: answerCreateManyQuestionInput,
				},
			},
			update: {
				answers: {
					create: answerCreateManyQuestionInput,
				},
			},
			select: {
				moduleId: true,
				question: true,
				answerOptions: true,
			},
		});
	}
}
