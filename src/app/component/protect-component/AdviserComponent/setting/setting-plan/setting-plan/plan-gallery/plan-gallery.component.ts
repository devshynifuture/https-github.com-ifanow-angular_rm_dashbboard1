import { Component, OnInit } from '@angular/core';
import { OpenGalleryPlanComponent } from './open-gallery-plan/open-gallery-plan.component';
import { MatDialog } from '@angular/material';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { OrgSettingServiceService } from '../../../org-setting-service.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { PlanService } from 'src/app/component/protect-component/customers/component/customer/plan/plan.service';

@Component({
  selector: 'app-plan-gallery',
  templateUrl: './plan-gallery.component.html',
  styleUrls: ['./plan-gallery.component.scss']
})
export class PlanGalleryComponent implements OnInit {
  element: any;
  advisorId: any;
  defaultGallery: any;
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
      error => this.eventService.showErrorMessage(error)
    )

  }
  getGoalGlobalDataRes(data) {
    console.log('gallery === ', data)
    this.defaultGallery = data
  }
  openGallery() {
    const dialogRef = this.dialog.open(OpenGalleryPlanComponent, {
      width: '500px',
      height: '500px',
      data: { bank: '', animal: '' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined) {
        return
      }
      console.log('The dialog was closed');
      this.element = result;
      console.log('result -==', this.element)
      let obj = {
        emailAddress: this.element,
        userId: this.userId
      }
      // this.orgSetting.addEmailVerfify(obj).subscribe(
      //   data => this.addEmailVerfifyRes(data),
      //   err => this.eventService.openSnackBar(err, "Dismiss")
      // );
      //  this.bankDetailsSend.emit(result);
    });
  }
}
