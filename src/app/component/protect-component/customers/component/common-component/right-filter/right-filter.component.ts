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
    this.category = this._data.category;
    this.getSchemeWise(this.amc);
    this.getFamilyMember(this._data.folioWise)
    this.getTransactionView(this._data.transactionView);
    this.getReportType();
    this.setDefaultFilters();
    this.showSummaryFilterForm('');
  }
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }


  getFormControl(): any {
    return this.summaryFilerForm.controls;
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
        "schemeCode": element.schemeCode,
        "schemeName": element.schemeName,
        "amc_name": element.amc_name,
        "mutualFund": element.mutualFund
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
    let filterData4 = [];
    this.familyMember.filter(function (element) {
      if (element.selected == true) {
        filterData.filter(function (amc) {
          amc.mutualFund.forEach(function (mf) {
            if (mf.familyMemberId == element.familyMemberId) {
              const obj = {
                "amc_name": amc.amc_name,
                "schemeName": amc.schemeName,
                "schemeCode": amc.schemeCode,
                "mutualFund": amc.mutualFund,
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
    this.scheme = [...new Map(filterData1.map(item => [item['schemeCode'], item])).values()];
    this.amc = this.scheme;
    this.folio = filterData2;
    this.category = [...new Map(filterData3.map(item => [item['categoryId'], item])).values()];
    this.changeSelect();
  }
  changeFilterAmc() {
    let filterData2 = [];
    let filterData3 = [];
    let filterData4 = []
    let filterData = [];
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
          filterData3.push(obj2);
          filterData4.push(obj3)
        });
        const obj = {
          "schemeName": element.schemeName,
          "amc_name": element.amc_name,
          "mutualFund": element.mutualFund,
          "selected": true
        }
        filterData2.push(obj);
      }
    })
    this.scheme = filterData2;
    this.folio = filterData;
    this.familyMember = [...new Map(filterData3.map(item => [item['familyMemberId'], item])).values()];
    this.category = [...new Map(filterData4.map(item => [item['categoryId'], item])).values()];
    this.changeSelect();
  }
  changeFilterScheme() {
    let filterData = [];
    let filterData2 = [];
    let filterData3 = [];
    let filterData4 = [];
    this.scheme.filter(function (element) {
      if (element.selected == true) {
        const obj = {
          "amc_name": element.amc_name,
          "schemeName": element.schemeName,
          "mutualFund": element.mutualFund,
          "selected": true
        }
        filterData.push(obj);

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
          filterData2.push(obj);
          filterData3.push(obj2);
          filterData4.push(obj3)
        });
      }
    })
    this.amc = filterData;
    this.folio = filterData2;
    this.familyMember = [...new Map(filterData3.map(item => [item['familyMemberId'], item])).values()];
    this.category = [...new Map(filterData4.map(item => [item['categoryId'], item])).values()];
    this.changeSelect();
  }
  changeFilterCategory() {
    let filterData1 = [];
    let filterData2 = [];
    let filterData3 = [];
    let filterData4 = []
    let filterData = this._data.schemeWise;
    this.category.filter(function (element) {
      if (element.selected == true) {
        filterData.filter(function (amc) {
          amc.mutualFund.forEach(function (mf) {
            if (mf.categoryId == element.id) {
              const obj = {
                "amc_name": amc.amc_name,
                "schemeName": amc.schemeName,
                "schemeCode": amc.schemeCode,
                "mutualFund": amc.mutualFund,
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
              // const obj3 = {
              //   "category": mf.categoryName,
              //   "categoryId": mf.categoryId,
              //   "selected": true
              // }

              filterData1.push(obj);
              filterData2.push(obj2);
              filterData3.push(obj3);
            }
          })
        })
      }
    })
    this.scheme = [...new Map(filterData1.map(item => [item['schemeCode'], item])).values()];
    this.amc = this.scheme;
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
    this.scheme = [...new Map(filterData.map(item => [item['schemeCode'], item])).values()];
    this.amc = this.scheme;
    this.familyMember = [...new Map(filterData1.map(item => [item['familyMemberId'], item])).values()];
    this.category = [...new Map(filterData3.map(item => [item['categoryId'], item])).values()];
    console.log(this.amc)
    this.changeSelect();
  }
  changeSelect = function () {

    // this.folio.filter(function(element){
    //   if (element.selected == true) {
    //     const obj = {
    //       "schemeName": element.schemeName,
    //       "selected":true
    //     }
    //     filterData.push(obj);
    //   }
    // })
    // this.scheme = filterData;

    if (this.familyMember != undefined) {
      this.countFamily = 0;
      this.familyMember.forEach(item => {
        if (item.selected) {
          this.countFamily++;
        }
      });
    }
    if (this.amc != undefined) {
      this.countAmc = 0;
      this.amc.forEach(item => {
        if (item.selected) {
          this.countAmc++;
        }
      });
    }
    if (this.scheme != undefined) {
      this.countScheme = 0;
      this.scheme.forEach(item => {
        if (item.selected) {
          this.countScheme++;
        }
      });
    }
    if (this.folio != undefined) {
      this.countFolio = 0;
      this.folio.forEach(item => {
        if (item.selected) {
          this.countFolio++;
        }
      });
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
      this.countCategory = 0;
      this.category.forEach(item => {
        if (item.selected) {
          this.countCategory++;
        }
      });
    }
    if (this.reportType != undefined) {
      this.countReport = 0;
      this.reportType.forEach(item => {
        if (item.selected) {
          this.countReport++;
        }
      });
    }
    // console.log(data)
    // // set meta filters 
    // this._filtersMeta = {
    //   familyMembers: this.getSelectionCount(this.familyMember),
    //   amc: this.getSelectionCount(this.amc),
    //   schemes: this.getSelectionCount(this.scheme),
    //   folios: this.getSelectionCount(this.folios),
    //   // transactionsView: this.getSelectionCount(filters.transactionsView),
    //   // category: this.getSelectionCount(filters.category),
    //   // transactionsViewCount: this.setSelectionCount(filters.transactionsView),
    // }
  }
  getSelectionCount = function (arr) {
    this.dataCount = 0;
    var dataCount = arr.forEach(element => {
      if (element.visible) {
        return this.dataCount++;
      }
    });
    // var c = _.sumBy(arr, function(o) {
    //   return (o.visible) ? 1 : 0;
    // })
    // var selection =
    //   (c == 0) ? "None Selected" :
    //     (c < arr.length) ? (c + " of " + arr.length + " selected") : "All Selected"
    // return selection
  }
  generateReport() {
    if (this.summaryFilerForm.get('reportAsOn').invalid) {
      this.summaryFilerForm.get('reportAsOn').markAsTouched();
      return
    }
    this.dataToSend = {
      'advisorId': 3967,
      'clientId': 2982,
      'familyMember': this.familyMember.filter(ele => ele.selected == true),
      'amc': this.amc.filter(ele => ele.selected == true),
      'scheme': this.scheme.filter(ele => ele.selected == true),
      'folio': this.folio.filter(ele => ele.selected == true),
      'transactionView': this.transactionView.filter(ele => ele.selected == true),
      'reportType': this.reportType.filter(ele => ele.selected == true),
      'category': this.category.filter(ele => ele.selected == true),
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
  getMutualFundResponse(data){
    console.log(data)
  }
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private subInjectService: SubscriptionInject, private fb: FormBuilder ,private custumService:CustomerService ,private eventService:EventService) {
    this.dataSource.data = TREE_DATA;
  }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  Close(data) {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }


}
interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [
      { name: 'Apple' },
      { name: 'Banana' },
      { name: 'Fruit loops' },
    ]
  }, {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          { name: 'Broccoli' },
          { name: 'Brussel sprouts' },
        ]
      }, {
        name: 'Orange',
        children: [
          { name: 'Pumpkins' },
          { name: 'Carrots' },
        ]
      },
    ]
  },
];


interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}