import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportDeleteReorderComponent } from './support-delete-reorder.component';

describe('SupportDeleteReorderComponent', () => {
  let component: SupportDeleteReorderComponent;
  let fixture: ComponentFixture<SupportDeleteReorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportDeleteReorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportDeleteReorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
