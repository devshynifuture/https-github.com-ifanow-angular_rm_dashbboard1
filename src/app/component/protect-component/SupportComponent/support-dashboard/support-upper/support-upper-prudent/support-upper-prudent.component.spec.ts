import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportUpperPrudentComponent } from './support-upper-prudent.component';

describe('SupportUpperPrudentComponent', () => {
  let component: SupportUpperPrudentComponent;
  let fixture: ComponentFixture<SupportUpperPrudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SupportUpperPrudentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportUpperPrudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
