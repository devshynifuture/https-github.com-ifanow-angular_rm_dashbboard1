import { Component, OnInit, ViewChild } from '@angular/core';
import { AddPpfComponent } from '../../../accounts/assets/smallSavingScheme/common-component/add-ppf/add-ppf.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AddNscComponent } from '../../../accounts/assets/smallSavingScheme/common-component/add-nsc/add-nsc.component';
import { AddKvpComponent } from '../../../accounts/assets/smallSavingScheme/common-component/add-kvp/add-kvp.component';
import { AddScssComponent } from '../../../accounts/assets/smallSavingScheme/common-component/add-scss/add-scss.component';
import { AddPoMisComponent } from '../../../accounts/assets/smallSavingScheme/common-component/add-po-mis/add-po-mis.component';
import { AddPoRdComponent } from '../../../accounts/assets/smallSavingScheme/common-component/add-po-rd/add-po-rd.component';
import { AddPoTdComponent } from '../../../accounts/assets/smallSavingScheme/common-component/add-po-td/add-po-td.component';
import { AddPoSavingComponent } from '../../../accounts/assets/smallSavingScheme/common-component/add-po-saving/add-po-saving.component';
import { AddSsyComponent } from '../../../accounts/assets/smallSavingScheme/common-component/add-ssy/add-ssy.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../actiity.service';
import { MatSort, MatTableDataSource } from '@angular/material';
import { AdviceUtilsService } from '../advice-utils.service';

@Component({
  selector: 'app-advice-small-saving-scheme',
  templateUrl: './advice-small-saving-scheme.component.html',
  styleUrls: ['./advice-small-saving-scheme.component.scss']
})
export class AdviceSmallSavingSchemeComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'name', 'desc', 'cvalue', 'empcon', 'emprcon', 'advice', 'astatus', 'adate', 'icon'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  displayedColumns2: string[] = ['checkbox', 'name', 'desc', 'cvalue', 'emprcon', 'advice', 'astatus', 'adate', 'icon'];
  dataSource2 = new MatTableDataSource(ELEMENT_DATA2);
  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'advice', 'astatus', 'adate', 'icon'];
  dataSource3 = new MatTableDataSource(ELEMENT_DATA1);
  displayedColumns4: string[] = ['checkbox', 'name', 'desc', 'cvalue', 'advice', 'astatus', 'adate', 'icon'];
  dataSource4 = new MatTableDataSource(ELEMENT_DATA4);
  advisorId: any;
  clientId: any;
  isLoading: boolean;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ppfDataSource: any;
  potdDataSource: any;
  selectedAssetId: any = [];
  nscDataSpurce: any;
  ssyDataSpurce: any;
  kvpDataSpurce: any;
  scssDataSpurce: any;
  posavingDataSpurce: any;
  pordDataSpurce: any;
  pomisDataSpurce: any;
  constructor(private utilService: UtilService, private subInjectService: SubscriptionInject, private activityService: ActiityService) { }
  allAdvice = false
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAdviceByAsset();
  }
  getAdviceByAsset() {
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      assetCategory: 10
    }
    this.ppfDataSource = [{}, {}, {}];
    this.nscDataSpurce = [{}, {}, {}];
    this.ssyDataSpurce = [{}, {}, {}];
    this.kvpDataSpurce = [{}, {}, {}];
    this.scssDataSpurce = [{}, {}, {}];
    this.pordDataSpurce = [{}, {}, {}];
    this.pomisDataSpurce = [{}, {}, {}];
    this.potdDataSource = [{}, {}, {}];
    this.isLoading = true;
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllSchemeResponse(data), (error) => {
      }
    );
  }
  getAllSchemeResponse(data) {
    this.isLoading = false;
    this.ppfDataSource = new MatTableDataSource(data.PPF);
    this.nscDataSpurce = data.NSC;
    this.ssyDataSpurce = data.SSY;
    this.kvpDataSpurce = data.KVP;
    this.scssDataSpurce = data.SCSS;
    this.posavingDataSpurce = data;
    this.pordDataSpurce = data.PO_RD;
    this.pomisDataSpurce = data.PO_MIS;
    this.potdDataSource = data.PO_TD;
    this.ppfDataSource['tableFlag'] = (data.PPF.length == 0) ? false : true;
    this.nscDataSpurce['tableFlag'] = (data.NSC.length == 0) ? false : true;
    this.ssyDataSpurce['tableFlag'] = (data.SSY.length == 0) ? false : true;
    this.kvpDataSpurce['tableFlag'] = (data.KVP.length == 0) ? false : true;
    this.scssDataSpurce['tableFlag'] = (data.SCSS.length == 0) ? false : true;
    this.posavingDataSpurce['tableFlag'] = (data.PPF.length == 0) ? false : true;
    this.pordDataSpurce['tableFlag'] = (data.PO_RD.length == 0) ? false : true;
    this.pomisDataSpurce['tableFlag'] = (data.PO_MIS.length == 0) ? false : true;
    this.potdDataSource['tableFlag'] = (data.PO_TD.length == 0) ? false : true;
    console.log(data)
  }
  checkAll(flag, tableDataList) {
    console.log(flag, tableDataList)
    const { dataList, selectedIdList } = AdviceUtilsService.selectAll(flag, tableDataList._data._value, this.selectedAssetId);
    this.ppfDataSource = new MatTableDataSource(dataList);
    this.selectedAssetId = selectedIdList;
    // console.log(this.selectedAssetId);
  }
  openAddPPF(data, value) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: AddPpfComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getAdviceByAsset();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  openAddNSC(data, value) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: AddNscComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getAdviceByAsset();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openAddKVP(data, value) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: AddKvpComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getAdviceByAsset();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openAddSCSS(data, value) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: AddScssComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getAdviceByAsset();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openAddPOMIS(data, value) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: AddPoMisComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getAdviceByAsset();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openAddPORD(data, value) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: AddPoRdComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getAdviceByAsset();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  openAddPOTD(data, value) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: AddPoTdComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getAdviceByAsset();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openAddPOSAVING(data, value) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: AddPoSavingComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getAdviceByAsset();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  addOpenSSY(data, value) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: AddSsyComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getAdviceByAsset();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
}
export interface PeriodicElement1 {
  name: string;
  desc: string;
  advice: string;
  adate: string;
  astatus: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { name: 'Rahul Jain', desc: '1', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul Jain', desc: '2', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];
export interface PeriodicElement {
  name: string;
  desc: string;
  cvalue: string;
  empcon: string;
  emprcon: string;
  advice: string;
  adate: string;
  astatus: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Rahul Jain', desc: '1', cvalue: 'This is', empcon: '54000', emprcon: '23123', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul Jain', desc: '2', cvalue: 'This is', empcon: '54000', emprcon: '23123', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];
export interface PeriodicElement2 {
  name: string;
  desc: string;
  cvalue: string;
  emprcon: string;
  advice: string;
  adate: string;
  astatus: string;

}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { name: 'Rahul Jain', desc: '1', cvalue: 'This is', emprcon: '23123', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul Jain', desc: '2', cvalue: 'This is', emprcon: '23123', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];
export interface PeriodicElement4 {
  name: string;
  desc: string;
  cvalue: string;
  advice: string;
  adate: string;
  astatus: string;

}

const ELEMENT_DATA4: PeriodicElement4[] = [
  { name: 'Rahul Jain', desc: '1', cvalue: '20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul Jain', desc: '2', cvalue: '20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];