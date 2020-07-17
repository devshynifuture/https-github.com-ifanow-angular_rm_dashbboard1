import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLiabilitiesMobComponent } from './add-liabilities-mob.component';

describe('AddLiabilitiesMobComponent', () => {
  let component: AddLiabilitiesMobComponent;
  let fixture: ComponentFixture<AddLiabilitiesMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLiabilitiesMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLiabilitiesMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
