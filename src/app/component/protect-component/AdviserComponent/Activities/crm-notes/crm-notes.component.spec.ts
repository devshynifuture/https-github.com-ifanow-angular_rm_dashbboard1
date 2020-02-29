import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmNotesComponent } from './crm-notes.component';

describe('CrmNotesComponent', () => {
  let component: CrmNotesComponent;
  let fixture: ComponentFixture<CrmNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
