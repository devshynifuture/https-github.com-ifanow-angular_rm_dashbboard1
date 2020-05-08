import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoCredFoundComponent } from './no-cred-found.component';

describe('NoCredFoundComponent', () => {
  let component: NoCredFoundComponent;
  let fixture: ComponentFixture<NoCredFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoCredFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoCredFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
