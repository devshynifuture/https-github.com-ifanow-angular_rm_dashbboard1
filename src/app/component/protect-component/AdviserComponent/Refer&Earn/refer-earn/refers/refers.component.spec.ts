import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefersComponent } from './refers.component';

describe('RefersComponent', () => {
  let component: RefersComponent;
  let fixture: ComponentFixture<RefersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
