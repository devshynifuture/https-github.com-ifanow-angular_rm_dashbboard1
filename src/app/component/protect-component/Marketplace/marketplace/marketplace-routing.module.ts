import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketplaceComponent } from './marketplace.component';

const routes: Routes = [{
  path: '', component: MarketplaceComponent,
  children: [
    { path: 'home', loadChildren: () => import('../marketplace-home/marketplace-home.module').then(m => m.MarketplaceHomeModule) },
    { path: 'experts', loadChildren: () => import('../experts/experts.module').then(m => m.ExpertsModule) },
    { path: 'chat', loadChildren: () => import('../chat/chat.module').then(m => m.ChatModule) },
    { path: 'learn', loadChildren: () => import('../learn/learn.module').then(m => m.LearnModule) },
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full'
    }
  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketplaceRoutingModule { }
