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
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-mf-rta-details',
  templateUrl: './mf-rta-details.component.html',
  styleUrls: ['./mf-rta-details.component.scss']
})
export class MfRtaDetailsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  displayedColumns1: string[] = ['position', 'name', 'weight', 'email', 'mail', 'use', 'icons'];
  displayedColumns2: string[] = ['position', 'name', 'weight', 'email', 'mail', 'icons'];

  camsDS:MatTableDataSource<any>;
  karvyDS:MatTableDataSource<any>;
  frankDS:MatTableDataSource<any>;
  fundsDS:MatTableDataSource<any>;

  advisorId: any;
  globalData:any = {};
  mfRTAlist:any = {};
  arnList:any[] = [];

  constructor(
    private eventService: EventService,
    private utilService: UtilService, 
    private subInjectService: SubscriptionInject,
    private settingsService: SettingsService
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.initializeData();
  }

  initializeData(){
    this.settingsService.getArnGlobalData().subscribe((res)=>{
      this.globalData = res;
      console.log(res);
    });
    this.getArnDetails();
    this.loadRTAList();
  }

  getArnDetails() {
    this.settingsService.getArnlist({advisorId: this.advisorId}).subscribe((data)=> {
      this.arnList = data || [];
    });
  }

  loadRTAList(){
    const jsonData = {advisorId: this.advisorId}
    this.settingsService.getMFRTAList(jsonData).subscribe((res)=> {
      this.mfRTAlist = res || {};
      this.createDataSource();
      console.log(res);
    })
  }

  createDataSource(){
    this.camsDS = new MatTableDataSource(this.mfRTAlist.camsDS);
    this.karvyDS = new MatTableDataSource(this.mfRTAlist.karvyDS);
    this.frankDS = new MatTableDataSource(this.mfRTAlist.frankDS);
    this.fundsDS = new MatTableDataSource(this.mfRTAlist.camsDS);
  }

  openInSideBar(componentID, data, flag) {

    if(this.arnList.length == 0) {
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
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.loadRTAList();
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
}
