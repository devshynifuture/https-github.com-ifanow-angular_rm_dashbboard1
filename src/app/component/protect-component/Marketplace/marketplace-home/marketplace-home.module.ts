import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatInputModule} from '@angular/material';

import {MarketplaceHomeRoutingModule} from './marketplace-home-routing.module';
import {MarketplaceHomeComponent} from './marketplace-home.component';


@NgModule({
  declarations: [MarketplaceHomeComponent],
  imports: [
    CommonModule,
    MarketplaceHomeRoutingModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
    MatInputModule
  ]
})
export class MarketplaceHomeModule { }
