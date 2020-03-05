import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDetailsInnComponent } from './contact-details-inn.component';

describe('ContactDetailsInnComponent', () => {
  let component: ContactDetailsInnComponent;
  let fixture: ComponentFixture<ContactDetailsInnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactDetailsInnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDetailsInnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
