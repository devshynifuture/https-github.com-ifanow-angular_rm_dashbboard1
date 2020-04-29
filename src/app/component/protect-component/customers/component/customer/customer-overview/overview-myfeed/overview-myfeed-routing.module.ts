import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverviewMyfeedComponent } from './overview-myfeed.component';
import { AllFeedsComponent } from './all-feeds/all-feeds.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { PlanComponent } from './plan/plan.component';
import { ActivityComponent } from './activity/activity.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ProfileComponent } from './profile/profile.component';
import { EducationComponent } from './education/education.component';
import { VideosComponent } from './videos/videos.component';

const routes: Routes = [{
  path: '',
  component: OverviewMyfeedComponent,
  children: [
    {
      path: 'all-feeds',
      component: AllFeedsComponent
    },
    {
      path: 'portfolio',
      component: PortfolioComponent
    },
    {
      path: 'plan',
      component: PlanComponent
    },
    {
      path: 'activity',
      component: ActivityComponent
    },
    {
      path: 'transactions',
      component: TransactionsComponent
    },
    {
      path: 'profile',
      component: ProfileComponent
    },
    {
      path: 'education',
      component: EducationComponent
    },
    {
      path: 'videos',
      component: VideosComponent
    },
    {
      path: '',
      redirectTo: 'all-feeds',
      pathMatch: 'full'
    },
  ],
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverviewMyfeedRoutingModule { }
