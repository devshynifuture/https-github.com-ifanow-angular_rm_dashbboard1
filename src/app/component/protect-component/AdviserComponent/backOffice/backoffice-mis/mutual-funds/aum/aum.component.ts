import { Subscription } from 'rxjs';
import { MisAumDataStorageService } from './mis-aum-data-storage.service';
import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { BackOfficeService } from '../../../back-office.service';
import { AuthService } from 'src/app/auth-service/authService';
import * as Highcharts from 'highcharts';
import { FormControl, FormBuilder, FormArray } from '@angular/forms';
import { ReconciliationService } from '../../../backoffice-aum-reconciliation/reconciliation/reconciliation.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-aum',
  templateUrl: './aum.component.html',
  styleUrls: ['./aum.component.scss']
})
export class AumComponent implements OnInit {
  viewMode: string;
  showMainWrapperFlag = true;
  categoryshow = false;
  showSubTable = false;
  showAddBtn = true;
  showRemoveBtn: boolean;
  clientTotalAum = [{}, {}, {}];
  amcTotalAum = [{}, {}, {}];
  category = [{}, {}, {}];
  subcategory = [{}, {}, {}];
  MiscData;
  MiscData1: any = {};
  aumComponent = true;
  componentWise;
  advisorId: any;
  arnRiaList: any;
  aumGraph: any;
  parentId;
  isLoading = false;
  adminAdvisorIds = [];
  objTosend: any;
  isLoadingTopClients = false;
  isLoadingCategory = false;
  clientWithoutMF: number;
  misDataStoreSubs: Subscription;
  callApiDataSubs: Subscription;
  viewModeID: any;
  aumId: any;
  filterObj: any;
  aumList = [];
  aumIdList = [];
  aumIdListEventEmitRes: any;

  constructor(
    private backoffice: BackOfficeService, private eventService: EventService,
    private fb: FormBuilder, private reconService: ReconciliationService,
    private misAumDataStorageService: MisAumDataStorageService
  ) { }

  teamMemberId = 2929;
  arnRiaValue = -1;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.parentId = AuthService.getAdminAdvisorId();
    this.teamMemberListGet();
    this.aumId = 0;
    this.viewModeID = 'All'
    this.aumList = UtilService.getAumFilterList();
    this.aumIdList = UtilService.getFilterSelectedAumIDs(this.aumList);

