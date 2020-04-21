import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { AdvisorMarketplceRoutingModule } from './advisor-marketplce-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdvisorMarketplaceComponent } from './advisor-marketplace/advisor-marketplace.component';
import { MarketplaceProfileComponent } from './advisor-marketplace/marketplace-profile/marketplace-profile.component';
import { MarketplaceLeadsComponent } from './advisor-marketplace/marketplace-leads/marketplace-leads.component';
import { MarketplacePostsComponent } from './advisor-marketplace/marketplace-posts/marketplace-posts.component';
import { MarketplaceChatsComponent } from './advisor-marketplace/marketplace-chats/marketplace-chats.component';
import { MarketplaceCallsComponent } from './advisor-marketplace/marketplace-calls/marketplace-calls.component';
import { MarketplaceReviewRatingComponent } from './advisor-marketplace/marketplace-review-rating/marketplace-review-rating.component';
import {MatTableModule} from '@angular/material/table';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';

import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  declarations: [
    AdvisorMarketplaceComponent,
    MarketplaceProfileComponent,
    MarketplaceLeadsComponent,
    MarketplacePostsComponent,
    MarketplaceChatsComponent,
    MarketplaceCallsComponent,
    MarketplaceReviewRatingComponent,
    

  ],
  imports: [
    CommonModule,
    AdvisorMarketplceRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    MatProgressBarModule,
    MatTableModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule
  ]
})
export class AdvisorMarketplceModule { }
