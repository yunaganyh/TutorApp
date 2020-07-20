import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';
import { Question } from '../question';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
  }

  addQuestion(submitter:string, description: string): void {
  	submitter: submitter.trim();
  	description: description.trim();
  	if (!submitter || !description) {
  		alert("Please fill out both fields.");
  		return;
  	}
    let newQuestion = null;
  	this.questionService.addQuestion(submitter, description)
  		.subscribe(question => {
  			alert("Your question has been submitted.");
  		}) 
    }

}
