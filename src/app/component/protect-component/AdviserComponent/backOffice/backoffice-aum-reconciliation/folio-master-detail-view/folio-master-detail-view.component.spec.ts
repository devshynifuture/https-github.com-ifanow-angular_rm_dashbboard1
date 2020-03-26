import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolioMasterDetailViewComponent } from './folio-master-detail-view.component';

describe('FolioMasterDetailViewComponent', () => {
  let component: FolioMasterDetailViewComponent;
  let fixture: ComponentFixture<FolioMasterDetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolioMasterDetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolioMasterDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
