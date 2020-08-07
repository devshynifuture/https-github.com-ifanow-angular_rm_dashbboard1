import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinorFormComponent } from './minor-form.component';

describe('MinorFormComponent', () => {
  let component: MinorFormComponent;
  let fixture: ComponentFixture<MinorFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinorFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
