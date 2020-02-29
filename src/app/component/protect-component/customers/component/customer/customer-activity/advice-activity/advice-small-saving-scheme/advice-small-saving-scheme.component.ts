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
  displayedColumns2: string[] = ['checkbox', 'name', 'desc', 'cvalue', 'emprcon', 'advice', 'astatus', 'adate', 'icon'];
  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'advice', 'astatus', 'adate', 'icon'];
  displayedColumns4: string[] = ['checkbox', 'name', 'desc', 'cvalue', 'advice', 'astatus', 'adate', 'icon'];

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
  posavingDataSource: any;
  pordDataSpurce: any;
  pomisDataSpurce: any;
  ppfCount: any;
  nscCount: any;
  ssyCount: any;
  kvpCount: any;
  scssCount: any;
  posavingCount: any;
  potdCount: any;
  pomisCount: any;
  pordCount: any;
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
    this.isLoading = true;
    this.ppfDataSource = [{}, {}, {}];
    this.nscDataSpurce = [{}, {}, {}];
    this.ssyDataSpurce = [{}, {}, {}];
    this.kvpDataSpurce = [{}, {}, {}];
    this.scssDataSpurce = [{}, {}, {}];
    this.pordDataSpurce = [{}, {}, {}];
    this.pomisDataSpurce = [{}, {}, {}];
    this.potdDataSource = [{}, {}, {}];
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllSchemeResponse(data), (error) => {
      }
    );
  }
  getAllSchemeResponse(data) {
    this.isLoading = false;
    this.ppfDataSource = new MatTableDataSource(data.PPF);
    this.nscDataSpurce = new MatTableDataSource(data.NSC);
    this.ssyDataSpurce = new MatTableDataSource(data.SSY);
    this.kvpDataSpurce = new MatTableDataSource(data.KVP);
    this.scssDataSpurce = new MatTableDataSource(data.SCSS);
    this.posavingDataSource = new MatTableDataSource(data.PO_Savings);
    this.pordDataSpurce = new MatTableDataSource(data.PO_RD);
    this.pomisDataSpurce = new MatTableDataSource(data.PO_MIS);
    this.potdDataSource = new MatTableDataSource(data.PO_TD);
    this.ppfDataSource['tableFlag'] = (data.PPF.length == 0) ? false : true;
    this.nscDataSpurce['tableFlag'] = (data.NSC.length == 0) ? false : true;
    this.ssyDataSpurce['tableFlag'] = (data.SSY.length == 0) ? false : true;
    this.kvpDataSpurce['tableFlag'] = (data.KVP.length == 0) ? false : true;
    this.scssDataSpurce['tableFlag'] = (data.SCSS.length == 0) ? false : true;
    this.posavingDataSource['tableFlag'] = (data.PO_Savings.length == 0) ? false : true;
    this.pordDataSpurce['tableFlag'] = (data.PO_RD.length == 0) ? false : true;
    this.pomisDataSpurce['tableFlag'] = (data.PO_MIS.length == 0) ? false : true;
    this.potdDataSource['tableFlag'] = (data.PO_TD.length == 0) ? false : true;
    console.log(data)
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
        this.scssCount = count;
        break;
      case (flag == 'potd'):
        this.potdCount = count;
        break;
      default:
        this.pomisCount = count;
        break;
    }
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
  openAddEdit(value, data) {
    let Component = (value == "advicePPF") ? AddPpfComponent : (value == "adviceNSC") ? AddNscComponent : (value == "adviceSSY") ? AddSsyComponent : (value == "adviceKVP") ? AddKvpComponent : (value == "adviceSCSS") ? AddScssComponent : (value == "advicePoSaving") ? AddPoSavingComponent : (value == 'advicePORD') ? AddPoRdComponent : (value == "advicePOTD") ? AddPoTdComponent : AddPoMisComponent;
    const fragmentData = {
      flag: value,
      data: data == null? value:data,
      id: 1,
      state: 'open',
      componentName: Component
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
