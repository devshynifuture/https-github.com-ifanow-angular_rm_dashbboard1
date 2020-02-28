import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileOrderingSetupComponent } from './file-ordering-setup.component';

describe('FileOrderingSetupComponent', () => {
  let component: FileOrderingSetupComponent;
  let fixture: ComponentFixture<FileOrderingSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileOrderingSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileOrderingSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
