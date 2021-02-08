import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from './../../../Subscriptions/subscription-inject.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ReconciliationDetailsViewComponent } from 'src/app/component/protect-component/SupportComponent/common-component/reconciliation-details-view/reconciliation-details-view.component';
import { UtilService } from 'src/app/services/util.service';
import { ReconciliationService } from '../reconciliation/reconciliation.service';
import { EventService } from '../../../../../../Data-service/event.service';
import { Validators, FormBuilder } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActiityService } from 'src/app/component/protect-component/customers/component/customer/customer-activity/actiity.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';

@Component({
  selector: 'app-duplicate-data',
  templateUrl: './duplicate-data.component.html',
  styleUrls: ['./duplicate-data.component.scss']
})
export class DuplicateDataComponent implements OnInit {
  brokerId: any;
  rtId: any;
  mutualFundTransactions: any;
  adminAdvisorIds: any[] = [];
  aumDate: any;
  selectBrokerForm = this.fb.group({
    selectBrokerId: [, Validators.required],
    selectRtList: [, Validators.required]
  });
  brokerList: any;
  rtList: any;
  constructor(
    private subInjectService: SubscriptionInject,
    private reconService: ReconciliationService,
    private eventService: EventService,
    private fb: FormBuilder,
    private activityService: ActiityService,
    private cusService: CustomerService
  ) {
  }

  advisorId = AuthService.getAdvisorId();

  parentId = AuthService.getParentId() ? AuthService.getParentId() : this.advisorId;
  dataSource = new MatTableDataSource<DuplicateI>(ELEMENT_DATA);
  displayedColumns: string[] = ['arnRia', 'name', 'folioNumber', 'unitsIfanow', 'unitsRta', 'difference', 'transactions'];
  isLoading: boolean = false;
  aumList: [] = [];
  duplicateDataList: DuplicateI[] = [];
  isRmLogin = AuthService.getUserInfo().isRmLogin;
  rtaList = [];

  ngOnInit() {
    //this.getRtAndArn();
    this.getRtaList();    // this.dataSource = new MatTableDataSource<DuplicateI>(ELEMENT_DATA);
  }

  getRtAndArn() {
    this.isLoading = true;
    // const rtType = this.reconService.getRTListValues({}).pipe(
    //   catchError(error => of(null))
    // );
    // const arnRiaList = this.reconService.getBrokerListValues({ advisorId: this.advisorId }).pipe(
    //   catchError(error => of(null))
    // );

    const obj2 = {
      advisorId: AuthService.getAdvisorId(),
    };
    let obj = {}
    const rtType = this.reconService.getRTListValues(obj).pipe(
      catchError(error => of(''))
    );
    const arnRiaList = this.reconService.getBrokerListValues(obj2).pipe(
      catchError(error => of(''))
    );
    forkJoin(rtType, arnRiaList).subscribe(result => {
      if (result[0] && result[1]) {
      }

    }, (error) => {
      this.eventService.openSnackBar(error, 'Dismiss');
    });
    // const rtType = this.reconService.getRTListValues({})
    // const arnRiaList = this.reconService.getBrokerListValues({ advisorId: this.advisorId })
    // forkJoin(rtType, arnRiaList).subscribe(result => {
    //   let res = result[0];
    //   if (res && res.length !== 0) {
    //     res.forEach(element => {
    //       if (element.name !== 'SUNDARAM' && element.name !== 'PRUDENT' && element.name !== 'NJ_NEW' && element.name !== 'NJ') {
    //         this.rtaList.push({
    //           name: element.name == 'FRANKLIN_TEMPLETON' ? 'FRANKLIN' : element.name,
    //           value: element.id,
    //           type: 'rta'
    //         });
    //       }
    //     });
    //     this.rtList = res;
    //     this.selectBrokerForm.get('selectRtList').patchValue(this.rtList[0].name, { emitEvent: false });
    //     this.teamMemberListGet()
    //   } else {
    //     this.eventService.openSnackBar('Error In Fetching RTA List', 'Dismiss');
    //   }
    //   if (result[1]) {
    //     this.brokerList = result[1];
    //     this.selectBrokerForm.get('selectBrokerId').patchValue(this.brokerList[0].id, { emitEvent: false });
    //   }
    // }, err => {
    //   console.error(err)
    // })
  }
  getBrokerList() {
    this.reconService.getBrokerListValues({ advisorId: this.advisorId })
      .subscribe(res => {
        if (res) {
          console.log("this is broker list must be called 1 time ", res);
          this.brokerList = res;
          this.selectBrokerForm.get('selectBrokerId').patchValue(this.brokerList[0].id, { emitEvent: false });
        }
      });
  }
  getRtaList() {
    this.isLoading = true;
    this.reconService.getRTListValues({})
      .subscribe(res => {
        if (res && res.length !== 0) {
          res.forEach(element => {
            if (element.name !== 'SUNDARAM' && element.name !== 'PRUDENT' && element.name !== 'NJ_NEW' && element.name !== 'NJ') {
              this.rtaList.push({
                name: element.name == 'FRANKLIN_TEMPLETON' ? 'FRANKLIN' : element.name,
                value: element.id,
                type: 'rta'
              });
            }
          });
          this.rtList = res;
          this.selectBrokerForm.get('selectRtList').patchValue(this.rtList[0].id, { emitEvent: false });

          this.getBrokerList()
          this.teamMemberListGet()
        } else {
          this.eventService.openSnackBar('Error In Fetching RTA List', 'Dismiss');
        }
      });
  }

