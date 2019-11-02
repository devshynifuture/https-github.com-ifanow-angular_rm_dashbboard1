import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibilitiesRightComponent } from './libilities-right.component';

describe('LibilitiesRightComponent', () => {
  let component: LibilitiesRightComponent;
  let fixture: ComponentFixture<LibilitiesRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibilitiesRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibilitiesRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
