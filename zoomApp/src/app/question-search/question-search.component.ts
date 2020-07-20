import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';
import { Question } from '../question';
import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';


@Component({
  selector: 'app-question-search',
  templateUrl: './question-search.component.html',
  styleUrls: ['./question-search.component.css']
})
export class QuestionSearchComponent implements OnInit {

	questions$: Observable<Question[]>;
	private searchTerms = new Subject<string>();

  constructor(private questionService: QuestionService) { }

  search(term:string): void {
  	this.searchTerms.next(term);
  }

  ngOnInit(): void {
  	// this.questions$ = this.searchTerms.pipe(
  	// 	debounceTime(300),
  	// 	distinctUntilChanged(),
  	// 	switchMap((term:string) => this.questionService.searchQuestions(term)),
  	// );
  }

}
