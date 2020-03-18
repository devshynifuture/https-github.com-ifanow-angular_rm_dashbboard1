import { Component, OnInit } from '@angular/core';
import { AddPpfComponent } from '../../../../accounts/assets/smallSavingScheme/common-component/add-ppf/add-ppf.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AddSsyComponent } from '../../../../accounts/assets/smallSavingScheme/common-component/add-ssy/add-ssy.component';
import { AddPoSavingComponent } from '../../../../accounts/assets/smallSavingScheme/common-component/add-po-saving/add-po-saving.component';
import { AddPoTdComponent } from '../../../../accounts/assets/smallSavingScheme/common-component/add-po-td/add-po-td.component';
import { AddPoRdComponent } from '../../../../accounts/assets/smallSavingScheme/common-component/add-po-rd/add-po-rd.component';
import { AddPoMisComponent } from '../../../../accounts/assets/smallSavingScheme/common-component/add-po-mis/add-po-mis.component';
import { AddScssComponent } from '../../../../accounts/assets/smallSavingScheme/common-component/add-scss/add-scss.component';
import { AddKvpComponent } from '../../../../accounts/assets/smallSavingScheme/common-component/add-kvp/add-kvp.component';
import { AddNscComponent } from '../../../../accounts/assets/smallSavingScheme/common-component/add-nsc/add-nsc.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../../actiity.service';
import { MatTableDataSource } from '@angular/material';
import { AdviceUtilsService } from '../../advice-utils.service';

@Component({
  selector: 'app-all-advice-small-savings-scheme',
  templateUrl: './all-advice-small-savings-scheme.component.html',
  styleUrls: ['./all-advice-small-savings-scheme.component.scss']
})
export class AllAdviceSmallSavingsSchemeComponent implements OnInit {

