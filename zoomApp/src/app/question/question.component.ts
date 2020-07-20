import { Component, OnInit, Input } from '@angular/core';
import { QuestionService } from '../question.service';
import { Question } from '../question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  constructor(private questionService: QuestionService) { }

  @Input() question: Question;
  @Input() showVoting: boolean;

  ngOnInit(): void {}

  upvote(question: Question): void {
      this.changeVote(question, 1);
    }

    downvote(question: Question): void {
      this.changeVote(question, -1);
    }

    private changeVote(question: Question, change: number): void {
      question['votes'] = question['votes'] + change;
      this.questionService.updateQuestion(question)
        .subscribe(() => console.log('updated'));
    }
}
