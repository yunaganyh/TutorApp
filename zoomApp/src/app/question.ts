export interface Question {
	id: number;
	description: string;
	submitter: string;
	uploadedTime: Date;
	votes: number;
}