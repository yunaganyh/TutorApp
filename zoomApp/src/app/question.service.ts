import { Injectable } from '@angular/core';
import { Question } from './question';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private url = 'http://127.0.0.1:5050';
  httpOptions = {
    headers: new HttpHeaders({ 
    	'Content-Type': 'application/json',
    	'Access-Control-Allow-Origin': '*',
    	'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
    	'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Origin, Authorization',
    	'crossOrigin': 'true',
    	})
  };

  questions: Question[];

  constructor(private http: HttpClient) { }

  getQuestions(): Observable<Question[]> {
    const qns = this.http.get<Question[]>(`${this.url}/questions`)
    	.pipe(
    		tap(_ => this.log('fetched questions')),
    		catchError(this.handleError<Question[]>('getQuestions', []))
    		)
    qns.subscribe(questions => {
      this.questions = questions;
    })
    return qns;
  }

  retrieveQuestions(): Question[] {
    return this.questions;
  }

  convertTimeStamp(questions): Question[] {
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      question['uploadedTime'] = new Date(question['uploadedTime'] * 1000);
    }
    return questions;
  }
 
  addQuestion(submitter:string, description:string): Observable<Question> {
  	const question = {
  		'submitter': submitter, 
  		'description': description,
  		'votes': 0
  		};
      debugger;
  	return this.http.post<Question>(`${this.url}/questions`, question, this.httpOptions)
  		.pipe(
	  		tap((newQuestion: Question) => this.log(`added question with ID ${newQuestion[0]['id']}`)),
	  		catchError(this.handleError<Question>('addQuestion'))
  		);
  }

  updateQuestion(question: Question): Observable<any> {
    console.log("updating question");
    return this.http.put(`${this.url}/questions`, question, this.httpOptions).pipe(
      tap(_ => this.log(`updated question with id=${question.id} with votes=${question.votes}`)),
      catchError(this.handleError<any>('updateVote'))
      );
  }

  // @todo: implement searching for questions 
  // searchQuestions(term: string): Observable<Question[]> {
  //   if (!term.trim()) {
  //     return of([]);
  //   }
    
  // }

  private log(message: string) {
  	console.log(`QuestionService: ${message}`);
  }

  private handleError<T>(operation='operation', result?:T) {
    return (error:any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }  
}
