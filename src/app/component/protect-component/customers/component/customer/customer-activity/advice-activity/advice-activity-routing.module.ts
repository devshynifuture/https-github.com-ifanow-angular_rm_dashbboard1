import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdviceActivityComponent } from './advice-activity.component';
import { AdviceAllPortfolioComponent } from './advice-all-portfolio/advice-all-portfolio.component';


const routes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      component: AdviceActivityComponent

    },
    {
      path: 'all-portfolio',
      component: AdviceAllPortfolioComponent
    },
    // {
    //   path: '',
    //   component: AdviceActivityComponent
    // }, {
    //   path: '',
    //   component: AdviceActivityComponent
    // }
  ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdviceActivityRoutingModule { }
