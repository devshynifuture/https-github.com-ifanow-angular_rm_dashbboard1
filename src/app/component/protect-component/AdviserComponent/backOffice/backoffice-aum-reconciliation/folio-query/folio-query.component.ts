import { ReconciliationDetailsViewComponent } from './../../../../SupportComponent/common-component/reconciliation-details-view/reconciliation-details-view.component';
import { SubscriptionInject } from './../../../Subscriptions/subscription-inject.service';
import { UtilService } from './../../../../../../services/util.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ReconciliationService } from '../reconciliation/reconciliation.service';
import { FolioMasterDetailViewComponent } from '../folio-master-detail-view/folio-master-detail-view.component';
import { AuthService } from '../../../../../../auth-service/authService';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BackOfficeService } from '../../back-office.service';

@Component({
  selector: 'app-folio-query',
  templateUrl: './folio-query.component.html',
  styleUrls: ['./folio-query.component.scss']
})
export class FolioQueryComponent implements OnInit {
  advisorId = AuthService.getAdvisorId();
  parentId = AuthService.getParentId();
  errorMsg: string;
  isLoadingForDropDownGroupHead: boolean = false;
  isLoadingForDropDownInvestor: boolean = false;
  folioQueryGroupHead = new FormControl();
  folioQueryInvestor = new FormControl();
  folioOption = new FormControl('', Validators.required);
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
  adminAdvisorIds = [];
  viewMode: string;
  arnRiaList: any;
  arnRiaValue = -1;
  isMainLoading: boolean;
  searchedObj: { flag: any; value: any; searchFrom: any; };
  inputSearchFC = new FormControl('', Validators.required);
  shouldCheckValidation = false;

  constructor(
    private reconService: ReconciliationService,
    private subInjectService: SubscriptionInject,
    private backoffice: BackOfficeService
  ) { }
  displayedColumns: string[] = ['folioNumber', 'schemeName', 'investorName', 'arnRiaCode', 'reconStatus', 'transactions', 'folioDetails'];
  isSearchDone: boolean = false;
  isLoading: boolean = false;
  dataSource = new MatTableDataSource<folioQueryI>(ELEMENT_DATA);
  subscription:any = {};

  ngOnInit() {
    this.dataSource.data = ELEMENT_DATA;
    this.subscription['folioOption'] = this.folioOption.valueChanges.subscribe(res => this.shouldCheckValidation = true);
    this.subscription['inputOption'] = this.inputSearchFC.valueChanges.subscribe(res => this.shouldCheckValidation = true);
    this.viewMode = 'Select option';
    this.getArnRiaList();
    this.activateValueChanges();
    this.teamMemberListGet();
  }

  ngOnDestroy(): void {
    if(!!this.subscription.folioOption){
      this.subscription.folioOption.unsubscribe();
    }
    if(!!this.subscription.inputOption){
      this.subscription.inputOption.unsubscribe();
    }
  }

