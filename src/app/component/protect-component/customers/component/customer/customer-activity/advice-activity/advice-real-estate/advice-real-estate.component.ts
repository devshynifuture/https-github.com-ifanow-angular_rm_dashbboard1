import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectAdviceComponent } from '../select-advice/select-advice.component';
import { UtilService } from 'src/app/services/util.service';
import { CustomerService } from '../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AddRealEstateComponent } from '../../../accounts/assets/realEstate/add-real-estate/add-real-estate.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../actiity.service';
import { AdviceUtilsService } from '../advice-utils.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { SuggestAdviceComponent } from '../suggest-advice/suggest-advice.component';

@Component({
  selector: 'app-advice-real-estate',
  templateUrl: './advice-real-estate.component.html',
  styleUrls: ['./advice-real-estate.component.scss']
})
export class AdviceRealAssetComponent implements OnInit {
  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'pvalue', 'mvalue', 'ngain', 'advice', 'astatus', 'adate', 'icon'];
  dataSource3;
  advisorId: any;
  clientId: any;
  isLoading: any;
  dataSource: any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selectedAssetId: any = [];
  realEstateCount: number;

  constructor(private eventService: EventService, public dialog: MatDialog, private subInjectService: SubscriptionInject,
    private cusService: CustomerService, private activityService: ActiityService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAssetAll();
  }


  allAdvice = false;
  getAssetAll() {
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      assetCategory: 8
    }
    this.dataSource = [{}, {}, {}];
    this.isLoading = true;
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllAssetResponse(data), (error) => {
      }
    );
  }
  getAllAssetResponse(data) {
    this.isLoading = false;
    this.dataSource = new MatTableDataSource(data.REAL_ESTATE);
    this.dataSource['tableFlag'] = (data.REAL_ESTATE.length == 0) ? false : true;
    this.dataSource.sort = this.sort
    console.log(data);
  }
  checkAll(flag, tableDataList) {
    console.log(flag, tableDataList)
    const { selectedIdList, count } = AdviceUtilsService.selectAll(flag, tableDataList._data._value, this.selectedAssetId);
    this.realEstateCount = count;
    this.selectedAssetId = selectedIdList;
    console.log(this.selectedAssetId);
  }
  checkSingle(flag, selectedData, tableData) {
    if (flag.checked) {
      selectedData.selected = true;
      this.selectedAssetId.push(selectedData.id)
    }
    else {
      selectedData.selected = false
      this.selectedAssetId.splice(this.selectedAssetId.indexOf(selectedData.id), 1)
    }
    this.realEstateCount = AdviceUtilsService.selectSingleCheckbox(Object.assign([], tableData));
  }
  openRealEstate(value, data) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: SuggestAdviceComponent,
      childComponent: AddRealEstateComponent,
      childData: { data: null, flag: value },
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {

        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
          }
          this.getAssetAll();
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openselectAdvice(data) {
    const fragmentData = {
      flag: 'openselectAdvice',
      data,
      componentName: SelectAdviceComponent,

      state: 'open65'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
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
      if (result != undefined) {
        console.log(result, this.dataSource.data, 'delete result');
        const tempList = [];
        this.dataSource.data.forEach(singleElement => {
          if (singleElement.id != result.id) {
            tempList.push(singleElement);
          }
        });
        this.dataSource.data = tempList;
      }
    });
  }
}