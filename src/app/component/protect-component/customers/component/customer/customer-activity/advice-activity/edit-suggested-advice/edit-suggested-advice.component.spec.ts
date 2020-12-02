import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSuggestedAdviceComponent } from './edit-suggested-advice.component';

describe('EditSuggestedAdviceComponent', () => {
  let component: EditSuggestedAdviceComponent;
  let fixture: ComponentFixture<EditSuggestedAdviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSuggestedAdviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSuggestedAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
