import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { SubscriptionInject } from '../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder } from '@angular/forms';
import { SupportService } from '../../support.service';
import { timingSafeEqual } from 'crypto';
import { UtilService } from 'src/app/services/util.service';
import { SettingsService } from '../../../AdviserComponent/setting/settings.service';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from '../../../common-component/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../../../../auth-service/authService';

@Component({
  selector: 'app-admin-details',
  templateUrl: './admin-details.component.html',
  styleUrls: ['./admin-details.component.scss']
})
export class AdminDetailsComponent implements OnInit {
  getOverview: any;
  inputData: any;
  overviewDesc = false
  stageList: any;
  activityCommentList: any;
  activityComment = true
  isSuccess = false
  rtaDetails: any;
  isLoading = false
  stageComment: any[] = [{}];
  CommentStage: any;
  Comment: any;
  activityId: any;
  stage: any;
  isEditRm = false
  rmId = AuthService.getRmId() ? AuthService.getRmId() : 0;
  @Input()
  set data(data) {
    window.screenTop;
    this.inputData = data;
    this.getOverviewIFAOnbording(this.inputData)
    // this.getIFAActivity()
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
    public utilservice: UtilService,
    private settingsService: SettingsService,
    public dialog: MatDialog
  ) {
    //this.advisorId = AuthService.getAdvisorId()
  }

  tabIndex = 0;

  isRTALoaded: boolean = false;
  isTeamLoaded: boolean = false;
  isOverview = false
  isActivity = false
  camsDS: MatTableDataSource<any> = new MatTableDataSource([{}, {}, {}]);
  karvyDS: MatTableDataSource<any> = new MatTableDataSource([{}, {}, {}]);
  frankDS: MatTableDataSource<any> = new MatTableDataSource([{}, {}, {}]);
  fundsDS: MatTableDataSource<any> = new MatTableDataSource([{}, {}, {}]);
  userList: MatTableDataSource<any> = new MatTableDataSource([{}, {}, {}]);

  rtaAPIError: boolean = false;
  teamAPIError: boolean = false;
  isEditStageRm = false
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
    this.overviewDesc = false

  }
  getRTADetails() {
    const jsonData = { advisorId: this.inputData.adminAdvisorId };

    this.settingsService.getMFRTAList(jsonData).subscribe((res) => {
      console.log('res == ', res)
      this.rtaDetails = res
      this.createDataSource()
    });
  }
  createDataSource() {
    if (this.rtaDetails) {
      this.camsDS = new MatTableDataSource(this.rtaDetails.filter((data) => data.rtTypeMasterid == 1));
      this.karvyDS = new MatTableDataSource(this.rtaDetails.filter((data) => data.rtTypeMasterid == 2));
      this.frankDS = new MatTableDataSource(this.rtaDetails.filter((data) => data.rtTypeMasterid == 3));
      this.fundsDS = new MatTableDataSource(this.rtaDetails.filter((data) => data.rtTypeMasterid == 4));
    } else {
      this.eventService.openSnackBar('No Rta Details Found', 'DISMISS');
    }
  }
  activityCommentFun(value, flag) {
    value.isEdit = flag
    let obj = {
      id: value.id,
      commentMsg: value.commentMsg,
    }
    if (flag == true) {
      this.supportService.activityCommentUpdate(obj).subscribe(
        data => {
          console.log('activityCommentUpdate', data);
          if (data) {
            // this.getOverview = data.stageList;
          }
        }
        , err => this.eventService.openSnackBar(err, "Dismiss")
      )
    }
  }
  activityCommentFunStage(value, flag) {
    value.isEditStage = flag
    let obj = {
      id: value.activityCommentFunStage,
      commentMsg: value.commentMsg,
    }
    if (flag == true) {
      this.supportService.editStageComment(obj).subscribe(
        data => {
          console.log('editStageComment', data);
          if (data) {
            // this.getOverview = data.stageList;
          }
        }
        , err => this.eventService.openSnackBar(err, "Dismiss")
      )
    }
  }
  addStageComment(value, stage) {
    let obj =
    {
      id: stage.taskLevelId,
      commentMsg: value,
      rmId: this.rmId,
    }
    this.supportService.addStageComment(obj).subscribe(
      data => {
        console.log('editStageComment', data);
        this.getstageComment(stage, true)
        this.CommentStage = ''
        if (data == null) {
          // this.getOverview = data.stageList;
        }
      }
      , err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  getstageComment(stage, flag) {
    this.isLoading = true
    let obj = {
      advisorId: this.inputData.adminAdvisorId,
      stageChatId: stage.taskLevelId
    }
    if (flag == true) {
      this.supportService.getStageComments(obj).subscribe(
        data => {
          console.log('getOverviewIFAOnbording', data);
          this.isLoading = false
          if (data) {
            this.stageComment = data;
            this.stageComment.forEach(element => {
              if (this.rmId == element.rmId) {
                element.isEditStageRm = true
              }
              element.isEditStage = true
            });
          }
        }
        , err => this.eventService.openSnackBar(err, "Dismiss")
      )
    }
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
    this.isSuccess = true
    let obj = {
      adminAdvisorId: data.adminAdvisorId
    }
    this.supportService.getOverviewIFAOnboarding(obj).subscribe(
      data => {
        console.log('getOverviewIFAOnbording', data);
        if (data) {
          this.isSuccess = false
          this.getOverview = data[0];
        }
      }
      , err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  showComment(stage, flag) {
    if (stage.isShowComment == true) {
      stage.isShowComment = false
    } else {
      stage.isShowComment = true
    }
    this.getstageComment(stage, flag)
  }
  updateActivityCompleteness(stage, event) {
    let obj = {
      id: stage.id,
      isComplete: (event.checked == true) ? 1 : 0,
      activityId: this.activityId,
    }
    let obj1 = []
    obj1.push(obj)
      this.supportService.editActivity(obj1).subscribe(
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
    this.isLoading = true
    let obj = {
      advisorId: this.inputData.adminAdvisorId
    }
    this.supportService.getOnboardingActivity(obj).subscribe(
      data => {
        console.log('getOverviewIFAOnbording', data);
        this.isSuccess = false
        if (data) {
          this.isLoading = false
          this.isActivity = true
          this.stageList = data.stageList;
          this.activityId = data.activityId;
          this.stageList.forEach(element => {
            element.isShowComment = false
          });
          this.activityCommentList = data.activityCommentList
          this.activityCommentList.forEach(element => {
            if (this.rmId == element.rmId) {
              element.isEditRm = true
            }
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

        }
      }
      , err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  makeComment(comment, stage) {
    console.log('comment', comment)
    let obj =
    {
      activityId: this.activityId,
      commentMsg: comment,
      rmId: this.rmId,
    }
    this.supportService.activityAddComment(obj).subscribe(
      data => {
        this.getIFAActivity()
        this.Comment = ''
        console.log('editStageComment', data);
        if (data) {
        }
      }
      , err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  deleteModal(value, element, event) {
    this.stage = element
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        if (value == 'commentStage') {
          this.supportService.deleteCommentStage(event.id).subscribe(
            data => {
              dialogRef.close();
              this.getstageComment(this.stage, true);
            },
            error => this.eventService.showErrorMessage(error)
          );
        } else {
          this.supportService.activityDeleteComment(element.id).subscribe(
            data => {
              dialogRef.close();
              this.getIFAActivity();
            },
            error => this.eventService.showErrorMessage(error)
          );
        }

        this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
      },
      negativeMethod: () => {
      }
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  changeTab(index) {
    switch (index) {
      case 1:
        if (!this.isActivity) {
          this.getIFAActivity()
        }
        break;
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