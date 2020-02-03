import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { SubscriptionService } from '../../../subscription.service';
import { AuthService } from "../../../../../../../auth-service/authService";
import { UtilService } from "../../../../../../../services/util.service";
import { SubscriptionUpperSliderComponent } from '../../common-subscription-component/upper-slider/subscription-upper-slider.component';
import { HelpComponent } from '../../common-subscription-component/help/help.component';
import { Router } from '@angular/router';
import { SubscriptionDataService } from '../../../subscription-data.service';

// import {CustomHtmlComponent} from "../../../../../../../common/customhtml.component";

@Component({
  selector: 'app-documents-settings',
  templateUrl: './documents-settings.component.html',
  styleUrls: ['./documents-settings.component.scss']
})
export class DocumentsSettingsComponent implements OnInit {
  button: any;
  Questions = [{ question: 'Can I create my own template for Quotations?' },
  { question: 'Can I create my own template for Consent T&C?' },
  { question: 'What are the Future subscriptions?' }]
  documentSettingData = [];
  isLoading = false;
  //showLoader;

  constructor(public dialog: MatDialog, public eventService: EventService, public subInjectService: SubscriptionInject, private utilservice: UtilService
    , private subService: SubscriptionService, private router: Router) {
  }

  advisorId;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    // this.openFragment('documents');
    (SubscriptionDataService.getLoderFlag(5) == false) ? this.documentSettingData = undefined : this.documentSettingData = [{}, {}, {}]
    this.getDocumentsSetting();
  }

  getDocumentsSetting() {
    this.isLoading = true;
    //this.showLoader = true;
    const obj = {
      advisorId: this.advisorId,

      // "advisorId": 2735
    };
    // const data = [{}, {}];
    // this.getDocumentsSettingResponse(data);
    //    this.documentSettingData = [{}, {}];
    this.subService.getSubscriptionDocumentSetting(obj).subscribe(
      data => this.getDocumentsSettingResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.documentSettingData = undefined;
        this.isLoading = false;
      }
    );
  }
  /**this function is used for calling get api in documentSetting component */
  display(data) {
    this.getDocumentsSetting();
  }
  getDocumentsSettingResponse(data) {
    if (data == undefined) {
      this.documentSettingData = undefined;
      this.isLoading = false;
    }
    else {
      this.isLoading = false;
      this.documentSettingData = data;
    }
    //this.showLoader = false;
  }
  OpenHelp(value, state, data) {
    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: state,
      componentName: HelpComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
    // this.eventService.sidebarData(value);
    // this.subInjectService.rightSideData(state);
  }
  Open(value, state) {
    this.eventService.sidebarData(value);
    this.subInjectService.rightSideData(state);
  }
  openFragment(data, singleDocument) {
    (singleDocument == null) ? singleDocument = data : singleDocument.flag = data
    console.log('hello mf button clicked');
    const fragmentData = {
      flag: 'document',
      id: 1,
      data: singleDocument,
      direction: 'top',
      componentName: SubscriptionUpperSliderComponent,
      state: 'open'
    };
    // this.router.navigate(['/subscription-upper'], { state: { ...fragmentData } })
    // AuthService.setSubscriptionUpperSliderData(fragmentData)

    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          this.getDocumentsSetting();
          subscription.unsubscribe();
        }
      }
    );
  }

  // openFragment(data, singleDocument) {
  //   (singleDocument==undefined)?singleDocument=data:singleDocument.flag=data
  //   singleDocument.flag = data;
  //   const fragmentData = {
  //     flag: 'app-subscription-upper-slider',
  //     data: singleDocument,
  //     id: 1,
  //     state: 'open'
  //   };
  //   const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
  //     upperSliderData => {
  //       if (UtilService.isDialogClose(upperSliderData)) {
  //         this.getDocumentsSetting();
  //         subscription.unsubscribe();
  //       }
  //     }
  //   );
  // if (singleDocument.flag == 'documents') {

  //   // this.eventService.changeUpperSliderState(fragmentData);


  // } else {
  //   const dialogRef = this.dialog.open(ModifyFeeDialogComponent, {
  //     width: '1400px',
  //     data: fragmentData,
  //     autoFocus: false,
  //     panelClass: 'dialogBox',
  //     //  position: {
  //     //    top: `30px`,
  //     //    right: `40px`
  //     //   },
  //     // openFrom:'{
  //     //   top: -50,
  //     //   width: 30,
  //     //   height: 80
  //     // }',
  //     // closeTo({
  //     //   left: 1500
  //     // })
  //     // hasBackdrop: false,
  //   });

  //   dialogRef.afterClosed().subscribe(result => {

  //   });
  // }

}