    // if parentId = 0 arnRiaDetails selection will be disabled
    // if parentId present use it and arn Ria deail selection with advisor Id as 0
  }
  getDataFromStore() {
    this.misDataStoreSubs = this.misAumDataStorageService.getAllMisData().subscribe(res => {
      this.setValuesFromDataStore(res);
    });
    this.callApiDataSubs = this.misAumDataStorageService.canWeGetDataFromApi().subscribe(res => {
      if (res) {
        this.getGraphData();
        this.getTotalAum();
        // this.getSubCatScheme();
        this.getClientWithoutMf();
        this.getSubCatAum();
        this.getMisData();
      }
    })
  }



  teamMemberListGet() {
    this.reconService.getTeamMemberListValues({ advisorId: this.advisorId })
      .subscribe(data => {
        if (data && data.length !== 0) {
          console.log('team members: ', data);
          this.getDataFromStore();
          data.forEach(element => {
            this.adminAdvisorIds.push(element.adminAdvisorId);
          });
          if (this.parentId !== 0) {
            this.getArnRiaList();
          } else {
            if (this.misAumDataStorageService.doDataExist()) {
              this.misAumDataStorageService.callApiData();
            }
          }
          // this.handlingDataVariable();
        } else {
          this.adminAdvisorIds = [this.advisorId];
          if (this.parentId !== 0) {
            this.getArnRiaList();
          } else {
            if (this.misAumDataStorageService.doDataExist()) {
              this.misAumDataStorageService.callApiData();
            }
          }
          // this.handlingDataVariable();
          // this.eventService.openSnackBar('No Team Member Found', 'Dismiss');
        }
      }, err => {
        if (this.parentId !== 0) {
          this.getArnRiaList();
        } else {
          if (this.misAumDataStorageService.doDataExist()) {
            this.misAumDataStorageService.callApiData();
          }
        }
        // console.log(err);
      });
  }

  setValuesFromDataStore(res) {
    if (res) {
      this.isLoadingTopClients = false;
      this.isLoading = false;
      this.isLoadingCategory = false;
      if (res.graphData) {
        this.aumGraph = res.graphData;
        this.pieChart('pieChartAum', res.graphData);
      }
      if (res.totalAum) {
        this.clientTotalAum = res.totalAum['clientTotalAum'];
        this.amcTotalAum = res.totalAum['amcTotalAum'];
      }
      if (res.clientWithoutMf) {
        this.calculateClientWithoutMf(res.clientWithoutMf);
      }
      if (res.subCatAum) {
        this.category = res.subCatAum['category'];
        this.subcategory = res.subCatAum['subcategory'];
      }
      if (res.misData1) {
        this.MiscData1 = res.misData1;
      }
      this.misAumDataStorageService.setCallApiData(false);
    }
  }

  changeValueOfArnRia(item) {
    console.log('value for arn ria number::', item.id);
    this.clientTotalAum = [{}, {}, {}];
    this.amcTotalAum = [{}, {}, {}];
    this.category = [{}, {}, {}];
    this.subcategory = [{}, {}, {}];
    this.viewMode = item.number;
    if (item.number != 'All') {
      this.arnRiaValue = item.id;
      this.misAumDataStorageService.setArnRiaDetail(item.id);
    } else {
      this.arnRiaValue = -1;
      this.misAumDataStorageService.setArnRiaDetail(item.id);
    }
    if (this.misAumDataStorageService.doDataExist()) {
      this.misAumDataStorageService.callApiData();
    }
  }

  filterIDWise(id, flagValue) {
    this.viewModeID = flagValue;
    this.aumId = id;
  }

  aumFilterRes(data) {
    if (data.aumId && data.aumId != 0) {
      this.aumId = data.aumId;
      this.viewModeID = data.viewModeID;
      this.emitFilterListResponse(this.aumId);
      // this.filterIDWise(this.aumId, this.viewModeID)
    } else {
      this.aumId = 0;
      this.viewModeID = 'All'
    }
  }

  showMainWrapper() {
    this.categoryshow = false;
    this.showMainWrapperFlag = true;
  }

  categorywise() {
    this.categoryshow = true;
    this.showMainWrapperFlag = false;
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
          };
          this.arnRiaList.unshift(obj);

          if (!this.misAumDataStorageService.isArnRiaValueMinusOne()) {
            this.arnRiaValue = this.misAumDataStorageService.arnRiaValue;
            this.viewMode = this.arnRiaList.find(item => item.id === this.arnRiaValue).number;
          } else {
            this.arnRiaValue = -1;
            this.viewMode = 'All';
          }
          if (!this.misAumDataStorageService.doDataExist()) {
            this.misAumDataStorageService.callApiData();
          }
        } else {
          if (!this.misAumDataStorageService.doDataExist()) {
            this.misAumDataStorageService.callApiData();
          }

          // this.dataService.openSnackBar("No Arn Ria List Found", "Dismiss")
        }
      }
    );
  }

  refreshData() {
    this.misAumDataStorageService.callApiData();
  }

  showSubTableList() {
    this.showMainWrapperFlag = false;
    this.showSubTable = true;
    this.showAddBtn = false;
    this.showRemoveBtn = true;
  }

  display(value) {
    this.aumComponent = true;
    this.viewMode = value.viewMode;
    this.arnRiaValue = value.arnRiaValue;
    if (!this.misAumDataStorageService.doDataExist()) {
      this.misAumDataStorageService.callApiData();
    }
    // setTimeout(() => {
    //   this.pieChart('pieChartAum', this.aumGraph);
    // }, 600);
  }

  hideSubTableList() {
    this.showMainWrapperFlag = false;
    this.showSubTable = false;
    this.showAddBtn = true;
    this.showRemoveBtn = false;
  }

  getTotalAum() {
    this.isLoadingTopClients = true;

    const obj = {
      advisorId: (this.parentId == this.advisorId) ? 0 : this.advisorId,
      arnRiaDetailsId: this.arnRiaValue,
      parentId: this.parentId
    };
    if (this.aumIdList.length > 0) {
      obj['rtId'] = this.aumIdList;
    }
    this.backoffice.getClientTotalAUM(obj).subscribe(
      data => {
        this.getFileResponseDataAum(data);
        if (this.aumIdList.length == 7) {
          this.misAumDataStorageService.setTotalAumData(data);
        }
      },
      err => {
        this.isLoadingTopClients = false;
        this.clientTotalAum = [];
        this.amcTotalAum = [];
        this.getFilerrorResponse(err);
      }
    );
  }

  getClientWithoutMf() {
    this.isLoading = true;

    const obj = {
      advisorIds: [this.adminAdvisorIds],
      parentId: this.parentId
    };
    if (this.aumIdList.length > 0) {
      obj['rtId'] = this.aumIdList;
    }
    this.backoffice.getclientWithoutMf(obj).subscribe(
      data => {
        if (data) {
          this.isLoading = false;
          console.log(data);
          if (this.aumIdList.length == 7) {
            this.misAumDataStorageService.setClientWithoutMfData(data);
          }
          this.calculateClientWithoutMf(data);
        } else {
          this.clientWithoutMF = 0;
        }

      },
      err => {
        this.isLoading = false;
        this.clientWithoutMF = 0;
      }
    );
  }

  calculateClientWithoutMf(data) {
    this.clientWithoutMF = data.countWithoutMF / data.clientCount * 100;
    this.clientWithoutMF = (!this.clientWithoutMF || this.clientWithoutMF == Infinity) ? 0 : this.clientWithoutMF;
    (this.clientWithoutMF > 100) ? this.clientWithoutMF = 100 : this.clientWithoutMF;
  }

  getMisData() {
    this.isLoading = true;
    const obj = {
      advisorId: (this.parentId == this.advisorId) ? 0 : this.advisorId,
      arnRiaDetailsId: this.arnRiaValue,
      parentId: this.parentId
    };
    if (this.aumIdList.length > 0) {
      obj['rtId'] = this.aumIdList;
    }
    this.backoffice.getMisData(obj).subscribe(
      data => {
        this.getFileResponseDataForMis(data);
        if (this.aumIdList.length == 7) {
          this.misAumDataStorageService.setMisData1(data);
        }
      }, err => {
        this.isLoading = false;
        this.MiscData1 = '';
        this.getFilerrorResponse(err);
      }
    );
  }

  getSubCatAum() {
    this.isLoadingCategory = true;

    const obj = {
      advisorId: (this.parentId == this.advisorId) ? 0 : this.advisorId,
      arnRiaDetailId: this.arnRiaValue,
      parentId: this.parentId
    };
    if (this.aumIdList.length > 0) {
      obj['rtId'] = this.aumIdList;
    }
    this.backoffice.getSubCatAum(obj).subscribe(
      data => {
        this.getFileResponseDataForSub(data);
        if (this.aumIdList.length == 7) {
          this.misAumDataStorageService.setSubCatAumData(data);
        }
      }, err => {
        this.isLoadingCategory = false;
        this.category = [];
        this.subcategory = [];
        this.getFilerrorResponse(err);
      }
    );
  }

  getSubCatSchemeRes(data) {
  }

  getFileResponseDataAum(data) {
    this.isLoadingTopClients = false;
    if (data) {
      this.clientTotalAum = data.clientTotalAum;
      this.amcTotalAum = data.amcTotalAum;
    }

  }

  getFileResponseDataForMis(data) {
    console.log('this is totalaum data:::', data);
    this.isLoading = false;
    if (data) {
      this.MiscData1 = data;
    } else {
      this.MiscData1 = '';
    }
  }

  getFileResponseDataForSub(data) {
    this.isLoadingCategory = false;
    this.category = data.category;
    this.subcategory = data.subcategory;
  }

  getFileResponseDataForSubScheme(data) {
    this.MiscData = data.categories;
  }

  getFileResponseDataForSubSchemeName(data) {
  }

  getFilerrorResponse(err) {
    this.eventService.showErrorMessage(err);
  }

  categoryWise(value) {
    this.componentWise = value;
    this.aumComponent = false;
    this.objTosend = {
      arnRiaDetailId: this.arnRiaValue,
      parentId: this.parentId,
      adminAdvisorIds: this.adminAdvisorIds,
      arnRiaValue: this.arnRiaValue,
      viewMode: this.viewMode,
      totalAumObj: this.MiscData1
    };
    this.backoffice.addMisAumData({
      aumId: this.aumList ? this.aumList : this.aumIdListEventEmitRes,
      viewModeID: this.viewModeID,
      value: value,
      arnRiaValue: this.arnRiaValue
    })
  }

  emitFilterListResponse(res) {
    if (res) {
      this.aumIdListEventEmitRes = res;
      this.MiscData1 = {};
      this.clientWithoutMF = 0;
      this.aumIdList = UtilService.getFilterSelectedAumIDs(res);
      this.getGraphData();
      this.getTotalAum();
      // this.getSubCatScheme();
      this.getClientWithoutMf();
      this.getSubCatAum();
      this.getMisData();
    }
  }

  getGraphData() {
    this.aumGraph = null;
    const obj = {
      advisorId: (this.parentId) ? 0 : (this.arnRiaValue != -1) ? 0 : [this.adminAdvisorIds],
      arnRiaDetailsId: this.arnRiaValue,
      parentId: this.parentId
    };
    if (this.aumIdList.length > 0) {
      obj['rtId'] = this.aumIdList;
    }
    this.backoffice.aumGraphGet(obj).subscribe(
      data => {
        this.aumGraph = data;
        if (this.aumIdList.length == 7) {
          this.misAumDataStorageService.setGraphData(data);
        }
        setTimeout(() => {
          this.pieChart('pieChartAum', data);
        }, 1000);
      },
      err => {
        this.aumGraph = '';
      }
    );
  }

  pieChart(id, obj) {
    let obj1 = obj[obj.length - 2];
    let obj2 = obj[obj.length - 3];
    let obj3 = obj[obj.length - 4];
    let obj4 = obj[obj.length - 5];
    let months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    Highcharts.chart('pieChartAum', {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: [months[obj1.Month] + '-' + obj1.Year, months[obj2.Month] + '-' + obj2.Year, months[obj3.Month] + '-' + obj3.Year, months[obj4.Month] + '-' + obj4.Year]
      },
      credits: {
        enabled: false
      },
      series: [{
        type: undefined,
        name: 'Purchase',
        color: '#70ca86',
        data: [obj1.GrossSale, obj2.GrossSale, obj3.GrossSale, obj4.GrossSale]
      }, {
        type: undefined,
        name: 'Redemption',
        color: '#f05050',
        data: [obj1.Redemption, obj2.Redemption, obj3.Redemption, obj4.Redemption]
      }, {
        type: undefined,
        name: 'Net Sales',
        color: '#55c3e6',
        data: [obj1.GrossSale + obj1.Redemption, obj2.GrossSale + obj2.Redemption, obj3.GrossSale + obj3.Redemption, obj4.GrossSale + obj4.Redemption]
      }]
    });
  }

  ngOnDestroy(): void {
    this.callApiDataSubs.unsubscribe()
    this.misDataStoreSubs.unsubscribe();
  }
}

