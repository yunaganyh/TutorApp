import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';
import { Question } from '../question';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  questions: Question[];
  firstDayOfWeek: Date;
  lastDayOfWeek: Date;

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
  	this.getQuestions();
  }

  getQuestions(): void {
    this.questionService.getQuestions()
    .subscribe(questions => {
    this.questions = this.questionService.convertTimeStamp(questions);
    })
  }

}