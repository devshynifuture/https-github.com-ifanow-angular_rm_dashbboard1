import { Component, OnInit, Input } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { element } from 'protractor';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../customer/customer.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-right-filter',
  templateUrl: './right-filter.component.html',
  styleUrls: ['./right-filter.component.scss']
})
export class RightFilterComponent implements OnInit {
  panelOpenState = true;
  _data: any;
  familyMember: any;
  folio: any;
  amc: any;
  scheme: any;
  countFamily;
  countAmc;
  countScheme;
  countFolio;
  category: any;
  transactionView: any;
  reportType;
  countReport: any;
  countTranView: any;
  countCategory: any;
  dataToSend: any;
  summaryFilerForm: any;
  folioObj: [];
  schemeObj: [];
  categoryObj: [];
  familyMemObj: [];
  amcObj: [];
  constructor(private subInjectService: SubscriptionInject, private fb: FormBuilder, private custumService: CustomerService, private eventService: EventService) {
  }
  @Input()
  set data(inputData) {
    this._data = inputData;
  }
  get data() {
    return this._data;
  }
  ngOnInit(): void {
    this.amc = this._data.schemeWise;
    this.folio = this._data.folioWise;
    this.getCategoryWise(this._data.category)
    this.getSchemeWise(this.amc);
    this.getFamilyMember(this._data.folioWise)
    this.getTransactionView(this._data.transactionView);
    this.getReportType();
    this.setDefaultFilters();
    this.showSummaryFilterForm('');
  }
  getFormControl(): any {
    return this.summaryFilerForm.controls;
  }
  getCategoryWise(data) {
    let filterData = [];
    data.forEach(element => {
      const obj = {
        "category": element.category,
        "categoryId": element.id,
        "selected": true
      }
      filterData.push(obj);
    });
    this.category = filterData
  }
  showSummaryFilterForm(data) {
    this.summaryFilerForm = this.fb.group({
      reportAsOn: [(data.reportAsOn == undefined) ? null : new Date(data.reportAsOn), [Validators.required]],
      showFolios: [(data.showFolio), [Validators.required]],
    });
  }
  getSchemeWise(data) {
    let filterData = [];
    data.filter(function (element) {
      const obj = {
        "id": element.id,
        "schemeName": element.schemeName,
        "amc_name": element.amc_name,
        "mutualFund": element.mutualFund,
        "amc_id": element.amc_id
      }
      filterData.push(obj);
    })
    this.scheme = filterData;
  }
  getFamilyMember(data) {
    let filterData = [];
    data.forEach(element => {
      const obj = {
        "name": element.ownerName,
        "familyMemberId": element.familyMemberId,
        "selected": true
      }
      filterData.push(obj);
    });
    this.familyMember = [...new Map(filterData.map(item => [item['familyMemberId'], item])).values()];;
  }
  getTransactionView(data) {
    let filterData = [];
    data.filter(function (element) {
      const obj = {
        "displayName": element,
      }
      filterData.push(obj);
    })
    this.transactionView = filterData;
  }
  getReportType() {
    this.reportType = ['Investor wise', 'Category wise', 'Sub Category wise'];
    let filterData = [];
    this.reportType.filter(function (element) {
      const obj = {
        "name": element,
      }
      filterData.push(obj);
    })
    this.reportType = filterData;
  }
  setDefaultFilters() {
    this.familyMember.forEach(item => item.selected = true);
    this.amc.forEach(item => item.selected = true);
    this.scheme.forEach(item => item.selected = true);
    this.folio.forEach(item => item.selected = true);
    this.category.forEach(item => item.selected = true);
    this.transactionView.forEach(item => item.selected = true);
    this.reportType.forEach(item => item.selected = true);

    this.countFamily = this.familyMember.length;
    this.countAmc = this.amc.length;
    this.countScheme = this.scheme.length;
    this.countFolio = this.folio.length;
    this.countTranView = this.transactionView.length;
    this.countReport = this.reportType.length;
    this.countCategory = this.category.length;

  }
  changeFilterFamily() {
    let filterData = this._data.schemeWise;
    let filterData1 = [];
    let filterData2 = [];
    let filterData3 = [];
    this.familyMember.filter(function (element) {
      if (element.selected == true) {
        filterData.filter(function (amc) {
          amc.mutualFund.forEach(function (mf) {
            if (mf.familyMemberId == element.familyMemberId) {
              const obj = {
                "amc_name": amc.amc_name,
                "schemeName": amc.schemeName,
                "id": amc.id,
                "mutualFund": amc.mutualFund,
                "amc_id": amc.amc_id,
                "selected": true
              }
              const obj2 = {
                "folioNumber": mf.folioNumber,
                "selected": true
              }
              const obj3 = {
                "category": mf.categoryName,
                "categoryId": mf.categoryId,
                "selected": true
              }
              filterData1.push(obj);
              filterData2.push(obj2);
              filterData3.push(obj3);
            }
          })
        })
      }
    })
    this.scheme = [...new Map(filterData1.map(item => [item['id'], item])).values()];
    this.amc = [...new Map(filterData1.map(item => [item['amc_id'], item])).values()];
    this.folio = filterData2;
    this.category = [...new Map(filterData3.map(item => [item['categoryId'], item])).values()];
    this.changeSelect();
  }
  changeFilterCategory(data) {
    let filterData = this._data.schemeWise;
    let filterData1 = [];
    let filterData2 = [];
    let filterData3 = [];
    data.filter(function (element) {
      if (element.selected == true) {
        filterData.filter(function (amc) {
          amc.mutualFund.forEach(function (mf) {
            if (mf.categoryId == element.categoryId) {
              const obj = {
                "amc_name": amc.amc_name,
                "schemeName": amc.schemeName,
                "schemeCode": amc.schemeCode,
                "mutualFund": amc.mutualFund,
                "id": amc.id,
                "amc_id": amc.amc_id,
                "selected": true
              }
              const obj2 = {
                "folioNumber": mf.folioNumber,
                "selected": true
              }
              const obj3 = {
                "name": mf.ownerName,
                "familyMemberId": mf.familyMemberId,
                "selected": true
              }
              filterData1.push(obj);
              filterData2.push(obj2);
              filterData3.push(obj3);
            }
          })
        })
      }
    })
    this.scheme = [...new Map(filterData1.map(item => [item['id'], item])).values()];
    this.amc = [...new Map(filterData1.map(item => [item['amc_id'], item])).values()];
    this.folio = filterData2;
    this.familyMember = [...new Map(filterData3.map(item => [item['familyMemberId'], item])).values()];
    this.changeSelect();
  }
  changeFilterFolio() {
    let filterData = [];
    let filterData2 = this._data.schemeWise;
    let filterData1 = [];
    let filterData3 = [];
    this.folio.filter(function (element) {
      if (element.selected == true) {
        filterData2.forEach(amc => {
          amc.mutualFund.forEach(mf => {
            if (element.folioNumber == mf.folioNumber) {
              const obj = {
                "amc_name": amc.amc_name,
                "schemeName": amc.schemeName,
                "schemeCode": amc.schemeCode,
                "mutualFund": amc.mutualFund,
                "id": amc.id,
                "amc_id": amc.amc_id,
                "selected": true
              }
              const obj1 = {
                "name": mf.ownerName,
                "familyMemberId": mf.familyMemberId,
                "selected": true
              }
              const obj2 = {
                "category": mf.categoryName,
                "categoryId": mf.categoryId,
                "selected": true
              }
              filterData.push(obj);
              filterData1.push(obj1);
              filterData3.push(obj2);
            }
          })
        });
      }
    })
    this.scheme = [...new Map(filterData.map(item => [item['id'], item])).values()];
    this.amc = [...new Map(filterData.map(item => [item['amc_id'], item])).values()];
    this.familyMember = [...new Map(filterData1.map(item => [item['familyMemberId'], item])).values()];
    this.category = [...new Map(filterData3.map(item => [item['categoryId'], item])).values()];
    console.log(this.amc)
    this.changeSelect();
  }
  changeFilterAmc() {
    let filterData = [];
    let filterData2 = [];
    let filterData3 = [];
    let filterData4 = []
    this.amc.filter(function (element) {
      if (element.selected == true) {
        element.mutualFund.forEach(ele => {
          const obj = {
            "folioNumber": ele.folioNumber,
            "selected": true
          }
          const obj2 = {
            "name": ele.ownerName,
            "familyMemberId": ele.familyMemberId,
            "selected": true
          }
          const obj3 = {
            "category": ele.categoryName,
            "categoryId": ele.categoryId,
            "selected": true
          }
          filterData.push(obj);
          filterData2.push(obj2);
          filterData3.push(obj3)
        });
        const obj = {
          "schemeName": element.schemeName,
          "amc_name": element.amc_name,
          "mutualFund": element.mutualFund,
          "id": element.id,
          "amc_id": element.amc_id,
          "selected": true
        }
        filterData4.push(obj);
      }
    })
    this.folio = filterData;
    this.familyMember = [...new Map(filterData2.map(item => [item['familyMemberId'], item])).values()];
    this.category = [...new Map(filterData3.map(item => [item['categoryId'], item])).values()];
    this.scheme = [...new Map(filterData4.map(item => [item['id'], item])).values()];;
    this.changeSelect();
  }
  changeFilterScheme() {
    let filterData = [];
    let filterData2 = [];
    let filterData3 = [];
    let filterData4 = [];
    this.scheme.filter(function (element) {
      if (element.selected == true) {
        element.mutualFund.forEach(ele => {
          const obj = {
            "folioNumber": ele.folioNumber,
            "selected": true
          }
          const obj2 = {
            "name": ele.ownerName,
            "familyMemberId": ele.familyMemberId,
            "selected": true
          }
          const obj3 = {
            "category": ele.categoryName,
            "categoryId": ele.categoryId,
            "selected": true
          }
          filterData.push(obj);
          filterData2.push(obj2);
          filterData3.push(obj3)
        });
        const obj = {
          "amc_name": element.amc_name,
          "schemeName": element.schemeName,
          "mutualFund": element.mutualFund,
          "id": element.id,
          "amc_id": element.amc_id,
          "selected": true
        }
        filterData4.push(obj);
      }
    })
    this.folio = filterData;
    this.familyMember = [...new Map(filterData2.map(item => [item['familyMemberId'], item])).values()];
    this.category = [...new Map(filterData3.map(item => [item['categoryId'], item])).values()];
    this.amc = [...new Map(filterData4.map(item => [item['amc_id'], item])).values()];
    this.changeSelect();
  }
  changeSelect = function () {
    if (this.familyMember != undefined) {
      let filter = [];
      this.countFamily = 0;
      this.familyMember.forEach(item => {
        if (item.selected) {
          this.countFamily++;
          filter.push(item.familyMemberId)
        }
      });
      this.familyMemObj = filter
    }
    if (this.amc != undefined) {
      let filter = [];
      this.countAmc = 0;
      this.amc.forEach(item => {
        if (item.selected) {
          this.countAmc++;
          filter.push(item.amc_id)
        }
      });
      this.amcObj = filter
    }
    if (this.scheme != undefined) {
      let filter = [];
      this.countScheme = 0;
      this.scheme.forEach(item => {
        if (item.selected) {
          this.countScheme++;
          filter.push(item.id)
        }
      });
      this.schemeObj = filter;
    }
    if (this.folio != undefined) {
      let filter = [];
      this.countFolio = 0;
      this.folio.forEach(item => {
        if (item.selected) {
          this.countFolio++;
          filter.push(item.folioNumber)
        }
      });
      this.folioObj = filter;
    }
    if (this.transactionView != undefined) {
      this.countTranView = 0;
      this.transactionView.forEach(item => {
        if (item.selected) {
          this.countTranView++;
        }
      });
    }
    if (this.category != undefined) {
      let filter = [];
      this.countCategory = 0;
      this.category.forEach(item => {
        if (item.selected) {
          this.countCategory++;
          filter.push(item.categoryId)
        }
      });
      this.categoryObj = filter;
    }
    if (this.reportType != undefined) {
      this.countReport = 0;
      this.reportType.forEach(item => {
        if (item.selected) {
          this.countReport++;
        }
      });
    }
  }
  generateReport() {
    if (this.summaryFilerForm.get('reportAsOn').invalid) {
      this.summaryFilerForm.get('reportAsOn').markAsTouched();
      return
    }
    this.dataToSend = {
      'advisorId': 3967,
      'clientId': 2982,
      'familyMember': this.familyMemObj,
      'amc': this.amcObj,
      'scheme': this.schemeObj,
      'folio': this.folioObj,
      'category': this.categoryObj,
      'reportAsOn': (this.summaryFilerForm.controls.reportAsOn.value) ? this.summaryFilerForm.controls.reportAsOn.value.toISOString().slice(0, 10) : null,
      'showFolio': parseInt(this.summaryFilerForm.controls.showFolios.value),
    }
    console.log('dataToSend---------->', this.dataToSend);
    this.custumService.getMutualFund(this.dataToSend).subscribe(
      data => this.getMutualFundResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getMutualFundResponse(data) {
    console.log(data)
    this.Close(data);
  }
  Close(data) {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}