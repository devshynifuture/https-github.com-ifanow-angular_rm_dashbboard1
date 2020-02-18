import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportUpperComponent } from './support-upper.component';

describe('SupportUpperComponent', () => {
  let component: SupportUpperComponent;
  let fixture: ComponentFixture<SupportUpperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SupportUpperComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportUpperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
