import { Question } from './question';

export interface Group {
	groupID: number,
	questions: Question[],
	rank: number
}