import { Component, OnInit, Input } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

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
  @Input()
  set data(inputData) {
    this._data = inputData;
  }
  get data() {
    return this._data;
  }
  ngOnInit(): void {
    this.familyMember = this._data.familyMember
    this.amc = this._data.schemeWise;
    this.folio = this._data.folioWise;
    this.category = this._data.category;
    this.getSchemeWise(this.amc);
    this.getTransactionView(this._data.transactionView);
    this.getReportType();
    this.setDefaultFilters();
  }
  _filtersMeta: {
    familyMembers: "All Selected",
    amc: "All Selected",
    schemes: "All Selected",
    folios: "All Selected",
    transactionsView: "All Selected",
    category: "All Selected",
    transactionsViewCount: 11,
  }
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }
  getSchemeWise(data) {
    let filterData = [];
    data.filter(function (element) {
      const obj = {
        "schemeCode": element.schemeCode,
        "schemeName": element.schemeName,
      }
      filterData.push(obj);
    })
    this.scheme = filterData;
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

  changeSelect = function () {
    let filterData2 = [];
    let filterData3=[];
    let filterData = [];
    this.amc.filter(function (element) {
      if (element.selected == true) {
          element.mutualFund.forEach(ele => {
            const obj = {
              "folioNumber": ele.folioNumber,
              "selected":true
            }
            const obj2={
              "name": ele.ownerName,
              "familyMemberId":ele.familyMemberId,
              "selected":true
            }
            filterData.push(obj);
            filterData3.push(obj2);

          });
          const obj = {
            "schemeName": element.schemeName,
            "selected":true
          }
          filterData2.push(obj);
      }
    })
    this.scheme = filterData2;
    this.folio=filterData;
    var jobsUnique = filterData3.filter(function(item, index){
      return filterData3.indexOf(item) >= index;
    });
    this.familyMember=jobsUnique;
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

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private subInjectService: SubscriptionInject) {
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