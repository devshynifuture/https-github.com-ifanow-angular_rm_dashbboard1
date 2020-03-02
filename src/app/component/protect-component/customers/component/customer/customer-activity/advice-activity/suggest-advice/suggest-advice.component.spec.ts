import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestAdviceComponent } from './suggest-advice.component';

describe('SuggestAdviceComponent', () => {
  let component: SuggestAdviceComponent;
  let fixture: ComponentFixture<SuggestAdviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestAdviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
