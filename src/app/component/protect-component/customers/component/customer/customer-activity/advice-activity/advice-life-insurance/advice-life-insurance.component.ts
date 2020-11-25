import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../actiity.service';
import { AdviceUtilsService } from '../advice-utils.service';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { SuggestAdviceComponent } from '../suggest-advice/suggest-advice.component';
import { AddInsuranceComponent } from '../../../../common-component/add-insurance/add-insurance.component';
import { forkJoin } from 'rxjs';
import { CustomerService } from '../../../customer.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-advice-life-insurance',
  templateUrl: './advice-life-insurance.component.html',
  styleUrls: ['./advice-life-insurance.component.scss']
})
export class AdviceLifeInsuranceComponent implements OnInit {
  displayedColumns3: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'mdate', 'advice', 'astatus', 'adate', 'icon'];
  clientId: any;
  advisorId: any;
  lifeInsuranceList: any;
  isLoading: boolean;
  allAdvice = false;
  stockCount: number;
  selectedAssetId: any = [];
  termDataSource: any;
  traditionalDataSource: any;
  ulipDataSource: any;
  dataSource: any;
  termCount: any;
  traditionalCount: any;
  ulipCount: any;
  displayList: any;
  object: { data: any; displayList: any; showInsurance: string; insuranceSubTypeId: number; insuranceTypeId: number; };

  constructor(public dialog: MatDialog, private cusService: CustomerService, private subInjectService: SubscriptionInject, private activityService: ActiityService, private eventService: EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAllCategory();
  }
  getAllCategory() {
    this.isLoading = true;
    this.termDataSource = [{}, {}, {}];
    this.traditionalDataSource = [{}, {}, {}];
    this.ulipDataSource = [{}, {}, {}];
    this.activityService.getAllCategory('').subscribe(
      data => {
        console.log(data);
        this.getAdviceByAsset();
      }, (error) => {
        this.eventService.openSnackBar('error', 'Dismiss');
      }
    );
  }
  getAdviceByAsset() {
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      // assetCategory: 7,
      // adviceStatusId: 1,
      categoryMasterId: 3,
      categoryTypeId: 3,
      status: 1
    }
    const displayList = this.cusService.getInsuranceGlobalData({});
    const allAsset = this.activityService.getAllAsset(obj);
    forkJoin(displayList, allAsset).subscribe(result => {
      this.displayList = result[0];
      this.getAllSchemeResponse(result[1]);
    }, (error) => {
      this.eventService.openSnackBar('error', 'Dismiss');
      this.termDataSource = [];
      this.traditionalDataSource = [];
      this.ulipDataSource = [];
      this.termDataSource['tableFlag'] = (this.termDataSource.length == 0) ? false : true;
      this.traditionalDataSource['tableFlag'] = (this.traditionalDataSource.length == 0) ? false : true;
      this.ulipDataSource['tableFlag'] = (this.ulipDataSource.length == 0) ? false : true;
    });
    // this.activityService.getAllAsset(obj).subscribe(
    //   data => this.getAllSchemeResponse(data), (error) => {
    //     this.termDataSource = [];
    //     this.traditionalDataSource = [];
    //     this.ulipDataSource = [];
    //     this.termDataSource['tableFlag'] = (this.termDataSource.length == 0) ? false : true;
    //     this.traditionalDataSource['tableFlag'] = (this.traditionalDataSource.length == 0) ? false : true;
    //     this.ulipDataSource['tableFlag'] = (this.ulipDataSource.length == 0) ? false : true;
    //   }
    // );
  }
  filterForAsset(data) {//filter data to for showing in the table
    let filterdData = [];
    data.forEach(element => {
      var asset = element.AssetDetails;
      if (element.AdviceList.length > 0) {
        element.AdviceList.forEach(obj => {
          obj.assetDetails = asset;
          filterdData.push(obj);
        });
      } else {
        const obj = {
          assetDetails: asset
        }
        filterdData.push(obj);
      }

    });
    return filterdData;
  }
  getAllSchemeResponse(data) {
    this.isLoading = false;
    console.log('data', data)
    this.dataSource = data;
    let termData = data.TERM_LIFE_INSURANCE
    // let termData = this.filterForAsset(data.TERM_LIFE_INSURANCE)
    this.termDataSource = new MatTableDataSource(termData);
    console.log('fddata', termData);
    // this.termDataSource.sort = this.sort
    let traditionalData = data.TRADITIONAL_LIFE_INSURANCE;
    this.traditionalDataSource = new MatTableDataSource(traditionalData);
    console.log('rdData', traditionalData)
    // this.traditionalDataSource.sort = this.sort
    let ulipData = data.ULIP_LIFE_INSURANCE;
    this.ulipDataSource = new MatTableDataSource(ulipData);
    console.log('ulipData', ulipData)

    // this.ulipDataSource.sort = this.sort
    this.termDataSource['tableFlag'] = data.TERM_LIFE_INSURANCE.length == 0 ? false : true;
    this.traditionalDataSource['tableFlag'] = data.TRADITIONAL_LIFE_INSURANCE.length == 0 ? false : true;
    this.ulipDataSource['tableFlag'] = data.ULIP_LIFE_INSURANCE.length == 0 ? false : true;
  }


  checkSingle(flag, selectedData, tableData, tableFlag) {
    if (flag.checked) {
      selectedData.selected = true;
      this.selectedAssetId.push(selectedData.InsuranceDetails.id)
    }
    else {
      selectedData.selected = false
      this.selectedAssetId.splice(this.selectedAssetId.indexOf(selectedData.InsuranceDetails.id), 1)
    }
    let countValue = AdviceUtilsService.selectSingleCheckbox(Object.assign([], tableData));
    this.getFlagCount(tableFlag, countValue)
    console.log(this.selectedAssetId)
  }

  checkAll(flag, tableDataList, tableFlag) {
    console.log(flag, tableDataList)
    const { selectedIdList, count } = AdviceUtilsService.selectAll(flag, tableDataList._data._value, this.selectedAssetId);
    this.getFlagCount(tableFlag, count)
    this.selectedAssetId = selectedIdList;
    console.log(this.selectedAssetId);
  }
  getFlagCount(flag, count) {
    switch (true) {
      case (flag == 'term'):
        this.termCount = count;
        break;
      case (flag == 'traditional'):
        this.traditionalCount = count;
        break;
      default:
        this.ulipCount = count;
        break;
    }
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
  openAddEditAdvice(value, data) {
    this.object = { data: data, displayList: this.displayList, showInsurance: '', insuranceSubTypeId: 1, insuranceTypeId: 1 }
    switch (value) {
      case "Term Insurance":
        this.object.insuranceSubTypeId = 1;
        this.object.showInsurance = 'TERM';
        data ? data.InsuranceDetails.insuranceSubTypeId = 1 : '';
        break;
      case "Traditional Insurance":
        this.object.insuranceSubTypeId = 2;
        this.object.showInsurance = 'TERM'
        data ? data.InsuranceDetails.insuranceSubTypeId = 2 : '';
        break;
      case "Ulip Insurance":
        this.object.insuranceSubTypeId = 3;
        this.object.showInsurance = 'TERM';
        data ? data.InsuranceDetails.insuranceSubTypeId = 3 : '';

        break;
    }

    let Component = AddInsuranceComponent;

    const fragmentData = {
      flag: 'Advice Insurance',
      data,
      id: 1,
      state: 'open',
      componentName: SuggestAdviceComponent,
      childComponent: Component,
      childData: { data: data ? data.InsuranceDetails : null, displayList: this.displayList, showInsurance: this.object.showInsurance, insuranceSubTypeId: this.object.insuranceSubTypeId, insuranceTypeId: 1, flag: 'Advice Insurance' },
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
}
