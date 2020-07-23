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
  
  // Store all the questions
  questions: Question[];

  // Store questions uploaded this week. Currently a monday-sunday week.
  questionsOfTheWeek: Question[];

  // First day of the week - Monday midnight - in milliseconds since '1970-01-01 00:00:00' UTC.
  firstDayOfWeek: string;

  // Last day of the week - Sunday midnight - in milliseconds since '1970-01-01 00:00:00' UTC.
  lastDayOfWeek: string;

  // Current questions selected for grouping.
  currentGroup: Group;

  // All groups of questions already grouped.
  groups: Group[];
  
  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {

  	this.getQuestionsThisWeek();
    this.getGroups();

    // Initialize current group to "empty" values.
    this.currentGroup = {gid: 0, questions: [], groupRank: 0};

    // Initialize groups to empty array.
    this.groups = [];
  }

  /** 
   Get questions from the database filtered by uploaded time.
   The start of the timeframe is the first day of the week - Monday midnight of this week.
   The end of the timeframe is the last day of the week to Sunday midnight of this week.
  **/
  getQuestionsThisWeek(): void {
    let today = new Date(new Date().setHours(0,0,0,0));
    let dayInWeek = today.getDay();
    let firstDayOfWeek = dayInWeek == 1 ? today : new Date(today.setDate(today.getDate() - (dayInWeek + 6) % 7));
    let lastDayOfWeek = new Date(new Date().setDate(today.getDate() + 7));
    this.firstDayOfWeek = (firstDayOfWeek.getTime()).toString();
    this.lastDayOfWeek = (lastDayOfWeek.getTime()).toString();
    this.questionService.getCurrentQuestions(this.firstDayOfWeek, this.lastDayOfWeek)
    .subscribe(questions => {
      this.questionsOfTheWeek = this.questionService.convertTimeStamp(questions);
    })
  }

  // Get all groups from the database.
  getGroups(): void {
    this.questionService.getGroups()
      .subscribe(groups => {
        this.formatAndDisplayGroups(groups);
        })
  }

  /** 
   The questions in groups come back as an array and are sorted and grouped before they can be displayed.
  **/
  formatAndDisplayGroups(groups: Group[]): void {
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

  /**
   Add a question to the current group.
  **/
  addToGroup(question): void {
    if (!this.currentGroup.questions.includes(question)) {
      this.currentGroup.questions.push(question);
    } else {
      console.log("question is already in group");
    }
  }

 /**
  Remove a question from the current group.
 **/
  removeFromCurrentGroup(question): void {
    this.currentGroup.questions = this.filterGroupQuestions(this.currentGroup.questions, question);
  }

  /**
   Edit a group by making the current group that can have questions added to and removed from it.
  **/
  editGroup(group: Group): void {
    this.currentGroup = group;
  }

  /**
   Filter a given question from an array of questions.
  **/
  private filterGroupQuestions(questions, question): Question[] {
    return questions.filter(qn => qn !== question);
  }

  /**
   Extract the question properties from a given group object.
  **/
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

  /**
   Update the group in the database if the current group is currently being edited.
   Add the group to the database if the group is new.
   Reset the current group properties after changes have been made.
  **/
  group(): void {
    if (!this.existingGroup(this.currentGroup)) {
      this.questionService.addGroup(this.currentGroup)
        .subscribe(groupedQuestions => {
          this.addGroupToGroups(groupedQuestions);
      });
    } else {
      this.questionService.updateGroup(this.currentGroup)
      .subscribe(() => alert('Group was updated'));
    }
    this.currentGroup = {gid: 0, questions: [], groupRank: 0};
  }

  /**
   Extracts questions from the group questions returned from the database.
   Formats the uploaded time for the questions and add it to the array of groups.
  **/
  private addGroupToGroups(group): void {
    let questions = [];
    const groupQns = group['group']
    for (let i=0; i<groupQns.length; i++) {
      questions.push(this.extractQuestion(groupQns[i]));
    }
    questions = this.questionService.convertTimeStamp(questions);
    this.groups.push({gid: groupQns[0]['gid'], questions: questions, groupRank: groupQns[0]['groupRank']});
  }

  /**
   Checks if a group is existing by checking if its group id is in the this.groups array of groups.
  **/
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
}
