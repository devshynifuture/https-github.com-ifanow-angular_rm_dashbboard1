import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IinCreationLoaderComponent} from './iin-creation-loader.component';

describe('IinCreationLoaderComponent', () => {
  let component: IinCreationLoaderComponent;
  let fixture: ComponentFixture<IinCreationLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IinCreationLoaderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IinCreationLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
