import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material';
import { CustomDirectiveModule } from '../../../common/directives/common-directive.module';
import { MarketplaceProfileEditComponent } from './advisor-marketplace/marketplace-profile/marketplace-profile-edit/marketplace-profile-edit.component';
import { MarketplacePostsAddComponent } from './advisor-marketplace/marketplace-posts/marketplace-posts-add/marketplace-posts-add.component';
import { MarketplaceReviewRequestBulkComponent } from './advisor-marketplace/marketplace-review-rating/marketplace-review-request-bulk/marketplace-review-request-bulk.component';
import { MarketplaceCallDetailsComponent } from './advisor-marketplace/marketplace-calls/marketplace-call-details/marketplace-call-details.component';
import { MarketplaceReviewReplyComponent } from './advisor-marketplace/marketplace-review-rating/marketplace-review-reply/marketplace-review-reply.component';

export const componentList = [
    MarketplaceProfileEditComponent,
    MarketplacePostsAddComponent,
    MarketplaceReviewRequestBulkComponent,
    MarketplaceCallDetailsComponent,
    MarketplaceReviewReplyComponent,
]
@NgModule({
    declarations: componentList,
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        CustomDirectiveModule
    ],
    exports: [

    ],
    entryComponents: componentList
})
export class MarketPlaceEntryModule {
    static getComponentList() {
        return componentList;
    }
}