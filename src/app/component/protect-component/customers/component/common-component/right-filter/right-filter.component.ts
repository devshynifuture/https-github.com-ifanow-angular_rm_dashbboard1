import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../customer/customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MfServiceService } from '../../customer/accounts/assets/mutual-fund/mf-service.service';

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
  obj: any;
  mfData: any;
  finalFilterData: any;
  reportTypeobj: any;
  selectedTransactionView;
  sendTransactionView
  transactionPeriod = true
  transactionPeriodCheck = true

  constructor(private subInjectService: SubscriptionInject, private fb: FormBuilder,
    private custumService: CustomerService, private eventService: EventService,
    private mfService: MfServiceService) {
  }

  @Input()
  set data(inputData) {
    this._data = inputData;
  }

  get data() {
    return this._data;
  }

  ngOnInit(): void {
    (this._data.name=='SUMMARY REPORT')?this.transactionPeriod=false:this.transactionPeriod=true;
    this.transactionPeriodCheck = true
    this.amc = this._data.schemeWise;//amc wise data 
    this.folio = this._data.folioWise;//for getting all folios
    this.getCategoryWise(this._data.category)//get category wise data
    this.getSchemeWise(this.amc);//scheme wise data
    this.getFamilyMember(this._data.folioWise)//for family memeber
    this.getTransactionView(this._data.transactionView);//for displaying how many columns to show in table
    this.getReportType();//get type of report categorywise,investor,sub category wise
    this.setDefaultFilters();//setting default selected in each above array
    this.showSummaryFilterForm('');//as on date and showZero folio form
    this.amc = this._data.schemeWise; // amc wise data
    this.folio = this._data.folioWise; // for getting all folios
    if (this._data.category) {
      this.getCategoryWise(this._data.category);
      // get category wise data
    } else {
      console.log('RightFilterComponent ngOninit category data is empty');
    }
    if (this.amc) {
      this.getSchemeWise(this.amc); // scheme wise data
    } else {
      console.log('RightFilterComponent ngOninit getSchemeWise data is empty');
    }
    if (this._data.folioWise) {
      this.getFamilyMember(this._data.folioWise); // for family memeber
    } else {
      console.log('RightFilterComponent ngOninit getFamilyMember foliowise data is empty');
    }
    if (this._data.transactionView) {
      this.getTransactionView(this._data.transactionView); // for displaying how many columns to show in table
    } else {
      console.log('RightFilterComponent ngOninit getTransactionView data is empty');
    }
    this.getReportType(); // get type of report categorywise,investor,sub category wise
    this.setDefaultFilters(); // setting default selected in each above array
    this.showSummaryFilterForm(''); // as on date and showZero folio form
  }

  getFormControl(): any {
    return this.summaryFilerForm.controls;
  }

  getCategoryWise(data) {
    const filterData = [];
    data.forEach(element => {
      const obj = {
        category: element.category,
        categoryId: element.id,
        selected: true
      };
      filterData.push(obj);
    });
    this.category = filterData;
  }

  showSummaryFilterForm(data) {
    this.summaryFilerForm = this.fb.group({
      reportAsOn: [(data.reportAsOn == undefined) ? null : new Date(data.reportAsOn), [Validators.required]],
      fromDate: [(data.fromDate == undefined) ? null : new Date(data.fromDate), [Validators.required]],
      toDate: [(data.toDate == undefined) ? null : new Date(data.toDate), [Validators.required]],
      showFolios: [(data.showFolio) ? data.showFolio : '2', [Validators.required]],
    });
  }

  getSchemeWise(data) {
    const filterData = [];
    data.filter(function (element) {
      const obj = {
        id: element.id,
        schemeName: element.schemeName,
        amc_name: element.amc_name,
        mutualFund: element.mutualFund,
        amc_id: element.amc_id
      };
      filterData.push(obj);
    });
    this.scheme = filterData;
  }

  getFamilyMember(data) {
    const filterData = [];
    data.forEach(element => {
      const obj = {
        name: element.ownerName,
        familyMemberId: element.familyMemberId,
        selected: true
      };
      filterData.push(obj);
    });
    this.familyMember = [...new Map(filterData.map(item => [item.familyMemberId, item])).values()];

  }

  getTransactionView(data) {
    const filterData = [];
    data.filter(function (element) {
      const obj = {
        displayName: element,
      };
      filterData.push(obj);
    });
    this.transactionView = filterData;
  }
  getReportType() {
    this.reportType = ['Investor wise', 'Category wise', 'Sub Category wise'];
    const filterData = [];
    this.reportType.filter(function (element) {
      const obj = {
        name: element,
        selected: false
      };
      filterData.push(obj);
    });
    this.reportType = filterData;
  }
  changeFilterPeriod(value) {
    console.log('date period ==', value)
    if (value == true) {
      this.transactionPeriod = true
    } else {
      this.transactionPeriod = false
    }
  }
  setDefaultFilters() {
    if (this.familyMember) {
      this.familyMember.forEach(item => item.selected = true);
    }
    if (this.amc) {
      this.amc.forEach(item => item.selected = true);
    }
    this.scheme.forEach(item => item.selected = true);
    this.folio.forEach(item => item.selected = true);
    this.category.forEach(item => item.selected = true);
    this.transactionView.forEach(item => item.selected = true);
    this.reportType.forEach(item => {
      this.countReport = 0
      if (item.name == 'Sub Category wise') {
        item.selected = true;
        this.countReport++;
      }
    });
    this.countFamily = this.familyMember.length;
    this.countAmc = this.amc.length;
    this.countScheme = this.scheme.length;
    this.countFolio = this.folio.length;
    this.countTranView = this.transactionView.length;
    this.countCategory = this.category.length;
    this.changeSelect('', '');
  }

  changeFilterFamily() {
    const filterData = this._data.schemeWise;
    const filterData1 = [];
    const filterData2 = [];
    const filterData3 = [];
    this.familyMember.filter(function (element) {
      if (element.selected == true) {
        filterData.filter(function (amc) {
          amc.mutualFund.forEach(function (mf) {
            if (mf.familyMemberId == element.familyMemberId) {
              const obj = {
                amc_name: amc.amc_name,
                schemeName: amc.schemeName,
                id: amc.id,
                mutualFund: amc.mutualFund,
                amc_id: amc.amc_id,
                selected: true
              };
              const obj2 = {
                folioNumber: mf.folioNumber,
                selected: true
              };
              const obj3 = {
                category: mf.categoryName,
                categoryId: mf.categoryId,
                selected: true
              };
              filterData1.push(obj);
              filterData2.push(obj2);
              filterData3.push(obj3);
            }
          });
        });
      }
    });
    this.scheme = [...new Map(filterData1.map(item => [item.id, item])).values()];
    this.amc = [...new Map(filterData1.map(item => [item.amc_id, item])).values()];
    this.folio = filterData2;
    this.category = [...new Map(filterData3.map(item => [item.categoryId, item])).values()];
    this.changeSelect('', '');
  }

  changeFilterCategory(data) {
    const filterData = this._data.schemeWise;
    const filterData1 = [];
    const filterData2 = [];
    const filterData3 = [];
    data.filter(function (element) {
      if (element.selected == true) {
        filterData.filter(function (amc) {
          amc.mutualFund.forEach(function (mf) {
            if (mf.categoryId == element.categoryId) {
              const obj = {
                amc_name: amc.amc_name,
                schemeName: amc.schemeName,
                schemeCode: amc.schemeCode,
                mutualFund: amc.mutualFund,
                id: amc.id,
                amc_id: amc.amc_id,
                selected: true
              };
              const obj2 = {
                folioNumber: mf.folioNumber,
                selected: true
              };
              const obj3 = {
                name: mf.ownerName,
                familyMemberId: mf.familyMemberId,
                selected: true
              };
              filterData1.push(obj);
              filterData2.push(obj2);
              filterData3.push(obj3);
            }
          });
        });
      }
    });
    this.scheme = [...new Map(filterData1.map(item => [item.id, item])).values()];
    this.amc = [...new Map(filterData1.map(item => [item.amc_id, item])).values()];
    this.folio = filterData2;
    this.familyMember = [...new Map(filterData3.map(item => [item.familyMemberId, item])).values()];
    this.changeSelect('', '');
  }

  changeFilterFolio() {
    const filterData = [];
    const filterData2 = this._data.schemeWise;
    const filterData1 = [];
    const filterData3 = [];
    this.folio.filter(function (element) {
      if (element.selected == true) {
        filterData2.forEach(amc => {
          amc.mutualFund.forEach(mf => {
            if (element.folioNumber == mf.folioNumber) {
              const obj = {
                amc_name: amc.amc_name,
                schemeName: amc.schemeName,
                schemeCode: amc.schemeCode,
                mutualFund: amc.mutualFund,
                id: amc.id,
                amc_id: amc.amc_id,
                selected: true
              };
              const obj1 = {
                name: mf.ownerName,
                familyMemberId: mf.familyMemberId,
                selected: true
              };
              const obj2 = {
                category: mf.categoryName,
                categoryId: mf.categoryId,
                selected: true
              };
              filterData.push(obj);
              filterData1.push(obj1);
              filterData3.push(obj2);
            }
          });
        });
      }
    });
    this.scheme = [...new Map(filterData.map(item => [item.id, item])).values()];
    this.amc = [...new Map(filterData.map(item => [item.amc_id, item])).values()];
    this.familyMember = [...new Map(filterData1.map(item => [item.familyMemberId, item])).values()];
    this.category = [...new Map(filterData3.map(item => [item.categoryId, item])).values()];
    console.log(this.amc);
    this.changeSelect('', '');
  }

  changeFilterAmc() {
    this.obj = this.mfService.filterScheme(this.amc);
    this.folio = this.obj.filterData;
    this.familyMember = [...new Map(this.obj.filterData2.map(item => [item.familyMemberId, item])).values()];
    this.category = [...new Map(this.obj.filterData3.map(item => [item.categoryId, item])).values()];
    this.scheme = [...new Map(this.obj.filterData4.map(item => [item.id, item])).values()];

    this.changeSelect('', '');
  }

  changeFilterScheme() {
    this.obj = this.mfService.filterScheme(this.scheme);
    this.folio = this.obj.filterData;
    this.familyMember = [...new Map(this.obj.filterData2.map(item => [item.familyMemberId, item])).values()];
    this.category = [...new Map(this.obj.filterData3.map(item => [item.categoryId, item])).values()];
    this.amc = [...new Map(this.obj.filterData4.map(item => [item.amc_id, item])).values()];
    this.changeSelect('', '');
  }
  changeReportFilter(value) {
    this.reportType.forEach(element => {
      if (element.name != value.name) {
        element.selected = false;
      }
    });
    this.changeSelect('', '');
  }
  changeSelect = function (data, i) {
    this.sendTransactionView = this._data.transactionView
    console.log('transaction ==', this._data.transactionView)
    if (data.selected == true) {
      this.sendTransactionView.push(i)
    } else if(data.selected == false){
      this.sendTransactionView.pop(i)
    }
    console.log('data ==', this.sendTransactionView)
    if (this.familyMember != undefined) {
      const filter = [];
      this.countFamily = 0;
      this.familyMember.forEach(item => {
        if (item.selected) {
          this.countFamily++;
          filter.push(item);
        }
      });
      this.familyMemObj = filter;
    }
    if (this.amc != undefined) {
      const filter = [];
      this.countAmc = 0;
      this.amc.forEach(item => {
        if (item.selected) {
          this.countAmc++;
          filter.push(item);
        }
      });
      this.amcObj = filter;
    }
    if (this.scheme != undefined) {
      const filter = [];
      this.countScheme = 0;
      this.scheme.forEach(item => {
        if (item.selected) {
          this.countScheme++;
          filter.push(item);
        }
      });
      this.schemeObj = filter;
    }
    if (this.folio != undefined) {
      const filter = [];
      this.countFolio = 0;
      this.folio.forEach(item => {
        if (item.selected) {
          this.countFolio++;
          filter.push(item);
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
      const filter = [];
      this.countCategory = 0;
      this.category.forEach(item => {
        if (item.selected) {
          this.countCategory++;
          filter.push(item);
        }
      });
      this.categoryObj = filter;
    }
    if (this.reportType != undefined) {
      const filter = [];
      this.reportType.forEach(item => {
        if (item.selected) {
          filter.push(item);
        }
      });
      this.reportTypeobj = filter;
    }
  };
  selectAll(event,array, someString){
    if (array != undefined) {
      array.forEach(item => {
        item.selected = event.checked;
      });
      this.changeSelect('', '');
    }

  }
  generateReport() {
    if (this.transactionPeriod == true) {
      if (this.summaryFilerForm.get('fromDate').invalid) {
        this.summaryFilerForm.get('fromDate').markAsTouched();
        return;
      } else if (this.summaryFilerForm.get('toDate').invalid) {
        this.summaryFilerForm.get('toDate').markAsTouched();
      }
    } else {
      if (this.summaryFilerForm.get('reportAsOn').invalid) {
        this.summaryFilerForm.get('reportAsOn').markAsTouched();
        return;
      }
    }
    this.dataToSend = {
      familyMember: (this.familyMemObj) ? this.familyMemObj : this.familyMember,
      amc: (this.amcObj) ? this.amcObj : this.amc,
      scheme: (this.schemeObj) ? this.schemeObj : this.scheme,
      folio: (this.folioObj) ? this.folioObj : this.folio,
      category: (this.categoryObj) ? this.categoryObj : this.category,
      reportType: (this.reportTypeobj) ? this.reportTypeobj : this.reportType,
      transactionView: this.transactionView,
      reportAsOn: (this.summaryFilerForm.controls.reportAsOn.value) ? this.summaryFilerForm.controls.reportAsOn.value.toISOString().slice(0, 10) : null,
      fromDate: (this.summaryFilerForm.controls.fromDate.value) ? this.summaryFilerForm.controls.fromDate.value.toISOString().slice(0, 10) : null,
      toDate: (this.summaryFilerForm.controls.toDate.value) ? this.summaryFilerForm.controls.toDate.value.toISOString().slice(0, 10) : null,
      showFolio: parseInt(this.summaryFilerForm.controls.showFolios.value),
    };
    console.log('dataToSend---------->', this.dataToSend);
    this.finalFilterData = this.mfService.filterFinalData(this._data.mfData, this.dataToSend);
    this.finalFilterData.transactionView = this.sendTransactionView
    console.log('this.sendTransactionView ====', this.finalFilterData)
    this.Close(this.finalFilterData);
    console.log(this.finalFilterData);
  }

  Close(data) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', data: data });
  }
}
