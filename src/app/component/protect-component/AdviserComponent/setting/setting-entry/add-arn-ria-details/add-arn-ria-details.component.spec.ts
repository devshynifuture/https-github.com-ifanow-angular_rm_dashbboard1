import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArnRiaDetailsComponent } from './add-arn-ria-details.component';

describe('AddArnRiaDetailsComponent', () => {
  let component: AddArnRiaDetailsComponent;
  let fixture: ComponentFixture<AddArnRiaDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddArnRiaDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddArnRiaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
