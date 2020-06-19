import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientQuotationsComponent } from './client-quotations.component';

describe('ClientQuotationsComponent', () => {
  let component: ClientQuotationsComponent;
  let fixture: ComponentFixture<ClientQuotationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientQuotationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientQuotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
