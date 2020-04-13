import { Component, OnInit } from '@angular/core';
import { AddCamsDetailsComponent } from '../../../setting-entry/add-cams-details/add-cams-details.component';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { AddKarvyDetailsComponent } from '../../../setting-entry/add-karvy-details/add-karvy-details.component';
import { AddFranklinTempletionDetailsComponent } from '../../../setting-entry/add-franklin-templetion-details/add-franklin-templetion-details.component';
import { AddCamsFundsnetComponent } from '../../../setting-entry/add-cams-fundsnet/add-cams-fundsnet.component';
import { SettingsService } from '../../../settings.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-mf-rta-details',
  templateUrl: './mf-rta-details.component.html',
  styleUrls: ['./mf-rta-details.component.scss']
})
export class MfRtaDetailsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  displayedColumns1: string[] = ['position', 'name', 'weight', 'email', 'mail', 'use', 'icons'];
  displayedColumns2: string[] = ['position', 'name', 'weight', 'email', 'mail', 'icons'];

  camsDS: MatTableDataSource<any>;
  karvyDS: MatTableDataSource<any>;
  frankDS: MatTableDataSource<any>;
  fundsDS: MatTableDataSource<any>;

  advisorId: any;
  globalData: any = {};
  mfRTAlist: any[] = [{}];
  arnList: any[] = [{}];
  spans: any[] = [];
  isLoading = false;

  constructor(
    private eventService: EventService,
    private subInjectService: SubscriptionInject,
    private settingsService: SettingsService,
    public dialog: MatDialog
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.initializeData();
  }

  initializeData() {
    this.settingsService.getArnGlobalData().subscribe((res) => {
      this.globalData = res;
    });
    this.getArnDetails();
    this.loadRTAList();
  }

  getArnDetails() {
    this.settingsService.getArnlist({ advisorId: this.advisorId }).subscribe((data) => {
      this.arnList = data || [];
    });
  }

  loadRTAList() {
    const jsonData = { advisorId: this.advisorId }
    this.settingsService.getMFRTAList(jsonData).subscribe((res) => {
      this.mfRTAlist = res || [];
      this.createDataSource();
    })
  }

  createDataSource() {
    this.camsDS = new MatTableDataSource(this.mfRTAlist.filter((data) => data.rtTypeMasterid == 1));
    this.karvyDS = new MatTableDataSource(this.mfRTAlist.filter((data) => data.rtTypeMasterid == 2));
    this.frankDS = new MatTableDataSource(this.mfRTAlist.filter((data) => data.rtTypeMasterid == 3));

    this.fundsDS = new MatTableDataSource(this.mfRTAlist.filter((data) => data.rtTypeMasterid == 4));
  }

  openInSideBar(componentID, data, flag) {

    if (this.arnList.length == 0) {
      this.eventService.openSnackBar("Kindly add ARN details to proceed");
      return;
    }

    let fullData = {
      globalData: this.globalData,
      arnData: this.arnList,
      mainData: data || {},
      rtType: componentID,
    }
    const fragmentData = {
      flag: flag,
      data: fullData,
      id: 1,
      state: (flag == 'detailedNsc') ? 'open50' : 'open50',
    };

    switch (componentID) {
      case 1: // CAMS
        fragmentData['componentName'] = AddCamsDetailsComponent;
        break;
      case 2: // Karvy
        fragmentData['componentName'] = AddKarvyDetailsComponent;
        break;
      case 3: // Franklin
        fragmentData['componentName'] = AddFranklinTempletionDetailsComponent;
        break;
      case 4: // fundsnet
        fragmentData['componentName'] = AddCamsFundsnetComponent;
        break;
    }
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData) || componentID == 4) {
            this.loadRTAList();
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  deleteRTA(data) {
    const dialogData = {
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.settingsService.deleteMFRTA(data.id)
          .subscribe(response => {
            this.eventService.openSnackBar("Data has been deleted successfully");
            this.loadRTAList();
            dialogRef.close();
          }, error => this.eventService.openSnackBar("Error occured"));

      },
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,
    });
  }

  getARNId(id) {
    const arn = this.arnList.find((data) => data.id == id);
    if (arn)
      return arn.number;
    return '';
  }

  getQuestion(id) {
    if (this.globalData && this.globalData.rta_cams_fund_net_security_questions_list) {
      return this.globalData.rta_cams_fund_net_security_questions_list.find((data) => data.id == id).question
    }
    return '';
  }

  toggleVisibility(data, toggle) {
    if (data) {
      if (toggle) {
        let copy = data.toString();
        return copy.replace(/./g, '').replace('', '********')
      } else {
        return data;
      }
    }
  }
}
