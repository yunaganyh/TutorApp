import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsWeekComponent } from './questions-week.component';

describe('QuestionsWeekComponent', () => {
  let component: QuestionsWeekComponent;
  let fixture: ComponentFixture<QuestionsWeekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsWeekComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
