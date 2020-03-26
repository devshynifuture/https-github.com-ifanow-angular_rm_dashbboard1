import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { AddArnRiaDetailsComponent } from '../../../setting-entry/add-arn-ria-details/add-arn-ria-details.component';
import { SettingsService } from '../../../settings.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-arn-ria-details',
  templateUrl: './arn-ria-details.component.html',
  styleUrls: ['./arn-ria-details.component.scss']
})
export class ArnRiaDetailsComponent implements OnInit {

  advisorId:any;
  arnobjs = [
    {
      id: 83866,
      name: 'ABC Financial Advisors Pvt. Ltd.',
      status: 'ACTIVE',
      type: 'Company',
      commencement_date: '18/10/2018',
      renewal_date: '17/10/2021',
      primary_euin: 'Amit Kumar - E209349',
      billing_address: '203-A,”A” Wing, Suashish IT Park, Off. Dattapada Road, Borivali East, Mumbai 400 066 Maharashtra, India',
      gst_treatment: 'Applicable',
      phone: '+91-445-455-5215',
      gst_id: '27AABCF7680A1Z7',
      email: 'firstname.lastname@abcconsultants.com',
    },
    {
      id: 83866,
      name: 'ABC Financial Advisors Pvt. Ltd.',
      status: 'ACTIVE',
      type: 'Company',
      commencement_date: '18/10/2018',
      renewal_date: '17/10/2021',
      primary_euin: 'Amit Kumar - E209349',
      billing_address: '203-A,”A” Wing, Suashish IT Park, Off. Dattapada Road, Borivali East, Mumbai 400 066 Maharashtra, India',
      gst_treatment: 'Applicable',
      phone: '+91-445-455-5215',
      gst_id: '27AABCF7680A1Z7',
      email: 'firstname.lastname@abcconsultants.com',
    },
  ]

  constructor(
    private subInjectService: SubscriptionInject,
    private settingsService: SettingsService,
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
  }

  getArnDetails() {
    this.settingsService.getArnlist({advisorId: this.advisorId}).subscribe((data)=> {
      console.log('sagar', data);
    });
  }


  openArnDetails(value, data) {
    let popupHeaderText = !!data ? 'Edit Fixed deposit' : 'Add Fixed deposit';
    const fragmentData = {
      flag: value,
      data: data || {},
      id: 1,
      state: 'open50',
      componentName: AddArnRiaDetailsComponent,
      popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }


}
