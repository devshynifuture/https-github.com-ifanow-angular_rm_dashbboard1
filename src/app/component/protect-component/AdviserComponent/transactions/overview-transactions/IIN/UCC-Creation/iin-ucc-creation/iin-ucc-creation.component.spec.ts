import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IinUccCreationComponent } from './iin-ucc-creation.component';

describe('IinUccCreationComponent', () => {
  let component: IinUccCreationComponent;
  let fixture: ComponentFixture<IinUccCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IinUccCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IinUccCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
