import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaceUserComponent } from './replace-user.component';

describe('ReplaceUserComponent', () => {
  let component: ReplaceUserComponent;
  let fixture: ComponentFixture<ReplaceUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplaceUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplaceUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
