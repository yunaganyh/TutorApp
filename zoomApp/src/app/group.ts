import { Question } from './question';

export interface Group {
	gid: number,
	questions: Question[],
	groupRank: number
}