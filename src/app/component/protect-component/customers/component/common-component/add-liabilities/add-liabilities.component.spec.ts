import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLiabilitiesComponent } from './add-liabilities.component';

describe('AddLiabilitiesComponent', () => {
  let component: AddLiabilitiesComponent;
  let fixture: ComponentFixture<AddLiabilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLiabilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLiabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
