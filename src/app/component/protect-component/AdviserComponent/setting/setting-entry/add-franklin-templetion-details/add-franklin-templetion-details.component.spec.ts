import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFranklinTempletionDetailsComponent } from './add-franklin-templetion-details.component';

describe('AddFranklinTempletionDetailsComponent', () => {
  let component: AddFranklinTempletionDetailsComponent;
  let fixture: ComponentFixture<AddFranklinTempletionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFranklinTempletionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFranklinTempletionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
