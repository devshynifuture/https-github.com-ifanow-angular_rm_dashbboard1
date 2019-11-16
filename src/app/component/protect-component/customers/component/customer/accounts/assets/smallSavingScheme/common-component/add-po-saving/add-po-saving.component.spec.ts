import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPoSavingComponent } from './add-po-saving.component';

describe('AddPoSavingComponent', () => {
  let component: AddPoSavingComponent;
  let fixture: ComponentFixture<AddPoSavingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPoSavingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPoSavingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
