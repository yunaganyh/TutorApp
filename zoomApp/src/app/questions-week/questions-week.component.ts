import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';
import { Question } from '../question';
import { Group } from '../group';


@Component({
  selector: 'app-questions-week',
  templateUrl: './questions-week.component.html',
  styleUrls: ['./questions-week.component.css']
})

export class QuestionsWeekComponent implements OnInit {
  
  questions: Question[];
  questionsOfTheWeek: Question[];
  firstDayOfWeek: Date;
  lastDayOfWeek: Date;
  currentGroup: Question[];
  groups: Group[];
  
  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
  	this.getQuestionsThisWeek();
    this.currentGroup = [];
  }

  getQuestionsThisWeek(): void {
    this.questionService.getQuestions()
    .subscribe(questions => {
      this.filterQuestions(questions);
    })
  }

  filterQuestions(questions): void {
    this.questions = this.questionService.convertTimeStamp(questions);
    let today = new Date(new Date().setHours(0,0,0,0));
    let dayInWeek = today.getDay();
    this.firstDayOfWeek = dayInWeek == 1 ? today : new Date(today.setDate(today.getDate() - (dayInWeek + 6) % 7));
    this.lastDayOfWeek = new Date(new Date().setDate(today.getDate() + 7));
    this.questionsOfTheWeek = this.questions.filter(qn => this.questionInThisWeek(qn))
  }

  addToGroup(question): void {
    this.currentGroup.push(question);
    console.log(this.currentGroup);
  }

  group(): void {

  }

  rank(question): void {

  }

  private questionInThisWeek(question: Question): boolean {
      let qnUpload = question['uploadedTime'];
      return qnUpload >= this.firstDayOfWeek && qnUpload <= this.lastDayOfWeek;
    }
}
