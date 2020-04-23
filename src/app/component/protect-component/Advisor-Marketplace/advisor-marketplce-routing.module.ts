import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdvisorMarketplaceComponent } from './advisor-marketplace/advisor-marketplace.component';
import { MarketplaceProfileComponent } from './advisor-marketplace/marketplace-profile/marketplace-profile.component';
import { MarketplacePostsComponent } from './advisor-marketplace/marketplace-posts/marketplace-posts.component';
import { MarketplaceCallsComponent } from './advisor-marketplace/marketplace-calls/marketplace-calls.component';
import { MarketplaceLeadsComponent } from './advisor-marketplace/marketplace-leads/marketplace-leads.component';
import { MarketplaceChatsComponent } from './advisor-marketplace/marketplace-chats/marketplace-chats.component';
import { MarketplaceReviewRatingComponent } from './advisor-marketplace/marketplace-review-rating/marketplace-review-rating.component';


const routes: Routes = [
  {
    path: '',
    component: AdvisorMarketplaceComponent,
    children: [
      {
        path: 'profile',
        component: MarketplaceProfileComponent
      },
      {
        path: 'leads',
        component: MarketplaceLeadsComponent
      },
      {
        path: 'posts',
        component: MarketplacePostsComponent
      },
      {
        path: 'chats',
        component: MarketplaceChatsComponent
      },
      {
        path: 'calls',
        component: MarketplaceCallsComponent
      },
      {
        path: 'reviewRating',
        component: MarketplaceReviewRatingComponent
      },
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvisorMarketplceRoutingModule { }
