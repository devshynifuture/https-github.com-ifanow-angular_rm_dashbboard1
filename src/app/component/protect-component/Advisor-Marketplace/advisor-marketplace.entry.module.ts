import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'src/app/material/material';
import {CustomDirectiveModule} from '../../../common/directives/common-directive.module';
import {MarketplaceProfileEditComponent} from './advisor-marketplace/marketplace-profile/marketplace-profile-edit/marketplace-profile-edit.component';
import {MarketplacePostsAddComponent} from './advisor-marketplace/marketplace-posts/marketplace-posts-add/marketplace-posts-add.component';
import {MarketplaceReviewRequestBulkComponent} from './advisor-marketplace/marketplace-review-rating/marketplace-review-request-bulk/marketplace-review-request-bulk.component';
import {MarketplaceCallDetailsComponent} from './advisor-marketplace/marketplace-calls/marketplace-call-details/marketplace-call-details.component';
import {MarketplaceReviewReplyComponent} from './advisor-marketplace/marketplace-review-rating/marketplace-review-reply/marketplace-review-reply.component';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {MY_FORMATS2} from '../../../constants/date-format.constant';

export const componentList = [
  MarketplaceProfileEditComponent,
  MarketplacePostsAddComponent,
  MarketplaceReviewRequestBulkComponent,
  MarketplaceCallDetailsComponent,
  MarketplaceReviewReplyComponent,
];

@NgModule({
  declarations: componentList,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CustomDirectiveModule
  ],
  exports: [],
  entryComponents: componentList,
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2}]
})
export class MarketPlaceEntryModule {
  static getComponentList() {
    return componentList;
  }
}
