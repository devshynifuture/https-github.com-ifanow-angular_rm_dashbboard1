import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrPageOpenComponent } from './err-page-open.component';

describe('ErrPageOpenComponent', () => {
  let component: ErrPageOpenComponent;
  let fixture: ComponentFixture<ErrPageOpenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrPageOpenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrPageOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