  teamMemberListGet() {
    this.reconService.getTeamMemberListValues({ advisorId: this.advisorId })
      .subscribe(data => {
        if (data && data.length !== 0) {
          data.forEach(element => {
            this.adminAdvisorIds.push(element.adminAdvisorId);
          });
          this.duplicateFolioData();
        } else {
          this.adminAdvisorIds = [...this.advisorId];
          this.eventService.openSnackBar('No Team Member Found', 'Dismiss');
        }
      });
  }

  getRtNameFromRtId(id) {
    return this.rtaList.find(c => c.id === id).name;
  }

  openReconciliationDetails(value, data, tableType) {
    let tableData = [];
    if (this.mutualFundTransactions) {
      tableData = this.mutualFundTransactions;
    }

    const isParent = this.isRmLogin ? true : ((this.parentId === this.advisorId) ? true : false);

    // needed

    let aumDateObj = new Date(this.aumDate);
    let aumDateFormated = aumDateObj.getFullYear() + '-'
      + `${(aumDateObj.getMonth() + 1) < 10 ? '0' : ''}`
      + (aumDateObj.getMonth() + 1) + '-'
      + `${aumDateObj.getDate() < 10 ? '0' : ''}`
      + aumDateObj.getDate();

    const fragmentData = {
      flag: value,
      data: {
        ...data,
        dataForDuplicateTransactionCall: {
          advisorIds: [...this.adminAdvisorIds],
          isParent,
          parentId: this.parentId,
          aumDate: aumDateFormated,
        },
        rtId: this.rtId,
        freezeDate: data.freezeDate,
        fromAllFolioOrDuplicateTab: 2,
        arnRiaCode: data.arnRiaNumber,
        tableType,
        brokerId: this.brokerId,
        tableData
      },
      id: 1,
      state: 'open',
      componentName: ReconciliationDetailsViewComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.dataSource.data = ELEMENT_DATA;
            this.duplicateDataList = [];

            this.duplicateFolioData();
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  duplicateFolioData() {
    this.isLoading = true;
    const data = {
      advisorIds: [...this.adminAdvisorIds],
      parentId: this.parentId,
      isParent: (this.parentId === this.advisorId) ? true : false,
      // rtMasterId: this.selectBrokerForm.get('selectRtList').value,
      // arnId: this.selectBrokerForm.get('selectBrokerId').value
    };
    this.reconService.getDuplicateDataValues(data)
      .subscribe(res => {
        if (res) {

          res.forEach(item => {
            this.aumDate = item.aumDate;
            this.brokerId = item.brokerId;
            this.mutualFundTransactions = item.mutualFundTransactions;

            this.duplicateDataList.push({
              arnRia: item.arnRiaNumber,
              name: item.schemeName,
              folioNumber: item.folioNumber,
              unitsIfanow: item.balanceUnit,
              unitsRta: item.aumUnits,
              difference: String(parseInt(item.balanceUnit.toFixed(3)) - parseInt(item.aumUnits.toFixed(3))),
              transactions: '',
              date: item.aumDate,
              mutualFundId: item.id,
              freezeDate: item.freezeDate
            });
          });
          this.dataSource.data = this.duplicateDataList;
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.eventService.openSnackBar('No Duplicate Data Found!!!', 'Dismiss');
          this.dataSource.data = null;
        }
      });
  }

}

export interface DuplicateI {
  arnRia: string;
  name: string;
  folioNumber: string;
  unitsIfanow: string;
  unitsRta: string;
  difference: string;
  transactions: string;
  date: string;
  mutualFundId: string;
  freezeDate: string;
}

export const ELEMENT_DATA: DuplicateI[] = [
  { arnRia: '', name: '', folioNumber: '', unitsIfanow: '', unitsRta: '', difference: '', transactions: '', date: '', mutualFundId: '', freezeDate: '' },
  { arnRia: '', name: '', folioNumber: '', unitsIfanow: '', unitsRta: '', difference: '', transactions: '', date: '', mutualFundId: '', freezeDate: '' },
  { arnRia: '', name: '', folioNumber: '', unitsIfanow: '', unitsRta: '', difference: '', transactions: '', date: '', mutualFundId: '', freezeDate: '' },
];
