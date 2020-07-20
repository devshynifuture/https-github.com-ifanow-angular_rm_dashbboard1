import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CustomDialogContainerComponent} from './custom-dialog-container.component';

describe('CustomDialogContainerComponent', () => {
  let component: CustomDialogContainerComponent;
  let fixture: ComponentFixture<CustomDialogContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomDialogContainerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDialogContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
