import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProgressButtonComponent } from './delete-progress-button.component';

describe('DeleteProgressButtonComponent', () => {
  let component: DeleteProgressButtonComponent;
  let fixture: ComponentFixture<DeleteProgressButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteProgressButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteProgressButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
