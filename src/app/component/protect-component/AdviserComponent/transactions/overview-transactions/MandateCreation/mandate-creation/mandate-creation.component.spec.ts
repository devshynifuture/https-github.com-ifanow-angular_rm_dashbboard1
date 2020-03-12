import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateCreationComponent } from './mandate-creation.component';

describe('MandateCreationComponent', () => {
  let component: MandateCreationComponent;
  let fixture: ComponentFixture<MandateCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
