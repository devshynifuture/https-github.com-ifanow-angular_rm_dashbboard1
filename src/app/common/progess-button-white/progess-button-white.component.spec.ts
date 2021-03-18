import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgessButtonWhiteComponent } from './progess-button-white.component';

describe('ProgessButtonWhiteComponent', () => {
  let component: ProgessButtonWhiteComponent;
  let fixture: ComponentFixture<ProgessButtonWhiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgessButtonWhiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgessButtonWhiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
