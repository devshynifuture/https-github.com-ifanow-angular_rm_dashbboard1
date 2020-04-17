import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { SubscriptionInject } from '../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder } from '@angular/forms';
import { SupportService } from '../../support.service';
import { AuthService } from 'src/app/auth-service/authService';
import { timingSafeEqual } from 'crypto';
import { UtilService } from 'src/app/services/util.service';
import { SettingsService } from '../../../AdviserComponent/setting/settings.service';
import { MatTableDataSource } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';

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
  isLoading = false
  stageComment: any;
  @Input()
  set data(data) {
    window.screenTop;
    this.inputData = data;
    this.getOverviewIFAOnbording(this.inputData)
    this.getIFAActivity()
  }

  get data() {
    return this.inputData;
  }
  constructor(
    public subInjectService: SubscriptionInject,
    private fb: FormBuilder,
    private supportService: SupportService,
    private eventService: EventService,
    public utilservice: UtilService,
    private settingsService: SettingsService
  ) {
    this.advisorId = AuthService.getAdvisorId()
  }

  tabIndex = 0;

  isRTALoaded: boolean = false;
  isTeamLoaded: boolean = false;

  camsDS: MatTableDataSource<any> = new MatTableDataSource([{}, {}, {}]);
  karvyDS: MatTableDataSource<any> = new MatTableDataSource([{}, {}, {}]);
  frankDS: MatTableDataSource<any> = new MatTableDataSource([{}, {}, {}]);
  fundsDS: MatTableDataSource<any> = new MatTableDataSource([{}, {}, {}]);
  userList: MatTableDataSource<any> = new MatTableDataSource([{}, {}, {}]);

  rtaAPIError: boolean = false;
  teamAPIError: boolean = false;

  displayedColumns: string[] = ['name', 'email', 'mobile', 'role'];
  displayedColumns1: string[] = ['arn', 'regEmailId', 'scheduleExp'];
  displayedColumns2: string[] = ['arn', 'loginId', 'registeredId', 'userOrdering'];
  displayedColumns3: string[] = ['arn', 'loginId', 'registeredId'];
  displayedColumns4: string[] = ['arn', 'loginId'];

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

  getRTADetails() {
    const jsonData = { advisorId: this.data.adminAdvisorId };
    this.settingsService.getMFRTAList(jsonData).subscribe((res) => {
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
    let obj = {
      id: value.id,
      commentMsg: value.commentMsg,
    }
    this.supportService.activityCommentUpdate(obj).subscribe(
      data => {
        console.log('getOverviewIFAOnbording', data);
        if (data) {
          // this.getOverview = data.stageList;
        }
      }
      , err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }

  activityCommentFunStage() {

  }

  getstageComment() {
    let obj = {

    }
    this.supportService.getStageComments(obj).subscribe(
      data => {
        console.log('getOverviewIFAOnbording', data);
        if (data) {
          this.stageComment = data;
          this.stageComment.forEach(element => {
            element.isEditStage = true
          });
        }
      }
      , err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }

  editStageComment() {
    let obj = {

    }
    this.supportService.editStageComment(obj).subscribe(
      data => {
        console.log('getOverviewIFAOnbording', data);
        if (data) {
          console.log(data)
        }
      }
      , err => this.eventService.openSnackBar(err, "Dismiss")
    )
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

  showComment(stage,flag){
    if (stage.isShowComment == true) {
      stage.isShowComment = false
    } else {
      stage.isShowComment = true
    }
  }

  updateActivityCompleteness(stage, event) {
   
    this.stageList.forEach(element => {
      if (element.id == stage.id) {
        element.id = stage.id
        element.isComplete = (event.checked == true) ? 1 : 0,
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
          this.stageList.forEach(element => {
            element.isShowComment = false
          });
          this.activityCommentList = data.activityCommentList
          this.activityCommentList.forEach(element => {
            element.isEdit = true
          });
          this.isSuccess = false
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

  makeComment(comment, flag) {
    console.log('comment', comment)

  }


  changeTab(index) {
    switch (index) {
      case 2:
        if (!this.isRTALoaded) {
          this.loadRTAList()
        }
        break;

      case 3:
        if (!this.isTeamLoaded) {
          this.loadUsers()
        }
    }
  }

  loadRTAList() {
    const jsonData = { advisorId: this.data.advisorId };
    this.utilservice.loader(1)
    this.rtaAPIError = false;
    this.settingsService.getMFRTAList(jsonData).subscribe((res) => {
      let mfRTAlist = res || [];
      this.camsDS = new MatTableDataSource(mfRTAlist.filter((data) => data.rtTypeMasterid == 1));
      this.karvyDS = new MatTableDataSource(mfRTAlist.filter((data) => data.rtTypeMasterid == 2));
      this.frankDS = new MatTableDataSource(mfRTAlist.filter((data) => data.rtTypeMasterid == 3));
      this.fundsDS = new MatTableDataSource(mfRTAlist.filter((data) => data.rtTypeMasterid == 4));
      this.isRTALoaded = true;
      this.utilservice.loader(-1);
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
      this.rtaAPIError = true;
      this.utilservice.loader(-1);
    });
  }
  
  loadUsers() {
    this.utilservice.loader(1);
    const dataObj = {
      advisorId: this.data.advisorId
    };
    this.teamAPIError = false;
    this.settingsService.getTeamMembers(dataObj).subscribe((res) => {
      this.userList = new MatTableDataSource(res);
      this.utilservice.loader(-1);
      this.isTeamLoaded = true;
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
      this.teamAPIError = true;
      this.utilservice.loader(-1);
    });
  }

  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
}