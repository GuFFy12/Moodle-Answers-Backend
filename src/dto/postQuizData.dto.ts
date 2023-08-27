import { Type } from 'class-transformer';
import {
	ArrayMinSize,
	IsArray,
	IsNumber,
	IsObject,
	IsString,
	Max,
	Min,
	ValidateIf,
	ValidateNested,
} from 'class-validator';

export class QuestionDataDto {
	@IsString()
	question: string;

	@IsString()
	questionType: string;

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
	name: string;
}

export class PathsDto {
	@IsObject()
	@ValidateNested()
	@Type(() => PathDto)
	course: PathDto;

	@IsObject()
	@ValidateNested()
	@Type(() => PathDto)
	section: PathDto;

	@IsObject()
	@ValidateNested()
	@Type(() => PathDto)
	module: PathDto;
}

export class PostQuizDataDto {
	@IsNumber()
	@Min(0)
	userId: number;

	@IsObject()
	@ValidateNested()
	@Type(() => PathsDto)
	paths: PathsDto;

	@IsNumber()
	@ValidateIf((object, value) => value !== null)
	@Min(0)
	@Max(100)
	percent: number | null;

	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => QuestionDataDto)
	questionsData: QuestionDataDto[];
}
