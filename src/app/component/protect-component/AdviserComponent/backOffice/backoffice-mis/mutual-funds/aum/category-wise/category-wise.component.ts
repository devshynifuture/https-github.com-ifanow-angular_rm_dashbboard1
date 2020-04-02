import { Component, OnInit } from '@angular/core';

// import * as $ from 'jquery';
import { BackOfficeService } from '../../../../back-office.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AumComponent } from '../aum.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ExcelMisService } from '../excel-mis.service';

@Component({
  selector: 'app-category-wise',
  templateUrl: './category-wise.component.html',
  styleUrls: ['./category-wise.component.scss']
})
export class CategoryWiseComponent implements OnInit {
  category;
  subcategory;
  showLoader;
  teamMemberId = 2929;
  advisorId = AuthService.getAdvisorId();
  subCategoryList: any[] = [];
  constructor(
    private backoffice: BackOfficeService, private dataService: EventService, public aum: AumComponent,
    private excelMis: ExcelMisService
  ) { }

  selectedCategory;
  ngOnInit() {

    this.getSubCatSchemeName();
    // this.clientFolioWise();
    // this.getSubCatAum();
  }

  getSubCatSchemeName() {
    this.showLoader = true;
    const data = {
      advisorId: this.advisorId,
      arnRiaDetailsId: -1,
      parentId: -1
    }

    this.backoffice.getTotalByAumScheme(data).subscribe(
      data => this.getFileResponseDataForSubSchemeName(data),
      err => this.getFilerrorResponse(err)
    )
  }
  clientFolioWise() {
    const obj = {
      amcName: 'Aditya Birla',
      teamMemberId: this.teamMemberId
    }
    this.backoffice.getClientFolioWiseInCategory(obj).subscribe(
      data => {
        console.log(data);
      },
      err => this.getFilerrorResponse(err)
    )
  }
  // getSubCatAum(){
  //   this.backoffice.getSubCatAum(this.teamMemberId).subscribe(
  //    data => this.getFileResponseDataForSub(data),
  //    err => this.getFilerrorResponse(err)

  //  )
  // }
  // getFileResponseDataForSub(data) {

  //   this.category=data.category;
  //   this.subcategory=data.subcategory;

  // }

  showSubTableList(index, category) {
    this.selectedCategory = index
    this.category[index].showCategory = (category) ? category = false : category = true;
    console.log(this.category[index])
    console.log(category)
  }

  getFileResponseDataForSubSchemeName(data) {
    console.log("scheme Name:::", data);

    this.category = data.categories;
    this.exportToExcelReport('category');
    this.category.forEach(o => {
      o.showCategory = true;
      this.subCategoryList.push(o.subCategoryList);

      o.subCategoryList.forEach(sub => {
        sub.showSubCategory = true;
      })
    });
    this.showLoader = false;
  }
  showSchemeName(index, subcashowSubcat) {
    this.category[this.selectedCategory].subCategoryList[index].showSubCategory = (subcashowSubcat) ? subcashowSubcat = false : subcashowSubcat = true;
  }
  aumReport() {
    this.aum.aumComponent = true;
  }
  getFilerrorResponse(err) {
    this.dataService.openSnackBar(err, 'Dismiss')
  }

  categoryWiseExcelSheet() {
    let headerData = [
      { width: 20, key: 'Sr.No.' },
      { width: 50, key: 'Sub Category Name' },
      { width: 30, key: 'Current Value' },
      { width: 30, key: '% Weight' }
    ];
    let header = [
      'Sr.No.',
      'Sub Category Name',
      'Current Value',
      '% Weight',
    ];
    let dataValue;
    let excelData = [];
    this.category.forEach((element, index) => {
      dataValue = [
        index + 1,
        element.subCategoryList[index].name,
        element.totalAum,
        element.weightInPercentage
      ];
      excelData.push(Object.assign(dataValue));
    });

    ExcelMisService.exportExcel(headerData, header, excelData, [], 'category-wise-excel');
    // excelData: any, footer: any[], metaData: any

  }

  subCategoryWiseExcelSheet() {

  }

  exportToExcelReport(choice) {
    switch (choice) {
      case 'category':
        this.categoryWiseExcelSheet();
      case 'sub-category':
        this.subCategoryWiseExcelSheet();
    }
  }
}
