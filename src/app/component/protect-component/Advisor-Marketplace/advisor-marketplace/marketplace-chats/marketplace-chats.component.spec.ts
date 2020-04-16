import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceChatsComponent } from './marketplace-chats.component';

describe('MarketplaceChatsComponent', () => {
  let component: MarketplaceChatsComponent;
  let fixture: ComponentFixture<MarketplaceChatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceChatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
