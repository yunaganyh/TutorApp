import { Question } from './question';

/**
 Interface for a group of questions.
**/
export interface Group {
	gid: number,
	questions: Question[],
	groupRank: number
}