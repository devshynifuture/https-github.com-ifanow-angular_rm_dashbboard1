import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolioMasterDetailsComponent } from './folio-master-details.component';

describe('FolioMasterDetailsComponent', () => {
  let component: FolioMasterDetailsComponent;
  let fixture: ComponentFixture<FolioMasterDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolioMasterDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolioMasterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
