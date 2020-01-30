import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileOrderingHistoricalComponent } from './file-ordering-historical.component';

describe('FileOrderingHistoricalComponent', () => {
  let component: FileOrderingHistoricalComponent;
  let fixture: ComponentFixture<FileOrderingHistoricalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileOrderingHistoricalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileOrderingHistoricalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
