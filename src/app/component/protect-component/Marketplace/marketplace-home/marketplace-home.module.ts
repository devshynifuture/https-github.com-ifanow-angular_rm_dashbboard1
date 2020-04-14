import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';

import { MarketplaceHomeRoutingModule } from './marketplace-home-routing.module';
import { MarketplaceHomeComponent } from './marketplace-home.component';


@NgModule({
  declarations: [MarketplaceHomeComponent],
  imports: [
    CommonModule,
    MarketplaceHomeRoutingModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class MarketplaceHomeModule { }
