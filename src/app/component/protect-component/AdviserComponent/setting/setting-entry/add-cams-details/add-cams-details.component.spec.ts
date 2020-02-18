import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCamsDetailsComponent } from './add-cams-details.component';

describe('AddCamsDetailsComponent', () => {
  let component: AddCamsDetailsComponent;
  let fixture: ComponentFixture<AddCamsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCamsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCamsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
