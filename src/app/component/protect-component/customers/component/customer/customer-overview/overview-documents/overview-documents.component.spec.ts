import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewDocumentsComponent } from './overview-documents.component';

describe('OverviewDocumentsComponent', () => {
  let component: OverviewDocumentsComponent;
  let fixture: ComponentFixture<OverviewDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
