import { Injectable } from '@angular/core';
import { Question } from './question';
import { Group } from './group';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  /**
   Get all groups from the database.
  **/
  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.url}/groups`)
      .pipe(
        tap(_ => this.log('fetched groups')),
        catchError(this.handleError<Group[]>('getGroups', []))
        );
  }

  /**
   Post the given group to the database.
  **/
  addGroup(group: Group) {
    return this.http.post(`${this.url}/groups`, group, this.httpOptions)
      .pipe(
        tap((newGroup) => this.log(`added group with ID ${newGroup['group'][0]['gid']}`)),
        catchError(this.handleError<Group>('addGroup'))
        );
  }

  /**
   Update the given group in the database.
  **/
  updateGroup(group: Group) {
    return this.http.put(`${this.url}/groups`, group, this.httpOptions).pipe(
      tap(_ => this.log(`updated group with id=${group.gid}`)),
      catchError(this.handleError<any>('updateGroup'))
      );
  }

  /**
   Get all questions from the database.
   Store all questions in a local array for future usage to reduce calls to the database. Not in use yet. 
  */
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

  getCurrentQuestions(startDate: string, endDate: string): Observable<Question[]> {
    const timeFrame = {'startDate': startDate, 'endDate': endDate};
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<Question[]>(`${this.url}/currentQuestions`, {headers: this.httpOptions.headers, params: params})
      .pipe(
        tap(_ => this.log('fetched current questions')),
        catchError(this.handleError<Question[]>('getQuestions', []))
        )
  }

  /**
   @todo: find a way to reduce calls to the database
   Add question first to this.questions and then add it to the database?
   Could solve issues with having to convert the timestamp
   But have to be careful about how the time is stored so that it shows correctly for different timezones
  **/
  retrieveQuestions(): Question[] {
    return this.questions;
  }

  /**
   Post a question to the database with the given submitter and description strings. Votes will all be initialized to 0.
   Returns the new inserted database entry so that we can display it immediately.
  **/
  addQuestion(submitter:string, description:string): Observable<Question> {
  	const question = {
  		'submitter': submitter, 
  		'description': description,
  		'votes': 0
  		};
  	return this.http.post<Question>(`${this.url}/questions`, question, this.httpOptions)
  		.pipe(
	  		tap((newQuestion: Question) => this.log(`added question with ID ${newQuestion[0]['id']}`)),
	  		catchError(this.handleError<Question>('addQuestion'))
  		);
  }

  /**
   Puts an update for the given question in the database.
  **/
  updateQuestion(question: Question): Observable<any> {
    console.log("updating question");
    return this.http.put(`${this.url}/questions`, question, this.httpOptions).pipe(
      tap(_ => this.log(`updated question with id=${question.id} with votes=${question.votes}`)),
      catchError(this.handleError<any>('updateVote'))
      );
  }

  /**
   To properly format the uploaded time for a question, we retrieve it as a unix_timestamp, which is the 
   number of seconds since '1970-01-01 00:00:00' UTC at which the question was posted.
   We convert it to a Date object to properly format the time for the local timezone.
  **/
  convertTimeStamp(questions): Question[] {
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      question['uploadedTime'] = new Date(question['uploadedTime'] * 1000);
    }
    return questions;
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
