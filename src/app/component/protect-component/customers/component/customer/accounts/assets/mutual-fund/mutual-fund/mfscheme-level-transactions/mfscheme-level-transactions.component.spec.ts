import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MFSchemeLevelTransactionsComponent } from './mfscheme-level-transactions.component';

describe('MFSchemeLevelTransactionsComponent', () => {
  let component: MFSchemeLevelTransactionsComponent;
  let fixture: ComponentFixture<MFSchemeLevelTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MFSchemeLevelTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MFSchemeLevelTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
