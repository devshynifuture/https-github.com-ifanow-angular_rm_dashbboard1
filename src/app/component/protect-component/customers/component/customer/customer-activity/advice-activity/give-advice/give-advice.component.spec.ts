import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveAdviceComponent } from './give-advice.component';

describe('GiveAdviceComponent', () => {
  let component: GiveAdviceComponent;
  let fixture: ComponentFixture<GiveAdviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiveAdviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiveAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
