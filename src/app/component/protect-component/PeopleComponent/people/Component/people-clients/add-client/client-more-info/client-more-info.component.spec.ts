import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientMoreInfoComponent } from './client-more-info.component';

describe('ClientMoreInfoComponent', () => {
  let component: ClientMoreInfoComponent;
  let fixture: ComponentFixture<ClientMoreInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientMoreInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientMoreInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
