import { SuggestAdviceComponent } from './../suggest-advice/suggest-advice.component';
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
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { AdviceUtilsService } from '../advice-utils.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

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
  nscDataSource: any;
  ssyDataSource: any;
  kvpDataSource: any;
  scssDataSource: any;
  posavingDataSource: any;
  pordDataSource: any;
  pomisDataSource: any;
  ppfCount: any;
  nscCount: any;
  ssyCount: any;
  kvpCount: any;
  scssCount: any;
  posavingCount: any;
  potdCount: any;
  pomisCount: any;
  pordCount: any;
  constructor(public dialog: MatDialog, private utilService: UtilService, private subInjectService: SubscriptionInject, private activityService: ActiityService) { }
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
    this.ppfDataSource = new MatTableDataSource([{}, {}, {}]);
    this.nscDataSource = new MatTableDataSource([{}, {}, {}]);
    this.ssyDataSource = new MatTableDataSource([{}, {}, {}]);
    this.kvpDataSource = new MatTableDataSource([{}, {}, {}]);
    this.scssDataSource = new MatTableDataSource([{}, {}, {}]);
    this.posavingDataSource = new MatTableDataSource([{}, {}, {}]);
    this.pordDataSource = new MatTableDataSource([{}, {}, {}]);
    this.pomisDataSource = new MatTableDataSource([{}, {}, {}]);
    this.potdDataSource = new MatTableDataSource([{}, {}, {}]);
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllSchemeResponse(data), (error) => {
      }
    );
  }
  getAllSchemeResponse(data) {
    this.isLoading = false;
    this.ppfDataSource.data = data.PPF;
    this.nscDataSource.data = data.NSC;
    this.ssyDataSource.data = data.SSY;
    this.kvpDataSource.data = data.KVP;
    this.scssDataSource.data = data.SCSS;
    this.posavingDataSource.data = data.PO_Savings;
    this.pordDataSource.data = data.PO_RD;
    this.pomisDataSource.data = data.PO_MIS;
    this.potdDataSource.data = data.PO_TD;
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
      data,
      id: 1,
      state: 'open',
      componentName: SuggestAdviceComponent,
      childComponent: Component,
      childData: { data: null, flag: value },
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {

        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
          }
          this.getAdviceByAsset();
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  deleteModal(value, subData) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {

      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
