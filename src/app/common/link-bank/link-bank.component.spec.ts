import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkBankComponent } from './link-bank.component';

describe('LinkBankComponent', () => {
  let component: LinkBankComponent;
  let fixture: ComponentFixture<LinkBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
