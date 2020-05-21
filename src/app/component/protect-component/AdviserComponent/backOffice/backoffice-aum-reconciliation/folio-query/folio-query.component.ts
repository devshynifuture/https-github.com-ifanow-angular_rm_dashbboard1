import { ReconciliationDetailsViewComponent } from './../../../../SupportComponent/common-component/reconciliation-details-view/reconciliation-details-view.component';
import { SubscriptionInject } from './../../../Subscriptions/subscription-inject.service';
import { UtilService } from './../../../../../../services/util.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ReconciliationService } from '../reconciliation/reconciliation.service';
import { FolioMasterDetailViewComponent } from '../folio-master-detail-view/folio-master-detail-view.component';
import { AuthService } from '../../../../../../auth-service/authService';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-folio-query',
  templateUrl: './folio-query.component.html',
  styleUrls: ['./folio-query.component.scss']
})
export class FolioQueryComponent implements OnInit {
  advisorId = AuthService.getAdvisorId();
  errorMsg: string;
  isLoadingForDropDownGroupHead: boolean = false;
  isLoadingForDropDownInvestor: boolean = false;
  folioQueryGroupHead = new FormControl();
  folioQueryInvestor = new FormControl();
  optionList = [
    { name: 'Investor', value: 1 },
    { name: 'Group Head', value: 2 },
    { name: 'PAN', value: 3 },
    { name: 'Folio Number', value: 4 }
  ]

  arrayOfGroupHeadName: any[] = [];
  arrayOfInvestorName: any[] = [];
  arrayInvestorNameError: boolean;
  arrayGroupHeadNameError: boolean;

  constructor(
    private reconService: ReconciliationService,
    private subInjectService: SubscriptionInject,
  ) { }
  displayedColumns: string[] = ['folioNumber', 'schemeName', 'investorName', 'arnRiaCode', 'reconStatus', 'transactions', 'folioDetails'];
  isSearchDone: boolean = false;
  isLoading: boolean = false;
  dataSource = new MatTableDataSource<folioQueryI>(ELEMENT_DATA);

  ngOnInit() {
    this.dataSource.data = ELEMENT_DATA;
    this.activateValueChanges()
  }

  activateValueChanges() {
    this.folioQueryGroupHead.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.arrayOfGroupHeadName = [];
          this.isLoadingForDropDownGroupHead = true;
        }),
        switchMap(value => this.getGroupHeadNameList(value)
          .pipe(
            finalize(() => {
              this.isLoadingForDropDownGroupHead = false
            }),
          )
        )
      )
      .subscribe(data => {
        this.arrayOfGroupHeadName = data;
        if (data && data.length > 0) {
          this.arrayGroupHeadNameError = false;
        } else {
          this.arrayGroupHeadNameError = true;
          this.errorMsg = 'No data Found';
        }
      });

    this.folioQueryInvestor.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.arrayOfInvestorName = [];
          this.isLoadingForDropDownInvestor = true;
        }),
        switchMap(value => this.getInvestorNameList(value)
          .pipe(
            finalize(() => {
              this.isLoadingForDropDownInvestor = false
            }),
          )
        )
      )
      .subscribe(data => {
        this.arrayOfInvestorName = data;
        if (data && data.length > 0) {
          this.arrayInvestorNameError = false;
        } else {
          this.arrayInvestorNameError = true;
          this.errorMsg = 'No data Found';
        }
      });
  }

  displayFn(value): string | undefined {
    return value ? value.name : undefined;
  }

  getGroupHeadNameList(value) {
    const data = {
      advisorId: this.advisorId,
      clientName: value,
      arnRiaDetailsId: -1,
      parentId: -1
    }
    return this.reconService.getGroupHeadNameValues(data);
  }

  getInvestorNameList(value) {
    const data = {
      advisorId: this.advisorId,
      familyMemberName: value,
      arnRiaDetailsId: -1,
      parentId: -1
    }
    return this.reconService.getInvestorNameValues(data);
  }

  search(flag, value, searchFrom) {
    // search query logic
    // on hold

    const data = {
      flag_search: flag,
      advisorId: this.advisorId,
      key: value
    };

    this.reconService.getFolioQueryDataListValues(data)
      .subscribe(res => {
        if (res && res.length !== 0) {
          let arrValue = [];
          res.forEach(element => {
            arrValue.push({
              arnRiaCode: element.brokerCode ? element.brokerCode : '-',
              schemeName: element.shemeName,
              investorName: element.investorName,
              folioNumber: element.folioNumber,
              reconStatus: element.isMapped === -1 ? 'unmapped' : 'mapped',
              mutualFundTransaction: element.mutualFundTransaction,
              mutualFundId: element.mutualFundId,
              unitsRta: element.aumUnits,
              unitsIfanow: element.calculatedUnits,
              difference: (element.calculatedUnits - element.aumUnits).toFixed(3),
              schemeCode: element.schemeCode,
              aumDate: element.aumDate,
              id: element.id
            })
          });
          this.dataSource.data = arrValue;
        }
        else {
          this.dataSource.data = null;
        }
        // toggling view
        if (searchFrom !== 'navInputSearch') {
          this.isSearchDone = !this.isSearchDone;
        }
      })

  }

  openReconDetailView(flag, data) {
    let tableData = data.mutualFundTransaction;
    let freezeDate = null;
    const fragmentData = {
      flag,
      data: { ...data, tableType: flag, tableData, freezeDate },
      id: 1,
      state: 'open',
      componentName: ReconciliationDetailsViewComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {

            if (sideBarData.refreshRequired) {
              // this.getDataFromObsAfterDeletingTransacn();
              // this.isSearchDone = !this.isSearchDone;
            }
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  toggleFolioDetailList() {
    if (this.isSearchDone) {
      this.isSearchDone = false;
    }
  }

  openFolioMasterDetailView(flag, data) {
    const fragmentData = {
      flag,
      data,
      id: 1,
      state: 'open40',
      componentName: FolioMasterDetailViewComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }


}

interface folioQueryI {
  folioNumber: string;
  schemeName: string;
  investorName: string;
  arnRiaCode: string;
  reconStatus: string;
  transactions: string;
  folioDetails: string;
}

const ELEMENT_DATA: folioQueryI[] = [
  { folioNumber: '', schemeName: '', investorName: '', arnRiaCode: '', reconStatus: '', transactions: '', folioDetails: '' },
  { folioNumber: '', schemeName: '', investorName: '', arnRiaCode: '', reconStatus: '', transactions: '', folioDetails: '' },
  { folioNumber: '', schemeName: '', investorName: '', arnRiaCode: '', reconStatus: '', transactions: '', folioDetails: '' },

]
