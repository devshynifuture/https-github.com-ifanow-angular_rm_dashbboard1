import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { SubscriptionInject } from '../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder } from '@angular/forms';
import { SupportService } from '../../support.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { timingSafeEqual } from 'crypto';
import { SettingsService } from '../../../AdviserComponent/setting/settings.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-admin-details',
  templateUrl: './admin-details.component.html',
  styleUrls: ['./admin-details.component.scss']
})
export class AdminDetailsComponent implements OnInit {
  advisorId: any;
  getOverview: any;
  inputData: any;
  overviewDesc = true
  stageList: any;
  activityCommentList: any;
  activityComment = true
  isSuccess = false
  rtaDetails: any;
  camsDS: MatTableDataSource<unknown>;
  karvyDS: MatTableDataSource<unknown>;
  frankDS: MatTableDataSource<unknown>;
  fundsDS: MatTableDataSource<unknown>;
  @Input()
  set data(data) {
    window.screenTop;
    this.inputData = data;
    this.getOverviewIFAOnbording(this.inputData)
    this.getIFAActivity()
    this.getRTADetails()
  }

  get data() {
    return this.inputData;
  }
  constructor(
    public subInjectService: SubscriptionInject,
    private fb: FormBuilder,
    private supportService: SupportService,
    private eventService: EventService,
    private settingsService : SettingsService
  ) {
    this.advisorId = AuthService.getAdvisorId()
  }
  displayedColumns: string[] = ['name', 'email', 'mobile', 'role'];
  dataSource = ELEMENT_DATA;

  displayedColumns1: string[] = ['arn', 'regEmailId', 'scheduleExp'];
  dataSource1 = ELEMENT_DATA1;

  displayedColumns2: string[] = ['arn', 'loginId', 'registeredId', 'userOrdering'];
  dataSource2 = ELEMENT_DATA2;

  displayedColumns3: string[] = ['arn', 'loginId', 'registeredId'];
  dataSource3 = ELEMENT_DATA3;

  displayedColumns4: string[] = ['arn', 'loginId'];
  dataSource4 = ELEMENT_DATA4;

  onboardingActivityForm = this.fb.group({
    "firstCall": [,],
    "autoForwardStep": [,],
    "dataUploadAndAumReconciliation": [,],
    "dailyScheduleNCamsExpiryDateAdd": [,],
    "demoAndHandover": [,],
    "done": [,]
  })

