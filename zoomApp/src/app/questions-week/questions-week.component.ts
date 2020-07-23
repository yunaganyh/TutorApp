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
  currentGroup: Group;
  groups: Group[];
  
  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
  	this.getQuestionsThisWeek();
    this.getGroups();
    this.currentGroup = {gid: 0, questions: [], groupRank: 0};
    this.groups = [];

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

  getGroups(): void {
    this.questionService.getGroups()
      .subscribe(groups => {
        this.formatAndDisplayGroups(groups);
        })
  }

  formatAndDisplayGroups(groups: Group[]): void {
    debugger;
    let maxID = Math.max.apply(Math, groups.map((qn) => {return qn.gid}));
    for (let i=1; i <= maxID; i++) {
      let group = groups.filter(grp => grp.gid == i);
      let questions = [];
      // @todo: Creating the question component by extracting the keys. Find a smarter way to do this.
      for (let j=0; j < group.length; j++) {
        questions.push(this.extractQuestion(group[j]));
      }
      questions = this.questionService.convertTimeStamp(questions);
      this.groups.push({gid: group[0]['gid'], questions: questions, groupRank: group[0]['groupRank']});
    }
  }

  addToGroup(question): void {
    if (!this.currentGroup.questions.includes(question)) {
      this.currentGroup.questions.push(question);
    } else {
      console.log("question is already in group");
    }
  }

  removeFromCurrentGroup(question): void {
    this.currentGroup.questions = this.filterGroupQuestions(this.currentGroup.questions, question);
  }

  editGroup(group: Group): void {
    this.currentGroup = group;
  }

  private filterGroupQuestions(questions, question): Question[] {
    return questions.filter(qn => qn !== question);
  }

  extractQuestion(group: Group): Question {
    let id = group['gid'];
    let question = {
      'description': group['description'],
      'id': group['id'],
      'submitter': group['submitter'],
      'votes': group['votes'],
      'uploadedTime': group['uploadedTime'],
    };
    return question;
  }

  group(): void {
    if (!this.existingGroup(this.currentGroup)) {
      this.questionService.addGroup(this.currentGroup)
        .subscribe(groupedQuestions => {
          this.addGroupToGroups(groupedQuestions);
      });
    } else {
      this.questionService.updateGroup(this.currentGroup)
      .subscribe(groupedQuestions => {
        this.groups = this.groups.filter(grp => grp.gid !== groupedQuestions[0]['gid']);
        this.addGroupToGroups({'group':groupedQuestions});
      });
    }
    this.currentGroup = {gid: 0, questions: [], groupRank: 0};
  }

  private addGroupToGroups(group): void {
    let questions = [];
    const groupQns = group['group']
    for (let i=0; i<groupQns.length; i++) {
      questions.push(this.extractQuestion(groupQns[i]));
    }
    questions = this.questionService.convertTimeStamp(questions);
    this.groups.push({gid: groupQns[0]['gid'], questions: questions, groupRank: groupQns[0]['groupRank']});
  }

  private existingGroup(group: Group): boolean {
    const groupIDs = this.groups.map(grp => grp.gid)
    const isInGroups = groupIDs.includes(group['gid']);
    if (this.groups.length && isInGroups) {
      return true;
    } else {
      return false;
    }
  }

  rank(question): void {

  }

  private questionInThisWeek(question: Question): boolean {
      let qnUpload = question['uploadedTime'];
      return qnUpload >= this.firstDayOfWeek && qnUpload <= this.lastDayOfWeek;
    }
}
