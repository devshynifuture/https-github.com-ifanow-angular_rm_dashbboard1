import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDematComponent } from './client-demat.component';

describe('ClientDematComponent', () => {
  let component: ClientDematComponent;
  let fixture: ComponentFixture<ClientDematComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientDematComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDematComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
