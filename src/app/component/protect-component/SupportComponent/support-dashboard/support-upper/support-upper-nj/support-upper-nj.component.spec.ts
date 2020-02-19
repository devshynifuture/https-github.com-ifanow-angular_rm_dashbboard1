import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportUpperNjComponent } from './support-upper-nj.component';

describe('SupportUpperNjComponent', () => {
  let component: SupportUpperNjComponent;
  let fixture: ComponentFixture<SupportUpperNjComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SupportUpperNjComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportUpperNjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
