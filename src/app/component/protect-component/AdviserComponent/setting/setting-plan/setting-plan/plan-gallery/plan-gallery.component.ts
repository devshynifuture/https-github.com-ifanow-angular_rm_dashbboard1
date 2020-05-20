import { Component, OnInit } from '@angular/core';
import { OpenGalleryPlanComponent } from './open-gallery-plan/open-gallery-plan.component';
import { MatDialog } from '@angular/material';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { OrgSettingServiceService } from '../../../org-setting-service.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { PlanService } from 'src/app/component/protect-component/customers/component/customer/plan/plan.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-plan-gallery',
  templateUrl: './plan-gallery.component.html',
  styleUrls: ['./plan-gallery.component.scss']
})
export class PlanGalleryComponent implements OnInit {
  advisorId: any;
  defaultGallery: any = [];
  userId: any;

  constructor(private orgSetting: OrgSettingServiceService,
    public subInjectService: SubscriptionInject, private eventService: EventService,
    public dialog: MatDialog, private fb: FormBuilder, private planService: PlanService) {
    this.advisorId = AuthService.getAdvisorId()
    this.userId = AuthService.getUserId()
  }

  ngOnInit() {
    this.getDefault()
  }

  getDefault() {
    let advisorObj = {
      advisorId: this.advisorId
    }
    this.planService.getGoalGlobalData(advisorObj).subscribe(
      data => this.getGoalGlobalDataRes(data),
      error => {
        this.eventService.showErrorMessage(error)
        this.defaultGallery = undefined;
      }
    )

  }
  getGoalGlobalDataRes(data) {
    console.log('gallery === ', data)
    this.defaultGallery = data
  }
  openGallery(gallery) {
    const dialogRef = this.dialog.open(OpenGalleryPlanComponent, {
      width: '470px',
      height: '280px',
      data: { bank: gallery, animal: '' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getDefault()
      }
    });
  }

  resetGallery(data) {
    const dialogData = {
      data: 'Gallary',
      header: 'RESET',
      body: 'Are you sure you want to reset this image?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'RESET',
      positiveMethod: () => {
        this.orgSetting.resetGallery({id:data.id,advisorId:this.advisorId,imageURL:null,goalTypeId:data.goalTypeId}).subscribe(
          data => {
            this.eventService.openSnackBar("Image resetted successfully!", "Dismiss");
            this.getDefault()
            dialogRef.close();
          },
          error => this.eventService.showErrorMessage(error)
        );
      },
      negativeMethod: () => {
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,
    });
  }
}
