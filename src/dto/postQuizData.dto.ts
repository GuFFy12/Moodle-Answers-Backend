import { Transform, Type } from 'class-transformer';
import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min,
	ValidateNested,
} from 'class-validator';

export class QuestionDataDto {
	@IsString()
	@IsNotEmpty()
	question: string;

	@IsArray()
	@IsString({ each: true })
	answerOptions: string[];

	@IsArray()
	@IsString({ each: true })
	answers: string[];
}

export class PathDto {
	@IsNumber()
	@Min(1)
	id: number;

	@IsString()
	@IsNotEmpty()
	name: string;
}

export class PostQuizDataDto {
	@IsNumber()
	@Min(1)
	userId: number;

	paths: {
		course: PathDto;
		section: PathDto;
		module: PathDto;
	};

	@IsNumber()
	@IsOptional()
	@Min(0)
	@Max(100)
	percent?: number | null;

	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => QuestionDataDto)
	questionsData: QuestionDataDto[];
}
