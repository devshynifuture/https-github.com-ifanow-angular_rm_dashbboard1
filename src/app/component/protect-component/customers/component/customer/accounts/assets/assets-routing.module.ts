import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetsComponent } from './assets.component';


const routes: Routes = [
  {
    path: '', component: AssetsComponent,
    children: [
      { path: 'mutual-funds', loadChildren: () => import('./mutual-fund/mutual-fund/mutual-fund.module').then(m => m.MutualFundModule) }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsRoutingModule { }
