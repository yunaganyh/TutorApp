import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionsComponent } from './questions/questions.component';
import { QuestionsWeekComponent } from './questions-week/questions-week.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { QuestionSearchComponent } from './question-search/question-search.component';

const routes: Routes = [
	{path: 'add', component: AddQuestionComponent},
	{path: 'current', component: QuestionsWeekComponent},
	{path: 'all', component: QuestionsComponent},
  // {path: 'search', component: QuestionSearchComponent},
	{path: '', redirectTo: '/current', pathMatch: 'full'}
]

/**
* @todo: see if PathLocationStrategy can be implemented by allowing server side routing
* currently all links will have a hash (#) on them - PathLocationStrategy allows for URLs without it
*/
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {useHash: true})
  ],
  exports: [
  	RouterModule
  ]
})
export class AppRoutingModule { }
