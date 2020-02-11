import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mutual-fund-summary',
  templateUrl: './mutual-fund-summary.component.html',
  styleUrls: ['./mutual-fund-summary.component.scss']
})
export class MutualFundSummaryComponent implements OnInit {


  displayedColumns: string[] = ['schemeName', 'amountInvested', 'currentValue', 'unrealizedProfit', 'absoluteReturn', 'xirr', 'dividendPayout', 'switchOut', 'balanceUnit', 'navDate', 'sipAmount'];




  mfData: any;
  filteredArray: any[];
  subCategoryData: any[];
  schemeWise: any[];
  mutualFundList: any[];

  constructor() { }
  @Input() mutualFund;

  ngOnInit() {
    this.getSubCategoryWise(this.mutualFund)
    this.getSchemeWise();
    this.mfSchemes();
  }
  subCatArray(data) {
    let catObj = {};
    const categoryArray = [];
    this.mutualFundList.forEach(ele => {
      if (ele.subCategoryName) {
        const categoryArray = catObj[ele.subCategoryName] ? catObj[ele.subCategoryName] : [];
        categoryArray.push(ele);
        catObj[ele.subCategoryName] = categoryArray;
      } else {
        categoryArray.push(ele);
      }
    });
    const customDataSource = new MatTableDataSource(categoryArray);
    Object.keys(catObj).map(key => {
      customDataSource.data.push({ groupName: key });
      catObj[key].forEach((singleData) => {
        customDataSource.data.push(singleData);
      });
    });
    console.log(customDataSource)
    return customDataSource;

  }
  isGroup(index, item): boolean {
    // console.log('index : ', index);
    // console.log('item : ', item);
    return item.groupName;
  }

  getSubCategoryWise(data) {
    this.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    this.subCategoryData = this.filteredArray
  }
  getSchemeWise() {
    this.filter(this.filteredArray, 'mutualFundSchemeMaster');
    this.schemeWise = this.filteredArray
  }
  mfSchemes() {
    this.filter(this.schemeWise, 'mutualFund');
    this.mutualFundList = this.filteredArray;
  }
  //Used for filtering the data 
  filter(data, key) {
    const filterData = [];
    const finalDataSource = [];
    data.filter(function (element) {
      filterData.push(element[key])
    })
    if (filterData.length > 0) {
      filterData.forEach(element => {
        element.forEach(data => {
          finalDataSource.push(data)
        });
      });
    }
    this.filteredArray = finalDataSource;//final dataSource Value
    return;
  }
}
