import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadingExcelComponent } from './downloading-excel.component';

describe('DownloadingExcelComponent', () => {
  let component: DownloadingExcelComponent;
  let fixture: ComponentFixture<DownloadingExcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadingExcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadingExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
