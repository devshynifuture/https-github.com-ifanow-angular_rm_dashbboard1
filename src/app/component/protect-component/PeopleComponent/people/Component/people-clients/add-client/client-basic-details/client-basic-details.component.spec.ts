import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBasicDetailsComponent } from './client-basic-details.component';

describe('ClientBasicDetailsComponent', () => {
  let component: ClientBasicDetailsComponent;
  let fixture: ComponentFixture<ClientBasicDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientBasicDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientBasicDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
