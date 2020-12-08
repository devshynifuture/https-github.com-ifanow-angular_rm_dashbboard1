import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestAndGiveAdviceComponent } from './suggest-and-give-advice.component';

describe('SuggestAndGiveAdviceComponent', () => {
  let component: SuggestAndGiveAdviceComponent;
  let fixture: ComponentFixture<SuggestAndGiveAdviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestAndGiveAdviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestAndGiveAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
