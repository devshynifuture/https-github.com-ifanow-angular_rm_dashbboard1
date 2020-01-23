import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientWiseComponent } from './client-wise.component';

describe('ClientWiseComponent', () => {
  let component: ClientWiseComponent;
  let fixture: ComponentFixture<ClientWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
