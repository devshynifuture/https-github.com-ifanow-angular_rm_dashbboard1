import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveFamilymemberToClientComponent } from './move-familymember-to-client.component';

describe('MoveFamilymemberToClientComponent', () => {
  let component: MoveFamilymemberToClientComponent;
  let fixture: ComponentFixture<MoveFamilymemberToClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveFamilymemberToClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveFamilymemberToClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
