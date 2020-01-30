import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AumAllRtaComponent } from './aum-all-rta/aum-all-rta.component';
import { AumCamsComponent } from './aum-cams/aum-cams.component';
import { AumKarvyComponent } from './aum-karvy/aum-karvy.component';
import { AumFranklinComponent } from './aum-franklin/aum-franklin.component';
import { SupportAumReconciliationComponent } from './support-aum-reconciliation.component';


const routes: Routes = [
  {
    path: '',
    component: SupportAumReconciliationComponent,
    children: [
      {
        path: 'all-rta',
        component: AumAllRtaComponent
      },
      {
        path: 'cams',
        component: AumCamsComponent
      },
      {
        path: 'karvy',
        component: AumKarvyComponent
      },
      {
        path: 'franklin',
        component: AumFranklinComponent
      },
      {
        path: '',
        redirectTo: "all-rta",
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportAumReconciliationRoutingModule { }
