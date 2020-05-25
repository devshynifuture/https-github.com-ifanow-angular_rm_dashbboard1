import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../customer/customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MfServiceService } from '../../customer/accounts/assets/mutual-fund/mf-service.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-right-filter',
  templateUrl: './right-filter.component.html',
  styleUrls: ['./right-filter.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class RightFilterComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'GENERATE REPORT',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
  customCollapsedHeight: string = '45px';
  customExpandedHeight: string = '45px';
  panelOpenState = false;
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
  reportFormat;
  saveFilters;
  financialYears = [];
  countReport: any;
  countTranView: any;
  countCategory: any;
  dataToSend: any;
  summaryFilerForm: any;
  folioObj: any;
  schemeObj: any;
  categoryObj: any;
  familyMemObj: any;
  amcObj: any;
  obj: any;
  mfData: any;
  finalFilterData: any;
  reportTypeobj: any;
  reportFormatObj: any;
  financialYearsObj: any
  overviewFilter: any;
  selectedTransactionView;
  sendTransactionView;
  transactionPeriod = false;
  transactionPeriodCheck = false;
  overviewFilterCount: any;
  showError: string;
  countFormat: number;
  showGrandfathering = true;
  advisorId: any;
  clientId: any;
  selectUnselctAllFlag:true;
  constructor(private subInjectService: SubscriptionInject, private fb: FormBuilder,
    private custumService: CustomerService, private eventService: EventService,
    private mfService: MfServiceService, private datePipe: DatePipe, ) {
  }

  @Input()
  set data(inputData) {
    this._data = inputData;
  }

  get data() {
    return this._data;
  }

  ngOnInit(): void {
    this.panelOpenState = false;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    // this._data.forEach(element => {()
    //   element.done = false
    // });
    // (this._data.name == 'SUMMARY REPORT') ? this.transactionPeriod = false : this.transactionPeriod = true;
    this.transactionPeriodCheck = (this._data.transactionPeriodCheck) ? this._data.transactionPeriodCheck : false;
    this.transactionPeriod = (this._data.transactionPeriod) ? this._data.transactionPeriod : false;
    // this.amc = this._data.schemeWise;//amc wise data 
    // this.folio = this._data.folioWise;//for getting all folios
    this.amc = [...new Map(this._data.schemeWise.map(item => [item.amc_id, item])).values()];//amc wise data 
    this.amc = this.mfService.sorting(this.amc, 'amc_name')
    this.folio = [...new Map(this._data.folioWise.map(item => [item.folioNumber, item])).values()];//for getting all folios
    this.folio = this.mfService.sorting(this.folio, 'folioNumber')
    this.showSummaryFilterForm(this._data);//as on date and showZero folio form

    this.getCategoryWise(this._data.category);//get category wise data
    if (this._data.scheme) {
      this.getSchemeWise(this._data.scheme); // scheme wise data
    }
    this.getFamilyMember(this._data.familyMember);//for family memeber
    this.getTransactionView(this._data.transactionView);//for displaying how many columns to show in table
    this.getReportType();//get type of report categorywise,investor,sub category wise
    this.getReportFormat();//get capital gain report
    this.getSaveFilters(); //forSaving filters
    // this.getTransactionType();//for transaction type in all transactions
    this.getFinancialYears(this.summaryFilerForm);//for getting financial years for capital gain
    this.overviewFilter = this._data.overviewFilter;
    // this.getOverviewFilter();//used for overview filter to show specific tables
    this.setDefaultFilters();//setting default selected in each above array
    if (this._data.category) {
      this.getCategoryWise(this._data.category);
      // get category wise data
    } else {
      console.log('RightFilterComponent ngOninit category data is empty');
    }
    if (this._data.scheme) {
      this.getSchemeWise(this._data.scheme); // scheme wise data
    } else {
      console.log('RightFilterComponent ngOninit getSchemeWise data is empty');
    }
    if (this._data.folioWise) {
      this.getFamilyMember(this._data.familyMember); // for family memeber
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
        selected: element.selected
      };
      filterData.push(obj);
    });
    let sortedData = this.mfService.sorting(filterData, 'category')
    this.category = [...new Map(sortedData.map(item => [item.categoryId, item])).values()];
  }

  showSummaryFilterForm(data) {
    let grandFatheringEffect;
    (data.filterDataForCapital) ? (data.filterDataForCapital.grandfathering == 2 ? grandFatheringEffect = 2 : grandFatheringEffect = 1) : '2';
    const fromDate = new Date();
    fromDate.setFullYear(fromDate.getFullYear() - 1);
    var todayDate = new Date().toISOString().slice(0, 10);
    this.summaryFilerForm = this.fb.group({
      reportAsOn: [data.reportAsOn ? new Date(data.reportAsOn) : null, [Validators.required]],
      fromDate: [data.fromDate ? new Date(data.fromDate) : null, [Validators.required]],
      toDate: [data.toDate ? new Date(data.toDate) : null, [Validators.required]],
      showFolios: [(data.showFolio) ? data.showFolio + '' : '2', [Validators.required]],
      grandfathering: [(data.grandfathering) ? data.grandfathering + '' : '2', [Validators.required]],
    });
  }

  getSchemeWise(data) {
    const filterData = [];
    data.filter(function (element) {
      // const obj = {
      //   id: element.id,
      //   schemeName: element.schemeName,
      //   amc_name: element.amc_name,
      //   mutualFund: element.mutualFund,
      //   amc_id: element.amc_id,
      //   selected:element.selected
      // };
      const obj = {
        id: element.id,
        schemeName: element.schemeName,
        amc_name: element.amc_name,
        mutualFund: element.mutualFund,
        amc_id: element.amc_id,
        selected: element.selected
      };
      filterData.push(obj);
    });
    let sortedData = this.mfService.sorting(filterData, 'schemeName')
    this.scheme = sortedData;
  }

  getFamilyMember(data) {
    let filterData = [];
    if (this._data.name == "CAPITAL GAIN REPORT") {
      this._data.capitalGainData.mutualFundList.forEach(element => {
        const obj = {
          name: element.ownerName,
          familyMemberId: element.familyMemberId,
          selected: true
        };
        filterData.push(obj);
      });
      if (this._data.filterDataForCapital) {
        filterData.forEach(item => item.selected = '');
        this._data.filterDataForCapital.family_member_list.forEach(element => {
          filterData.forEach(item => {
            if (item.familyMemberId == element.id) {
              item.selected = true;
            }
          });
        });
        filterData.forEach(element => {
          if (element.selected == '') {
            element.selected = false;
          }
        });
        filterData = [...new Map(filterData.map(item => [item.familyMemberId, item])).values()];
        // const familyember = this.mfService.getOtherFilter(filterData,this._data.filterDataForCapital.family_member_list,'id','id','displayName')
      }

    } else {
      data.forEach(element => {
        const obj = {
          name: element.name,
          familyMemberId: element.id,
          selected: element.selected
        };
        filterData.push(obj);
      });
    }
    let sortedData = this.mfService.sorting(filterData, 'name')
    this.familyMember = [...new Map(sortedData.map(item => [item.familyMemberId, item])).values()];
  }

  getTransactionView(data) {
    const filterData = [];
    data.filter(function (element) {
      const obj = {
        displayName: (element.displayName) ? element.displayName : element,
        selected: (element.selected == false) ? element.selected = false : (element.selected == true) ? element.selected = true : true
      };
      filterData.push(obj);
    });
    this.transactionView = filterData;
  }

  getReportType() {
    if (this._data.name == 'SUMMARY REPORT') {
      this.reportType = ['Investor wise', 'Category wise', 'Sub Category wise'];
    } else {
      this.reportType = ['Investor wise', 'Category wise', 'Sub Category wise', 'Scheme wise'];
    }
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
  getFinancialYears(form) {
    let calculatingYears = []
    let sortingYeras: any;
    if (this._data.capitalGainData) {
      // let redemptionList = this._data.capitalGainData.redemptionList
      // redemptionList.forEach(element => {
      //   let year = element.financialYear;
      //   let date = new Date(element.transactionDate);

      //   let finDate = new Date(year, 3, 1);
      //   if (date < finDate) {
      //     year = (element.financialYear - 1)
      //   }
      //   const obj = {
      //     "from": year,
      //     "to": (year + 1),
      //   }
      //   calculatingYears.push(obj);
      // });
      // console.log(calculatingYears);
      // let filteredYears = [...new Map(calculatingYears.map(item => [item.from, item])).values()];
      // sortingYeras = filteredYears.sort((a, b) =>
      //   a.from > b.from ? 1 : (a.from === b.from ? 0 : -1)
      // );
      // this.financialYears = sortingYeras;
      this.financialYears=[{'from':2010,'to':2011,'selected':true},{'from':2011,'to':2012,'selected':true},{'from':2012,'to':2013,'selected':true},{'from':2013,'to':2014,'selected':true},{'from':2014,'to':2015,'selected':true},
      {'from':2015,'to':2016,'selected':true},{'from':2016,'to':2017,'selected':true},{'from':2017,'to':2018,'selected':true},{'from':2018,'to':2019,'selected':true},{'from':2019,'to':2020,'selected':true},{'from':2020,'to':2021,'selected':true}]
      this.financialYears.filter(function (element) {
        if (element.from == 2019 && element.to == 2020) {
          element.selected = true;
          form.get('grandfathering').setValue('1');
          form.get('grandfathering').updateValueAndValidity();

        } else {
          form.get('grandfathering').setValue('2');
          form.get('grandfathering').updateValueAndValidity();
          element.selected = false;
        }

      });
    }
    if (this._data.filterDataForCapital) {
      this.financialYears.forEach(item => item.selected = '');
      this._data.filterDataForCapital.financialYear.forEach(element => {
        this.financialYears.forEach(item => {
          if (item.from == element.from && item.to == element.to) {
            item.selected = true;
          }
        });
      });
      this.financialYears.forEach(element => {
        if (element.selected == '') {
          element.selected = false;
        }
      });
    }

  }
  getReportFormat() {
    this.reportFormat = ['Summary', 'Detailed'];

    const filterData = [];
    this.reportFormat.filter(function (element) {
      const obj = {
        name: element,
        selected: false
      };
      filterData.push(obj);
    });
    if (this._data.filterDataForCapital) {
      filterData.forEach(item => item.selected = '');
      this._data.filterDataForCapital.reportFormat.forEach(element => {
        filterData.forEach(item => {
          if (item.name == element.name) {
            item.selected = true;
          }
        });
      });
      filterData.forEach(element => {
        if (element.selected == '') {
          element.selected = false;
        }
      });
    }
    this.reportFormat = filterData;

  }
  // getTransactionType(){
    
  // }
  getSaveFilters() {
    this.saveFilters = [
      { value: 'Current Client', selected: false }, { value: 'All Client', selected: false }];

  }
  getOverviewFilter() {
    this.overviewFilter = [{ name: 'Summary bar', selected: true },
    { name: 'Scheme wise allocation', selected: true },
    { name: 'Cashflow Status', selected: true },
    { name: 'Family Member wise allocation', selected: true },
    { name: 'Category wise allocation', selected: true },
    { name: 'Sub Category wise allocation', selected: true }];
  }

  changeFilterPeriod(value) {
    console.log('date period ==', value);
    if (value == true) {
      this.transactionPeriod = true;
    } else {
      this.transactionPeriod = false;
    }
  }

  setDefaultFilters() {
    // if (this.familyMember) {
    //   this.familyMember.forEach(item => item.selected = true);
    // }
    // if (this.amc) {
    //   this.amc.forEach(item => item.selected = true);
    // }
    // this.scheme.forEach(item => item.selected = true);
    // this.folio.forEach(item => item.selected = true);
    // this.category.forEach(item => item.selected = true);
    // this.transactionView.forEach(item => item.selected = true);
      this.reportType.forEach(item => {
        this.countReport = 0;
        if(this._data.name == 'SUMMARY REPORT' && this._data.reportType == "Scheme wise"){
          if (item.name == 'Sub Category wise') {
            item.selected = true;
            this.countReport++;
          }
        }else{
          if (item.name == this._data.reportType) {
            item.selected = true;
            this.countReport++;
          }
        }
      });
    if(this._data.selectFilter || this._data.selectFilter == 0){
      this.saveFilters = [
        { value: 'Current Client', selected: (this._data.selectFilter != 0) ? true : false }, { value: 'All Client', selected: (this._data.selectFilter == 0) ? true : false }];
  
    }

    if (this._data.filterDataForCapital) {
      this.reportFormat.forEach(item => {
        this.countFormat = 0;
        if (item.selected) {
          this.countReport++;
        }
      });
    } else {
      this.reportFormat.forEach(item => {
        this.countFormat = 0;
        if (item.name == 'Summary') {
          item.selected = true;
          this.countReport++;
        }
      });
    }
    this.countFamily = this.familyMember.length;
    this.countAmc = this.amc.length;
    if (this.scheme) {
      this.countScheme = this.scheme.length;
    }
    this.countFolio = this.folio.length;
    this.countTranView = this.transactionView.length;
    this.countCategory = this.category.length;
    this.changeSelect('', '');
  }

  changeFilterFamily() {
    (this.familyMemObj.length == 0) ? this.showError = null : (this.familyMemObj.length == 1 && !this.familyMemObj[0].selected) ? this.showError = 'family member' : this.showError = null;
    let filterData = this._data.mfData.mutualFundList;
    filterData = filterData.filter((item: any) =>
      (item.currentValue != 0 && item.currentValue > 0)
    );
    const filterData1 = [];
    const filterData2 = [];
    const filterData3 = [];
    this.familyMember.filter(function (element) {
      if (element.selected == true) {
        filterData.filter(function (amc) {
          // amc.mutualFund.forEach(function (mf) {
          if (amc.familyMemberId == element.familyMemberId) {
            const obj = {
              amc_name: amc.amcName,
              schemeName: amc.schemeName,
              id: amc.schemeId,
              mutualFund: amc.mutualFund,
              amc_id: amc.amcId,
              selected: true
            };
            const obj2 = {
              folioNumber: amc.folioNumber,
              selected: true
            };
            const obj3 = {
              category: amc.categoryName,
              categoryId: amc.categoryId,
              selected: true
            };
            filterData1.push(obj);
            filterData2.push(obj2);
            filterData3.push(obj3);
          }
          // });
        });
      }
    });
    this.scheme = [...new Map(filterData1.map(item => [item.id, item])).values()];
    this.amc = [...new Map(filterData1.map(item => [item.amc_id, item])).values()];
    this.folio = [...new Map(filterData2.map(item => [item.folioNumber, item])).values()];
    this.category = [...new Map(filterData3.map(item => [item.categoryId, item])).values()];
    this.changeSelect('', '');
  }
  // changeFilterFamily() {
  //   (this.familyMemObj.length == 0) ? this.showError = null : (this.familyMemObj.length == 1 && !this.familyMemObj[0].selected) ? this.showError = 'family member' : this.showError = null;
  //   const filterData = this._data.schemeWise;
  //   const filterData1 = [];
  //   const filterData2 = [];
  //   const filterData3 = [];
  //   this.familyMember.filter(function (element) {
  //     if (element.selected == true) {
  //       filterData.filter(function (amc) {
  //         amc.mutualFund.forEach(function (mf) {
  //           if (mf.familyMemberId == element.familyMemberId) {
  //             const obj = {
  //               amc_name: amc.amc_name,
  //               schemeName: amc.schemeName,
  //               id: amc.id,
  //               mutualFund: amc.mutualFund,
  //               amc_id: amc.amc_id,
  //               selected: true
  //             };
  //             const obj2 = {
  //               folioNumber: mf.folioNumber,
  //               selected: true
  //             };
  //             const obj3 = {
  //               category: mf.categoryName,
  //               categoryId: mf.categoryId,
  //               selected: true
  //             };
  //             filterData1.push(obj);
  //             filterData2.push(obj2);
  //             filterData3.push(obj3);
  //           }
  //         });
  //       });
  //     }
  //   });
  //   this.scheme = [...new Map(filterData1.map(item => [item.id, item])).values()];
  //   this.amc = [...new Map(filterData1.map(item => [item.amc_id, item])).values()];
  //   this.folio = [...new Map(filterData2.map(item => [item.folioNumber, item])).values()];
  //   this.category = [...new Map(filterData3.map(item => [item.categoryId, item])).values()];
  //   this.changeSelect('', '');
  // }

  // changeFilterCategory(data) {
  //   (this.categoryObj.length == 0) ? this.showError = null : (this.categoryObj.length == 1 && !this.categoryObj[0].selected) ? this.showError = 'category' : this.showError = null;
  //   const filterData = this._data.schemeWise;
  //   const filterData1 = [];
  //   const filterData2 = [];
  //   const filterData3 = [];
  //   data.filter(function (element) {
  //     if (element.selected == true) {
  //       filterData.filter(function (amc) {
  //         amc.mutualFund.forEach(function (mf) {
  //           if (mf.categoryId == element.categoryId) {
  //             const obj = {
  //               amc_name: amc.amc_name,
  //               schemeName: amc.schemeName,
  //               schemeCode: amc.schemeCode,
  //               mutualFund: amc.mutualFund,
  //               id: amc.id,
  //               amc_id: amc.amc_id,
  //               selected: true
  //             };
  //             const obj2 = {
  //               folioNumber: mf.folioNumber,
  //               selected: true
  //             };
  //             const obj3 = {
  //               name: mf.ownerName,
  //               familyMemberId: mf.familyMemberId,
  //               selected: true
  //             };
  //             filterData1.push(obj);
  //             filterData2.push(obj2);
  //             filterData3.push(obj3);
  //           }
  //         });
  //       });
  //     }
  //   });
  //   this.scheme = [...new Map(filterData1.map(item => [item.id, item])).values()];
  //   this.amc = [...new Map(filterData1.map(item => [item.amc_id, item])).values()];
  //   this.folio = [...new Map(filterData2.map(item => [item.folioNumber, item])).values()]
  //   this.familyMember = [...new Map(filterData3.map(item => [item.familyMemberId, item])).values()];
  //   this.changeSelect('', '');
  // }
  changeFilterCategory(data) {
    (this.categoryObj.length == 0) ? this.showError = null : (this.categoryObj.length == 1 && !this.categoryObj[0].selected) ? this.showError = 'category' : this.showError = null;
    let filterData = this._data.mfData.mutualFundList;
    filterData = filterData.filter((item: any) =>
      (item.currentValue != 0 && item.currentValue > 0)
    );
    const filterData1 = [];
    const filterData2 = [];
    const filterData3 = [];
    data.filter(function (element) {
      if (element.selected == true) {
        filterData.filter(function (amc) {
          // amc.mutualFund.forEach(function (mf) {
          if (amc.categoryId == element.categoryId) {
            const obj = {
              amc_name: amc.amcName,
              schemeName: amc.schemeName,
              schemeCode: amc.schemeCode,
              mutualFund: amc.mutualFund,
              id: amc.schemeId,
              amc_id: amc.amcId,
              selected: true
            };
            const obj2 = {
              folioNumber: amc.folioNumber,
              selected: true
            };
            const obj3 = {
              name: amc.ownerName,
              familyMemberId: amc.familyMemberId,
              selected: true
            };
            filterData1.push(obj);
            filterData2.push(obj2);
            filterData3.push(obj3);
          }
          // });
        });
      }
    });
    this.scheme = [...new Map(filterData1.map(item => [item.id, item])).values()];
    this.amc = [...new Map(filterData1.map(item => [item.amc_id, item])).values()];
    this.folio = [...new Map(filterData2.map(item => [item.folioNumber, item])).values()]
    this.familyMember = [...new Map(filterData3.map(item => [item.familyMemberId, item])).values()];
    this.changeSelect('', '');
  }

  changeFilterFolio() {
    (this.folioObj.length == 0) ? this.showError = null : (this.folioObj.length == 1 && !this.folioObj[0].selected) ? this.showError = 'folio' : this.showError = null;
    const filterData = [];
    // let filterData2 = this._data.mfData.mutualFundList;
    let filterData2 = this._data.mfData.mutualFundList;
    filterData2 = filterData2.filter((item: any) =>
      (item.currentValue != 0 && item.currentValue > 0)
    );
    const filterData1 = [];
    const filterData3 = [];
    this.folio.filter(function (element) {
      if (element.selected == true) {
        filterData2.forEach(amc => {
          // amc.mutualFund.forEach(mf => {
          if (element.folioNumber == amc.folioNumber) {
            const obj = {
              amc_name: amc.amcName,
              schemeName: amc.schemeName,
              schemeCode: amc.schemeCode,
              mutualFund: amc.mutualFund,
              id: amc.schemeId,
              amc_id: amc.amcId,
              selected: true
            };
            const obj1 = {
              name: amc.ownerName,
              familyMemberId: amc.familyMemberId,
              selected: true
            };

            const obj2 = {
              category: amc.categoryName,
              categoryId: amc.categoryId,
              selected: true
            };
            filterData.push(obj);
            filterData1.push(obj1);
            filterData3.push(obj2);
          }
          // });
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
    (this.amcObj.length == 0) ? this.showError = null : (this.amcObj.length == 1 && !this.amcObj[0].selected) ? this.showError = 'amc' : this.showError = null;
    const filterData = [];
    // let filterData2 = this._data.mfData.mutualFundList;
    let filterData2 = this._data.mfData.mutualFundList;
    filterData2 = filterData2.filter((item: any) =>
      (item.currentValue != 0 && item.currentValue > 0)
    );
    const filterData1 = [];
    const filterData3 = [];
    const filterData4 = [];
    this.amc.filter(function (element) {
      if (element.selected == true) {
        filterData2.forEach(amc => {
          // amc.mutualFund.forEach(mf => {
          if (element.amc_id == amc.amcId) {
            const obj = {
              amc_name: amc.amcName,
              schemeName: amc.schemeName,
              schemeCode: amc.schemeCode,
              mutualFund: amc.mutualFund,
              id: amc.schemeId,
              amc_id: amc.amcId,
              selected: true
            };
            const obj1 = {
              name: amc.ownerName,
              familyMemberId: amc.familyMemberId,
              selected: true
            };
            const obj4 = {
              folioNumber: amc.folioNumber,
              selected: true
            };
            const obj2 = {
              category: amc.categoryName,
              categoryId: amc.categoryId,
              selected: true
            };
            filterData.push(obj);
            filterData1.push(obj1);
            filterData3.push(obj2);
            filterData4.push(obj4);
          }
          // });
        });
      }
    });
    this.scheme = [...new Map(filterData.map(item => [item.id, item])).values()];
    this.folio = [...new Map(filterData4.map(item => [item.folioNumber, item])).values()];
    this.familyMember = [...new Map(filterData1.map(item => [item.familyMemberId, item])).values()];
    this.category = [...new Map(filterData3.map(item => [item.categoryId, item])).values()];
    console.log(this.amc);
    this.changeSelect('', '');


    // (this.amcObj.length == 0) ? this.showError = null : (this.amcObj.length == 1 && !this.amcObj[0].selected) ? this.showError = 'amc' : this.showError = null;
    // this.obj = this.mfService.filterScheme(this.amc);
    // this.folio = [...new Map(this.obj.filterData.map(item => [item.folioNumber, item])).values()];
    // this.familyMember = [...new Map(this.obj.filterData2.map(item => [item.familyMemberId, item])).values()];
    // this.category = [...new Map(this.obj.filterData3.map(item => [item.categoryId, item])).values()];
    // this.scheme = [...new Map(this.obj.filterData4.map(item => [item.id, item])).values()];

    // this.changeSelect('', '');
  }

  changeFilterScheme() {
    (this.schemeObj.length == 0) ? this.showError = null : (this.schemeObj.length == 1 && !this.schemeObj[0].selected) ? this.showError = 'scheme' : this.showError = null;
    const filterData = [];
    let filterData2 = this._data.mfData.mutualFundList;
    filterData2 = filterData2.filter((item: any) =>
      (item.currentValue != 0 && item.currentValue > 0)
    );
    const filterData1 = [];
    const filterData3 = [];
    const filterData4 = [];
    this.scheme.filter(function (element) {
      if (element.selected == true) {
        filterData2.forEach(amc => {
          // amc.mutualFund.forEach(mf => {
          if (element.id == amc.schemeId) {
            const obj = {
              amc_name: amc.amcName,
              schemeName: amc.schemeName,
              schemeCode: amc.schemeCode,
              mutualFund: amc.mutualFund,
              id: amc.schemeId,
              amc_id: amc.amcId,
              selected: true
            };
            const obj1 = {
              name: amc.ownerName,
              familyMemberId: amc.familyMemberId,
              selected: true
            };
            const obj4 = {
              folioNumber: amc.folioNumber,
              selected: true
            };
            const obj2 = {
              category: amc.categoryName,
              categoryId: amc.categoryId,
              selected: true
            };
            filterData.push(obj);
            filterData1.push(obj1);
            filterData3.push(obj2);
            filterData4.push(obj4);
          }
          // });
        });
      }
    });
    this.amc = [...new Map(filterData.map(item => [item.amc_id, item])).values()];
    this.familyMember = [...new Map(filterData1.map(item => [item.familyMemberId, item])).values()];
    this.folio = [...new Map(filterData4.map(item => [item.folioNumber, item])).values()];
    this.category = [...new Map(filterData3.map(item => [item.categoryId, item])).values()];

    this.changeSelect('', '');


    // (this.schemeObj.length == 0) ? this.showError = null : (this.schemeObj.length == 1 && !this.schemeObj[0].selected) ? this.showError = 'scheme' : this.showError = null;
    // this.obj = this.mfService.filterScheme(this.scheme);
    // this.folio = [...new Map(this.obj.filterData.map(item => [item.folioNumber, item])).values()];
    // this.familyMember = [...new Map(this.obj.filterData2.map(item => [item.familyMemberId, item])).values()];
    // this.category = [...new Map(this.obj.filterData3.map(item => [item.categoryId, item])).values()];
    // this.amc = [...new Map(this.obj.filterData4.map(item => [item.amc_id, item])).values()];
    // this.changeSelect('', '');
  }

  changeReportFilter(value) {
    this.reportType.forEach(element => {
      if (element.name != value.name) {
        element.selected = false;
      }
    });
    this.changeSelect('', '');
  }
  changeFormatFilter(value) {
    (this.reportFormatObj.length == 0) ? this.showError = null : (this.reportFormatObj.length == 1 && !this.reportFormatObj[0].selected) ? this.showError = 'report format' : this.showError = null;
    this.reportFormat.forEach(element => {
      if (element.name != value.name) {
        element.selected = false;
      }
    });
    this.changeSelect('', '');
  }
  changeFinancialYear(value) {
    (this.financialYearsObj.length == 0) ? this.showError = null : (this.financialYearsObj.length == 1 && !this.financialYearsObj[0].selected) ? this.showError = 'financial year' : this.showError = null;
    if (value.from <= 2017) {
      this.showGrandfathering = false;
      this.summaryFilerForm.get('grandfathering').setValue('2');
    } else {
      this.showGrandfathering = true;
      this.summaryFilerForm.get('grandfathering').setValue('1');
    }
    this.financialYears.forEach(element => {
      if (element.from != value.from) {
        element.selected = false;
      }
    });
    this.changeSelect('', '');
  }
  saveFilterCall(){
    let ReportFilterConfigModel = [];
    let reportId;
    switch (this._data.name) {
      case 'Overview Report':
        reportId = 1;
        break;
      case 'SUMMARY REPORT':
        reportId = 2;
        break;
      case 'ALL TRANSACTION REPORT':
        reportId = 3;
        break;
      case 'UNREALIZED TRANSACTION REPORT':
        reportId = 4;
        break;
    }
    let trnOrder = [];
    if(this._data.name == 'Overview Report'){
      this.overviewFilter.forEach((element,ind) => {
        const obj = {
          advisorId: this.advisorId,
          clientId:(this.saveFilters[0].selected == true) ? this.clientId : 0,
          transactionOrder: ind,
          columnName: element.name,
          selected: element.selected,
          reportType: (this.reportTypeobj.length > 0) ? this.reportTypeobj[0].name : 'Sub Category wise',
          transactionReportType: (this._data.name == 'UNREALIZED TRANSACTION REPORT') ? 'Unrealized report' : (this._data.name == 'ALL TRANSACTION REPORT') ? 'Transaction report' :'-',
          showZeroFolios: (this.summaryFilerForm.controls.showFolios.value == '1') ? 'true' : 'false',
          reportId:reportId,
        }
        ReportFilterConfigModel.push(obj)
      });
    }else{
      this.transactionView.forEach((element,ind) => {
        const obj = {
          advisorId: this.advisorId,
          clientId:(this.saveFilters[0].selected == true) ? this.clientId : 0,
          transactionOrder: ind,
          columnName: element.displayName,
          selected: element.selected,
          reportType: (this.reportTypeobj.length > 0) ? this.reportTypeobj[0].name : 'Sub Category wise',
          transactionReportType: (this._data.name == 'UNREALIZED TRANSACTION REPORT') ? 'Unrealized report' : (this._data.name == 'ALL TRANSACTION REPORT') ? 'Transaction report' :'-',
          showZeroFolios: (this.summaryFilerForm.controls.showFolios.value == '1') ? 'true' : 'false',
          reportId:reportId,
        }
        ReportFilterConfigModel.push(obj)
      });
    }
  
    // const ReportFilterConfigModel = [{
    //   advisorId: this.advisorId,
    //   clientId:(value.value == 'Current Client') ? this.clientId : 0,
    //   transactionOrder: trnOrder,
    //   reportType: this.reportTypeobj[0].name,
    //   transactionReportType: (this._data.name == 'UNREALIZED TRANSACTION REPORT') ? 'Unrealized report' : (this._data.name == 'ALL TRANSACTION REPORT') ? 'Transaction report' :null,
    //   showZeroFolios: (this.summaryFilerForm.controls.showFolios.value == '1') ? 'true' : 'false',
    //   reportId:reportId,
    // }
    // ]
    const obj={
      ReportFilterConfigModel:ReportFilterConfigModel
    }
  //  const reportFilterConfigModelList={
  //   ReportFilterConfigModel: [ReportFilterConfigModel]
  //  }
    this.custumService.AddSaveFilters(obj).subscribe(
      data => {
        console.log(data);
      }
    );
  }
  changeSaveFilterSelection(value) {
    this.saveFilters.forEach(element => {
      if (element.value != value.value) {
        element.selected = false;
      }
    });
  }
  changeSelect = function (data, i) {
    this.sendTransactionView = this._data.transactionView;
    if (this._data.name == 'Overview Report') {
      if (this.overviewFilter != undefined) {
        this.overviewFilterCount = 0;
        this.overviewFilter.forEach(item => {
          if (item.selected) {
            this.overviewFilterCount++;
          }
        });
      }
    } else {
      if (data.selected == true) {
        this.sendTransactionView.push(i);
      } else if (data.selected == false) {
        this.sendTransactionView.splice(i, 1);
      }
      console.log('data ==', this.sendTransactionView);
    }
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
      if (data != "") {
        (this.transactionView.length == 0) ? this.showError = null : (this.transactionView.length == 1 && !this.transactionView[0].selected) ? this.showError = 'transaction view' : this.showError = null;
      }
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
    if (this.reportFormat != undefined) {
      const filter = [];
      this.reportFormat.forEach(item => {
        if (item.selected) {
          filter.push(item);
        }
      });
      this.reportFormatObj = filter;
    }
    if (this.financialYears != undefined) {
      const filter = [];
      this.financialYears.forEach(item => {
        if (item.selected) {
          filter.push(item);
        }
      });
      this.financialYearsObj = filter;
    }
    if (this._data.name == 'Overview Report') {
      let array = [];
      array = this.overviewFilter.filter(item => item.selected == false);
      (array.length == this.overviewFilter.length) ? this.showError = 'filter view' : this.showError = null;
    }
  };

  selectAll(value) {
    if(value.checked){
      this.selectUnselctAllFlag = value.checked
      this.familyMember.forEach(item => item.selected = true);
      this.amc.forEach(item => item.selected = true);
      this.scheme.forEach(item => item.selected = true);
      this.folio.forEach(item => item.selected = true);
      this.transactionView.forEach(item => item.selected = true);
      this.category.forEach(item => item.selected = true);

    }else{
      this.familyMember.forEach(item => item.selected = false);
      this.amc.forEach(item => item.selected = false);
      this.scheme.forEach(item => item.selected = false);
      this.folio.forEach(item => item.selected = false);
      this.transactionView.forEach(item => item.selected = false);
      this.category.forEach(item => item.selected = false);
      this.selectUnselctAllFlag = value.checked

    }
    this.changeSelect('', '');
    // if (array != undefined) {
    //   array.forEach(item => {
    //     item.selected = event.checked;
    //   });
    //   this.changeSelect('', '');
    // }

  }

  generateReport() {
    this.barButtonOptions.active = true;
    var todayDate = new Date().toISOString().slice(0, 10);

    if (this.transactionPeriod == false && this._data.name != 'CAPITAL GAIN REPORT') {
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
      reportFormat: (this.reportFormatObj) ? this.reportFormatObj : this.reportFormat,
      financialYear: (this.financialYears) ? this.financialYearsObj : this.financialYears,
      overviewFilter: this.overviewFilter,
      transactionView: this.transactionView,
      reportAsOn: (this.summaryFilerForm.controls.reportAsOn.value) ? this.datePipe.transform(this.summaryFilerForm.controls.reportAsOn.value, 'yyyy-MM-dd') : new Date(),
      fromDate: this.datePipe.transform(this.summaryFilerForm.controls.fromDate.value, 'yyyy-MM-dd'),
      toDate: this.datePipe.transform(this.summaryFilerForm.controls.toDate.value, 'yyyy-MM-dd'),
      showFolio: parseInt(this.summaryFilerForm.controls.showFolios.value),
      grandfathering: parseInt(this.summaryFilerForm.controls.grandfathering.value),
      capitalGainData: this._data.capitalGainData,
      name: this._data.name,
      transactionPeriodCheck: this.transactionPeriodCheck,
      transactionPeriod: this.transactionPeriod
    };
    console.log('dataToSend---------->', this.dataToSend);
    if(this.saveFilters[0].selected == true || this.saveFilters[1].selected == true){
      this.saveFilterCall();
    }
    this.finalFilterData = this.mfService.filterFinalData(this._data.mfData, this.dataToSend);
    this.finalFilterData.transactionView = this.transactionView;
    console.log('this.sendTransactionView ====', this.finalFilterData);
    console.log(this.finalFilterData);
    // if (this._data.name == 'UNREALIZED TRANSACTION REPORT') {
    //   let mutualFund = this.finalFilterData.mutualFundList;
    //   (this.dataToSend.toDate != todayDate) ? Object.assign(mutualFund, { toDate: this.dataToSend.toDate }) : null;
    //   this.obj = {
    //     mutualFundList: mutualFund
    //   }
    //   this.custumService.getMfUnrealizedTransactions(this.obj).subscribe(
    //     data => {
    //       console.log(data);
    //       this.barButtonOptions.active = false;
    //       this.finalFilterData.mutualFundList = data;
    //       this.Close(this.finalFilterData);
    //     }
    //   );

    // } else if (this._data.name == 'ALL TRANSACTION REPORT' && this.dataToSend.toDate && this.dataToSend.toDate != todayDate) {
    //   let catObj: any;
    //   catObj = this.mfService.categoryFilter(this.finalFilterData.mutualFundList, 'id');
    //   Object.keys(catObj).map(key => {
    //     catObj[key].forEach((singleData) => {
    //       let singleDataTransaction = singleData;
    //       singleData = {};
    //       catObj[key] = [];
    //       singleDataTransaction.mutualFundTransactions.forEach((ele) => {
    //         const singleData = {
    //           unit: ele.unit,
    //           transactionDate: ele.transactionDate,
    //           schemeCode: singleDataTransaction.schemeCode,
    //           effect: ele.effect,
    //         }
    //         catObj[key].push(singleData);
    //       });
    //     });

    //   });
    //   catObj.toDate = this.dataToSend.toDate;
    //   console.log(catObj.toDate);
    //   this.custumService.getMfUnrealizedTransactions(catObj).subscribe(
    //     data => {
    //       console.log(data);
    //     }
    //   );
    // } else if(this._data.name != 'CAPITAL GAIN REPORT') {

    //   this.obj = {
    //     advisorId:this.advisorId,
    //     clientId:this.clientId,
    //     toDate: JSON.stringify(this.finalFilterData.reportAsOn),
    //     id: this.finalFilterData.categoryWiseMfList
    //   }
    //   this.custumService.getMutualFund(this.obj).subscribe(
    //     data => {
    //       console.log(data);
    //       this.barButtonOptions.active = false;
    //       this.finalFilterData.mfData = data;
    //       this.Close(this.finalFilterData);
    //     }
    //   );
    // this.obj = {
    //   advisorId:this.advisorId,
    //   clientId:this.clientId,
    //   lastDate: (this.finalFilterData.reportAsOn) ? this.finalFilterData.reportAsOn : this.finalFilterData.toDate,
    //   reportType:this.finalFilterData.categoryWiseMfList
    // }
    // this.custumService.getDatedReportWiseCalculations(this.obj).subscribe(
    //   data => {
    //     console.log(data);
    //     this.barButtonOptions.active = false;
    //     this.finalFilterData.mutualFundList = data;
    //     this.Close(this.finalFilterData);
    //   }
    // );
    // this.barButtonOptions.active = false;
    // this.Close(this.finalFilterData);
    // }
    if (this._data.name != 'CAPITAL GAIN REPORT') {
      this.obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        toDate: (this.finalFilterData.reportAsOn) ? JSON.stringify(this.finalFilterData.reportAsOn) : JSON.stringify(this.finalFilterData.toDate),
        id: this.finalFilterData.categoryWiseMfList
      }
      this.custumService.getMutualFund(this.obj).subscribe(
        data => {
          console.log(data);
          this.barButtonOptions.active = false;
          this.finalFilterData.mfData = data;
          this.Close(this.finalFilterData);
        }
      );
    } else {
      this.barButtonOptions.active = false;
      this.Close(this.finalFilterData);
    }

  }




  Close(data) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', data: data });
  }
}