  displayedColumns: string[] = ['checkbox', 'name', 'desc', 'cvalue', 'empcon', 'emprcon', 'advice', 'astatus', 'adate', 'icon'];
  displayedColumns2: string[] = ['checkbox', 'name', 'desc', 'cvalue', 'emprcon', 'advice', 'astatus', 'adate', 'icon'];
  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'advice', 'astatus', 'adate', 'icon'];
  displayedColumns4: string[] = ['checkbox', 'name', 'desc', 'cvalue', 'advice', 'astatus', 'adate', 'icon'];
  advisorId: any;
  clientId: any;
  ppfDataSource: any;
  isLoading: boolean;
  nscDataSource: any;
  ssyDataSource: any;
  kvpDataSource: any;
  scssDataSource: any;
  posavingDataSource: any;
  pordDataSource: any;
  pomisDataSource: any;
  potdDataSource: any;
  ppfCount: any;
  nscCount: any;
  ssyCount: any;
  kvpCount: any;
  scssCount: any;
  posavingCount: any;
  potdCount: any;
  pomisCount: any;
  selectedAssetId: any = [];
  pordCount: any;

  constructor(private utilService: UtilService, private subInjectService: SubscriptionInject,private activityService:ActiityService) { }
  allAdvice = true
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAllAdviceByAsset();
  }
  getAllAdviceByAsset() {
    this.isLoading = true;
    this.ppfDataSource = new MatTableDataSource([{}, {}, {}]);
    this.nscDataSource = new MatTableDataSource([{}, {}, {}]);
    this.ssyDataSource = new MatTableDataSource([{}, {}, {}]);
    this.kvpDataSource = new MatTableDataSource([{}, {}, {}]);
    this.scssDataSource = new MatTableDataSource([{}, {}, {}]);
    this.posavingDataSource = new MatTableDataSource([{}, {}, {}]);
    this.pordDataSource = new MatTableDataSource([{}, {}, {}]);
    this.pomisDataSource = new MatTableDataSource([{}, {}, {}]);
    this.potdDataSource = new MatTableDataSource([{}, {}, {}]);
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      assetCategory: 10,
      adviceStatusId:0
    }
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllSchemeResponse(data), (error) => {
        this.ppfDataSource = [];
        this.nscDataSource = [];
        this.ssyDataSource = [];
        this.kvpDataSource = [];
        this.scssDataSource = [];
        this.posavingDataSource = [];
        this.pordDataSource = [];
        this.pomisDataSource = [];
        this.potdDataSource = [];
        this.ppfDataSource['tableFlag'] = (this.ppfDataSource.length == 0) ? false : true;
        this.nscDataSource['tableFlag'] = (this.nscDataSource.length == 0) ? false : true;
        this.ssyDataSource['tableFlag'] = (this.ssyDataSource.length == 0) ? false : true;
        this.kvpDataSource['tableFlag'] = (this.kvpDataSource.length == 0) ? false : true;
        this.scssDataSource['tableFlag'] = (this.scssDataSource.length == 0) ? false : true;
        this.posavingDataSource['tableFlag'] = (this.posavingDataSource.length == 0) ? false : true;
        this.pordDataSource['tableFlag'] = (this.pordDataSource.length == 0) ? false : true;
        this.pomisDataSource['tableFlag'] = (this.pomisDataSource.length == 0) ? false : true;
        this.potdDataSource['tableFlag'] = (this.potdDataSource.length == 0) ? false : true;
      }
    );
  }
  filterForAsset(data){//filter data to for showing in the table
    let filterdData=[];
    data.forEach(element => {
      var asset=element.AssetDetails;
      if(element.AdviceList.length>0){
        element.AdviceList.forEach(obj => {
          obj.assetDetails=asset;
          filterdData.push(obj);
        });
      }else{
        const obj={
          assetDetails:asset
        }
        filterdData.push(obj);
      }

    });
    return filterdData;
  }
  checkSingle(flag, selectedData, tableData, tableFlag) {
    if (flag.checked) {
      selectedData.selected = true;
      this.selectedAssetId.push(selectedData.id)
    }
    else {
      selectedData.selected = false
      this.selectedAssetId.splice(this.selectedAssetId.indexOf(selectedData.id), 1);
    }
    let countValue = AdviceUtilsService.selectSingleCheckbox(Object.assign([], tableData));
    this.getFlagCount(tableFlag, countValue)
    console.log(this.selectedAssetId)
  }
  checkAll(flag, tableDataList, tableFlag) {
    console.log(flag, tableDataList)
    const { selectedIdList, count } = AdviceUtilsService.selectAll(flag, tableDataList._data._value, this.selectedAssetId);
    this.selectedAssetId = selectedIdList;
    this.getFlagCount(tableFlag, count)
    // console.log(this.selectedAssetId);
  }
  getFlagCount(flag, count) {
    switch (true) {
      case (flag == 'ppf'):
        this.ppfCount = count;
        break;
      case (flag == 'nsc'):
        this.nscCount = count;
        break;
      case (flag == 'ssy'):
        this.ssyCount = count;
        break;
      case (flag == 'kvp'):
        this.kvpCount = count;
        break;
      case (flag == 'scss'):
        this.scssCount = count;
        break;
      case (flag == 'posaving'):
        this.posavingCount = count;
        break;
      case (flag == 'pord'):
        this.pordCount = count;
        break;
      case (flag == 'potd'):
        this.potdCount = count;
        break;
      default:
        this.pomisCount = count;
        break;
    }
  }
  getAllSchemeResponse(data){
    this.isLoading = false;
    let ppfData=this.filterForAsset(data.PPF)
    this.ppfDataSource.data = ppfData;
    let nscData=this.filterForAsset(data.NSC)
    this.nscDataSource.data = nscData;
    let ssyData=this.filterForAsset(data.SSY)
    this.ssyDataSource.data = ssyData;
    let kvpData=this.filterForAsset(data.KVP)
    this.kvpDataSource.data = kvpData;
    let scssData=this.filterForAsset(data.SCSS)
    this.scssDataSource.data = scssData;
    let poSavingData=this.filterForAsset(data.PO_Savings)
    this.posavingDataSource.data = poSavingData;
    let pordData=this.filterForAsset(data.PO_RD)
    this.pordDataSource.data = pordData;
    let pomisData=this.filterForAsset(data.PO_MIS)
    this.pomisDataSource.data = pomisData;
    let potdData=this.filterForAsset(data.PO_TD)
    this.potdDataSource.data = potdData;
    this.ppfDataSource['tableFlag'] = (data.PPF.length == 0) ? false : true;
    this.nscDataSource['tableFlag'] = (data.NSC.length == 0) ? false : true;
    this.ssyDataSource['tableFlag'] = (data.SSY.length == 0) ? false : true;
    this.kvpDataSource['tableFlag'] = (data.KVP.length == 0) ? false : true;
    this.scssDataSource['tableFlag'] = (data.SCSS.length == 0) ? false : true;
    this.posavingDataSource['tableFlag'] = (data.PO_Savings.length == 0) ? false : true;
    this.pordDataSource['tableFlag'] = (data.PO_RD.length == 0) ? false : true;
    this.pomisDataSource['tableFlag'] = (data.PO_MIS.length == 0) ? false : true;
    this.potdDataSource['tableFlag'] = (data.PO_TD.length == 0) ? false : true;
    console.log("::::::::::::::::", data)
  }
  openAddPPF(data) {
    const fragmentData = {
      flag: 'addPpf',
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
            // this.getPpfSchemeData();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  openAddNSC(data, flag) {
    const fragmentData = {
      flag: 'addNsc',
      data,
      id: 1,
      state: (flag == 'detailedNsc') ? 'open35' : 'open',
      componentName: AddNscComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getNscSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
       
      }
    );
  }
  openAddKVP(data, flag) {
    const fragmentData = {
      flag: 'addKVP',
      data,
      id: 1,
      state: (flag == 'detailedKvp') ? 'open35' : 'open',
      componentName : AddKvpComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getKvpSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
       
      }
    );
  }
  openAddSCSS(data, flag) {
    const fragmentData = {
      flag: 'addSCSS',
      data,
      id: 1,
      state: (flag == 'detailedScss') ? 'open35' : 'open',
      componentName:  AddScssComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getScssSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
       
      }
    );
  }
  openAddPOMIS(data) {
    const fragmentData = {
      flag: 'addPOMIS',
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
            // this.getPoMisSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
        
      }
    );
  }
  openAddPORD(data) {
    const fragmentData = {
      flag: 'addPORD',
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
            // this.getPoRdSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  openAddPOTD(data) {
    const fragmentData = {
      flag: 'addPoTd',
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
            // this.getPoTdSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
        
      }
    );
  }
  openAddPOSAVING(data) {
    const fragmentData = {
      flag: 'addPOSAVING',
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
            // this.getPoSavingSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
        
      }
    );
  }
  addOpenSSY(data, flag) {
    const fragmentData = {
      flag: 'addSyss',
      data,
      id: 1,
      state: (flag == 'detailedSsy') ? 'open35' : 'open',
      componentName: AddSsyComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getSsySchemedata();
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
export interface PeriodicElement4{
  name: string;
  desc: string;
  cvalue: string;
  advice: string;
  adate: string;
  astatus: string;

}

const ELEMENT_DATA4: PeriodicElement4[] = [
  { name: 'Rahul Jain', desc: '1', cvalue:'20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul Jain', desc: '2', cvalue:'20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];