  getArnRiaList() {
    this.backoffice.getArnRiaList(this.advisorId).subscribe(
      data => {
        if (data) {
          // this.advisorId = 0;
          this.arnRiaList = data;

          const obj = {
            number: 'All',
            id: -1
          }
          this.arnRiaList.unshift(obj);
        } else {

          // this.dataService.openSnackBar("No Arn Ria List Found", "Dismiss")
        }
      }
    )
  }
  changeValueOfArnRia(item) {
    this.viewMode = item.number;
    if (item.number != 'All') {
      this.arnRiaValue = item.id;
    } else {
      this.arnRiaValue = -1;
    }
  }
  teamMemberListGet() {
    this.reconService.getSubAdvisorListValues({ advisorId: this.advisorId })
      .subscribe(data => {
        if (data && data.length !== 0) {
          console.log('team members: ', data);
          data.forEach(element => {
            this.adminAdvisorIds.push(element);
          });
          const isIncludeID = this.adminAdvisorIds.includes(this.advisorId);
          if (!isIncludeID) {
            this.adminAdvisorIds.unshift(this.advisorId);
          }
        } else {
          this.adminAdvisorIds = [this.advisorId];

          // this.handlingDataVariable();
          // this.eventService.openSnackBar('No Team Member Found', 'Dismiss');
        }
      }, err => {
        this.adminAdvisorIds = [this.advisorId];

      });
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
      // advisorId: (this.parentId) ? -1 : (this.arnRiaValue != -1) ? [this.adminAdvisorIds] : [this.adminAdvisorIds],
      advisorId: this.parentId > 0 ? this.advisorId: -1,
      clientName: value,
      arnRiaDetailId: this.arnRiaValue,
      parentId: this.parentId ==0 ? this.advisorId : this.parentId
      // parentId: (!this.parentId || this.parentId == 0) ? -1 : this.parentId,
    }
    return this.reconService.getGroupHeadNameValues(data);
  }

  getInvestorNameList(value) {
    const data = {
      // advisorId: (this.parentId) ? -1 : (this.arnRiaValue != -1) ? [this.adminAdvisorIds] : [this.adminAdvisorIds],
      advisorId: this.parentId > 0 ? this.advisorId: -1,
      familyMemberName: value,
      arnRiaDetailId: this.arnRiaValue,
      parentId: this.parentId ==0 ? this.advisorId : this.parentId
      // parentId: (!this.parentId || this.parentId == 0) ? -1 : this.parentId,
    }
    return this.reconService.getInvestorNameValues(data);
  }

  search(flag, value, searchFrom) {
    // search query logic
    // on hold
      this.searchedObj = {
        flag,
        value,
        searchFrom
      }
      if(searchFrom === 'navInputSearch'){
        this.shouldCheckValidation = true;
      }

      const data = {
        flag_search: flag,
        advisorId: this.parentId > 0 ? this.advisorId: -1,
        // advisorId: (this.parentId) ? -1 : (this.arnRiaValue != -1) ? [this.adminAdvisorIds] : [this.adminAdvisorIds],
        key: value,
        arnRiaDetailId: this.arnRiaValue,
        parentId: this.parentId === 0 ? this.advisorId : this.parentId
        // parentId: (!this.parentId || this.parentId == 0) ? -1 : this.parentId,
      };

      if(this.shouldCheckValidation){
        if(this.inputSearchFC.valid && this.folioOption.valid){
          this.isMainLoading = true;
          this.reconService.getFolioQueryDataListValues(data)
          .subscribe(res => this.bindDataWithTable(res, searchFrom));
        } else {
          this.inputSearchFC.markAllAsTouched();
          this.folioOption.markAllAsTouched();
        }
      } else {
        this.isMainLoading = true;
        this.reconService.getFolioQueryDataListValues(data)
          .subscribe(res => this.bindDataWithTable(res, searchFrom));
      }

  
  }

  bindDataWithTable(res,searchFrom){
      this.isMainLoading = false;
      console.log("response:::",res);
      if (res && res.length !== 0) {
        let arrValue = [];
        res.forEach(element => {
          arrValue.push({
            arnRiaCode: element.arnRiaCode ? element.arnRiaCode : '-',
            name: element.shemeName,
            investorName: element.investorName,
            folioNumber: element.folioNumber,
            reconStatus: element.isMapped === -1 ? 'unmatched' : 'matched',
            mutualFundTransaction: element.mutualFundTransaction,
            mutualFundId: element.mutualFundId,
            unitsRta: element.aumUnits,
            unitsIfanow: element.calculatedUnits,
            difference: (element.calculatedUnits - element.aumUnits).toFixed(3),
            schemeCode: element.schemeCode,
            aumDate: element.aumDate,
            id: element.id,
            freezeDate: (element.hasOwnProperty('freezeDate') && element.freezeDate) ? element.freezeDate : null,
          })
        });
        this.dataSource.data = arrValue;
        console.log("this is what we are having",arrValue);
      }
      else {
        this.dataSource.data = null;
      }
      // toggling view
      if (searchFrom !== 'navInputSearch') {
        this.isSearchDone = !this.isSearchDone;
      }
  }

  openReconDetailView(flag, data) {
    let tableData = data.mutualFundTransaction;
    const fragmentData = {
      flag,
      data: { ...data, tableType: flag, tableData, freezeDate: data.freezeDate },
      id: 1,
      state: 'open',
      componentName: ReconciliationDetailsViewComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {

            if (sideBarData.refreshRequired) {
              this.isSearchDone = !this.isSearchDone;
              this.search(this.searchedObj.flag, this.searchedObj.value, this.searchedObj.searchFrom);
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
