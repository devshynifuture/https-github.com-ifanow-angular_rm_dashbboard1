import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewLifeInsComponent } from './add-new-life-ins.component';

describe('AddNewLifeInsComponent', () => {
  let component: AddNewLifeInsComponent;
  let fixture: ComponentFixture<AddNewLifeInsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewLifeInsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewLifeInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