  ngOnInit() {
    this.overviewDesc = true

  }
  getRTADetails(){
    const jsonData = {advisorId: this.inputData.adminAdvisorId};

    this.settingsService.getMFRTAList(jsonData).subscribe((res) => {
      console.log('res == ',res)
     this.rtaDetails = res
     this.createDataSource()
    });
  }
  createDataSource() {
    this.camsDS = new MatTableDataSource(this.rtaDetails.filter((data) => data.rtTypeMasterid == 1));
    this.karvyDS = new MatTableDataSource(this.rtaDetails.filter((data) => data.rtTypeMasterid == 2));
    this.frankDS = new MatTableDataSource(this.rtaDetails.filter((data) => data.rtTypeMasterid == 3));
    this.fundsDS = new MatTableDataSource(this.rtaDetails.filter((data) => data.rtTypeMasterid == 4));
  }
  activityCommentFun(value, flag) {
    value.isEdit = flag
    if(flag == true){
      this.activityCommentList.forEach(element => {
        if(element.id == value.id){
          element.id =value.id,
          element.commentMsg =  value.commentMsg,
          element.activityId = value.activityId
        }
      });
      this.supportService.activityCommentUpdate(this.activityCommentList).subscribe(
        data => {
          console.log('getOverviewIFAOnbording', data);
          if (data) {
            // this.getOverview = data.stageList;
          }
        }
        , err => this.eventService.openSnackBar(err, "Dismiss")
      )
    }
  }
  getOverviewIFAOnbording(data) {
    let obj = {
      adminAdvisorId: data.adminAdvisorId
    }
    this.supportService.getOverviewIFAOnboarding(obj).subscribe(
      data => {
        console.log('getOverviewIFAOnbording', data);
        if (data) {
          this.getOverview = data[0];
        }
      }
      , err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  updateActivityCompleteness(stage,event) {
    // let obj = {
    //   id:stage.id,
    //   isComplete : (event.checked == true)? 1:0,
    //   activityId : stage.activityId
    // }
    this.stageList.forEach(element => {
      if(element.id == stage.id){
        element.id = stage.id
        element.isComplete = (event.checked == true)? 1:0,
        element.activityId = stage.activityId
      }
    });
    this.supportService.editActivity(this.stageList).subscribe(
      data => {
        console.log('getOverviewIFAOnbording', data);
        if (data) {
         console.log(data)
        }
      }
      , err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  getIFAActivity() {
    this.isSuccess = true
    let obj = {
      advisorId: this.inputData.adminAdvisorId
    }
    this.supportService.getOnboardingActivity(obj).subscribe(
      data => {
        console.log('getOverviewIFAOnbording', data);
        this.isSuccess = false
        if (data) {
          this.stageList = data.stageList;
          this.activityCommentList = data.activityCommentList
          this.activityCommentList.forEach(element => {
            element.isEdit = true
          });
        }
      }
      , err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  updateIFAOnboardingOverview() {
    let obj = {
      id: this.getOverview.id,
      description: this.getOverview.description
    }
    this.supportService.updateOverviewIFAOnboarding(obj).subscribe(
      data => {
        console.log('getOverviewIFAOnbording', data);
        if (data) {
          // this.getOverview = data.stageList;
        }
      }
      , err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  makeComment(comment,flag){
    console.log('comment',comment)
    
  }
  update
  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

}


export interface PeriodicElement {
  name: string;
  email: string;
  mobile: string;
  role: string;

}
const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Atul Shah', email: 'atul@manekfinancial.com', mobile: '9879879878', role: 'Team member' },
  { name: 'Rinku Singh', email: 'atul@manekfinancial.com', mobile: '9879879878', role: 'Team member' },
  { name: 'Atul Shah', email: 'atul@manekfinancial.com', mobile: '9879879878', role: 'Team member' },
  { name: 'Atul Shah', email: 'atul@manekfinancial.com', mobile: '9879879878', role: 'Team member' },
];


export interface PeriodicElement1 {
  arn: string;
  regEmailId: string;
  scheduleExp: string;
}
const ELEMENT_DATA1: PeriodicElement1[] = [
  { arn: 'Atul Shah', regEmailId: 'atul@manekfinancial.com', scheduleExp: '9879879878' },

];


export interface PeriodicElement2 {
  arn: string;
  loginId: string;
  registeredId: string;
  userOrdering: string;
}
const ELEMENT_DATA2: PeriodicElement2[] = [
  { arn: 'ARN-83866', loginId: 'abcconsult', registeredId: 'firstname.lastname@abcconsultants.com', userOrdering: "Yes" },
  { arn: 'RIA-INA000004409', loginId: 'riaconsult', registeredId: 'ria@abcconsultants.com,secondemail@abcconsults.com', userOrdering: "Yes" },

];



export interface PeriodicElement3 {
  arn: string;
  loginId: string;
  registeredId: string;

}
const ELEMENT_DATA3: PeriodicElement3[] = [
  { arn: 'ARN-83866', loginId: 'abcconsult', registeredId: 'firstname.lastname@abcconsultants.com' },
  { arn: 'RIA-INA000004409', loginId: 'riaconsult', registeredId: 'ria@abcconsultants.com,secondemail@abcconsults.com' },

];



export interface PeriodicElement4 {
  arn: string;
  loginId: string;

}
const ELEMENT_DATA4: PeriodicElement4[] = [
  { arn: 'ARN-83866', loginId: 'abcconsult', },
  { arn: 'ARN-83866', loginId: 'abcconsult', },

];

