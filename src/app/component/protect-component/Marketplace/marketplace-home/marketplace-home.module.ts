import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarketplaceHomeRoutingModule } from './marketplace-home-routing.module';
import { MarketplaceHomeComponent } from './marketplace-home.component';


@NgModule({
  declarations: [MarketplaceHomeComponent],
  imports: [
    CommonModule,
    MarketplaceHomeRoutingModule
  ]
})
export class MarketplaceHomeModule { }
