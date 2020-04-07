import { Component, OnInit, EventEmitter, Output } from '@angular/core';
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
  showLoader = true;
  isLoading = false;
  teamMemberId = 2929;
  advisorId = AuthService.getAdvisorId();
  subCategoryList: any[] = [];
  totalAumForSubSchemeName: any;
  amcWiseData: any;

  arrayOfHeaders: any[][] = [
    [
      'Sr. No.',
      'Category Name',
      'Current Value',
      '% Weight'
    ],
    [
      'Sr. No.',
      'Sub Category Name',
      'Current Name',
      '% Weight'
    ],
    [
      'Sr. No.',
      'Scheme Name',
      'Current Value',
      '% Weight'
    ],
    [
      'Applicant Name',
      'Balance Unit',
      'Folio',
      'Current Amount',
      '% Weight'
    ]
  ];
  arrayOfHeaderStyles: { width: number; key: string; }[][] = [
    [
      { width: 10, key: 'Sr. No.' },
      { width: 50, key: 'Category Name' },
      { width: 30, key: 'Current Value' },
      { width: 10, key: '% Weight' }
    ],
    [
      { width: 10, key: 'Sr. No.' },
      { width: 50, key: 'Sub Category Name' },
      { width: 30, key: 'Current Value' },
      { width: 10, key: '% Weight' }
    ],
    [
      { width: 10, key: 'Sr. No.' },
      { width: 50, key: 'Scheme Name' },
      { width: 30, key: 'Current Name' },
      { width: 10, key: '% Weight' }
    ],
    [
      { width: 50, key: 'Applicant Name' },
      { width: 30, key: 'Balance Unit' },
      { width: 30, key: 'Folio' },
      { width: 30, key: 'Current Amount' },
      { width: 10, key: '% Weight' },
    ]
  ];
  arrayOfExcelData: any[] = [];
  @Output() changedValue = new EventEmitter();
  selectedSubCategory: any;
  selectedClientIndex: any;
  totalCurrentValue: any;
  totalWeight: any;

  constructor(
    private backoffice: BackOfficeService, private dataService: EventService, public aum: AumComponent
  ) { }
  selectedCategory;
  ngOnInit() {
    this.getSubCatSchemeName();


    // this.clientFolioWise();
    // this.getSubCatAum();
  }

  getSubCatSchemeName() {
    this.isLoading = true;
    this.category = [{}, {}, {}];
    const obj = {
      advisorId: this.advisorId,
      arnRiaDetailsId: -1,
      parentId: -1
    }
    this.backoffice.getTotalByAumScheme(obj).subscribe(
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

  showSubTableList(index, category, catIndex) {

    this.selectedCategory = index;
    category.showCategory = !category.showCategory;
    console.log("need to check this::", this.category[index]);
    // console.log(category);
    if (!category.showCategory) {
      if (this.category[this.selectedCategory].hasOwnProperty('subCategoryList') && this.category[this.selectedCategory].subCategoryList.length !== 0) {
        this.appendingOfValuesInExcel(this.category[this.selectedCategory].subCategoryList, this.selectedCategory, 'sub-category');
      }
    } else {
      // remove
      this.removeValuesFromExcel('sub-category', catIndex);
    }
  }

  removeValuesFromExcel(whichList, catIndex) {
    console.log(catIndex);

    switch (whichList) {
      case 'sub-category':
        this.arrayOfExcelData[catIndex].subCatList = [];
        this.arrayOfExcelData[catIndex].schemeList = [];
        this.arrayOfExcelData[catIndex].applicantList = [];
        break;
      case 'schemes':
        this.arrayOfExcelData[catIndex].schemeList = [];
        this.arrayOfExcelData[catIndex].applicantList = [];
        break;
      case 'applicant':
        this.arrayOfExcelData[catIndex].applicantList = [];
        break;
    }
  }

  getFileResponseDataForSubSchemeName(data) {
    this.isLoading = false;
    this.showLoader = false;
    console.log("scheme Name:::", data);
    if (data) {
      this.category = data.categories;
      this.totalAumForSubSchemeName = data.totalAum;
      // excel init
      this.excelInitOfCategories();
    }

    // this.excelSheetInitialization();
    this.category.forEach(o => {
      o.showCategory = true;
      this.totalCurrentValue += o.totalAum;
      this.totalWeight += o.weightInPercentage;
      this.subCategoryList.push(o.subCategoryList);

      o.subCategoryList.forEach(sub => {
        sub.showSubCategory = true;
      })
    });

  }
  showSchemeName(index, subcatshowSubcat, catIndex) {
    this.selectedSubCategory = index;
    subcatshowSubcat.showSubCategory = !subcatshowSubcat.showSubCategory
    subcatshowSubcat.schemes.forEach(element => {
      element.showScheme = true;
    });
    if (!subcatshowSubcat.showSubCategory) {
      this.appendingOfValuesInExcel(this.category[this.selectedCategory].subCategoryList[this.selectedSubCategory].schemes, this.selectedCategory, 'schemes');
    } else {
      this.removeValuesFromExcel('schemes', catIndex);
    }
  }
  showApplicantName(index, schemeData, catIndex) {
    this.selectedClientIndex = index;
    schemeData.showScheme = !schemeData.showScheme
    if (!schemeData.showScheme) {
      this.appendingOfValuesInExcel(this.category[this.selectedCategory].subCategoryList[this.selectedSubCategory].schemes[this.selectedClientIndex].clientList, this.selectedCategory, 'applicant');
    } else {
      this.removeValuesFromExcel('applicant', catIndex);
    }
    // this.category[this.selectedCategory].subCategoryList[index].showSubCategory = (subcashowSubcat) ? subcashowSubcat = false : subcashowSubcat = true;
  }
  aumReport() {
    this.changedValue.emit(true);
  }
  getFilerrorResponse(err) {
    this.isLoading=false;
    this.dataService.openSnackBar(err, 'Dismiss')
  }

  // subCategoryWiseExcelSheet() {
  //   let headerData = [
  //     { width: 20, key: 'Sr.No.' },
  //     { width: 50, key: 'Sub Category Name' },
  //     { width: 30, key: 'Current Value' },
  //     { width: 30, key: '% Weight' }
  //   ];
  //   let header = [
  //     'Sr.No.',
  //     'Sub Category Name',
  //     'Current Value',
  //     '% Weight',
  //   ];
  //   let dataValue;
  //   let excelData = [];
  //   let footer = [];
  //   let footerValue = [];

  //   this.category.forEach((element, index) => {
  //     if (element.subCategoryList.length !== 0) {
  //       dataValue = [
  //         index + 1,
  //         element.subCategoryList[index].name,
  //         element.totalAum,
  //         element.weightInPercentage
  //       ];
  //       excelData.push(Object.assign(dataValue));
  //     }
  //   });

  //   footer = ['', 'Total', this.totalAumForSubSchemeName, ''];
  //   footerValue.push(Object.assign(footer));
  //   ExcelMisService.exportExcel(headerData, header, excelData, footerValue, 'category-wise-excel');
  //   // excelData: any, footer: any[], metaData: any
  // }

  excelInitOfCategories() {
    let dataValue = {};

    this.category.forEach((element, index1) => {
      dataValue = {
        index: index1 + 1,
        categoryName: element.name,
        totalAum: element.totalAum,
        weightInPerc: element.weightInPercentage,
        subCatList: [],
        schemeList: [],
        applicantList: []
      };
      this.arrayOfExcelData.push(dataValue);
    });
  }

  // excelInitOfClients() {
  //   let dataValue = [];
  //   this.category.forEach(element => {
  //     if (element.hasOwnProperty('subCategoryList') && element.subCategoryList.length !== 0) {
  //       element.subCategoryList.forEach(element => {
  //         if (element.hasOwnProperty('schemes') && element.schemes.length !== 0) {
  //           element.schemes.forEach(element => {
  //             if (element.hasOwnProperty('clientList') && element.clientList.length !== 0) {
  //               element.clientList.forEach((element, index4) => {
  //                 dataValue = [
  //                   index4 + 1,
  //                   element.name,
  //                   element.balanceUnit,
  //                   element.folioNumber,
  //                   element.totalAum,
  //                   element.weightInPercentage
  //                 ];
  //                 this.arrayOfExcelData[3].push(Object.assign(dataValue));
  //               });
  //             }
  //           });
  //         }
  //       });
  //     }
  //   });
  // }

  // excelInitOfSchemes() {
  //   let dataValue = [];
  //   this.category.forEach(element => {
  //     if (element.hasOwnProperty('subCategoryList') && element.subCategoryList.length !== 0) {
  //       element.subCategoryList.forEach(element => {
  //         if (element.hasOwnProperty('schemes') && element.schemes.length !== 0) {
  //           element.schemes.forEach((element, index) => {
  //             dataValue = [
  //               index + 1,
  //               element.schemeName,
  //               element.totalAum,
  //               element.weightInPercentage
  //             ];
  //             this.arrayOfExcelData[2].push(Object.assign(dataValue));
  //           });
  //         }
  //       });
  //     }
  //   });
  // }

  // excelInitOfSubCategories() {
  //   // let dataValue = [];
  //   // this.category.forEach(element => {
  //   //   if (element.hasOwnProperty('subCategoryList') && element.subCategoryList.length !== 0) {
  //   //     element.subCategoryList.forEach((element, index2) => {
  //   //       dataValue = [
  //   //         index2 + 1,
  //   //         element.name,
  //   //         element.totalAum,
  //   //         element.weightInPercentage
  //   //       ];
  //   //       this.arrayOfExcelData[1].push(Object.assign(dataValue));
  //   //     });
  //   //   }
  //   // });

  //   this.arrayOfExcelData[1] = [];
  // }

  appendingOfValuesInExcel(iterable, index, choice) {
    console.log(iterable, index, choice);
    switch (choice) {
      case 'sub-category':
        // categories
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].subCatList.push({
            index: index1 + 1,
            name: element.name,
            totalAum: element.totalAum,
            weightInPerc: element.weightInPercentage
          });
        });
        break;
      case 'schemes':
        // sub categories
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].schemeList.push({
            index: index1 + 1,
            name: element.schemeName,
            totalAum: element.totalAum,
            weightInPerc: element.weightInPercentage
          });
        });
        break;
      case 'applicant':
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].applicantList.push({
            name: element.name,
            balanceUnit: element.balanceUnit,
            folioNumber: element.folioNumber,
            totalAum: element.totalAum,
            weightInPerc: element.weightInPercentage
          });
        });
        break;
    }
    console.log(this.arrayOfExcelData);
  }

  // excelSheetInitialization() {
  //   let dataValue = [];
  //   this.arrayOfExcelData[0] = [];
  //   this.arrayOfExcelData[1] = [];
  //   this.arrayOfExcelData[2] = [];
  //   this.arrayOfExcelData[3] = [];
  //   this.category.forEach((element, index1) => {
  //     dataValue = [
  //       index1 + 1,
  //       element.name,
  //       element.totalAum,
  //       element.weightInPercentage
  //     ];
  //     this.arrayOfExcelData[0].push(Object.assign(dataValue));
  //     if (element.hasOwnProperty('subCategoryList') && element.subCategoryList.length !== 0) {
  //       console.log("this is something i need 2");
  //       element.subCategoryList.forEach((element, index2) => {
  //         dataValue = [
  //           index2 + 1,
  //           element.name,
  //           element.totalAum,
  //           element.weightInPercentage
  //         ];
  //         this.arrayOfExcelData[1].push(Object.assign(dataValue));

  //         if (element.hasOwnProperty('schemes') && element.schemes.length !== 0) {
  //           element.schemes.forEach((element, index3) => {
  //             dataValue = [
  //               index3 + 1,
  //               element.schemeName,
  //               element.totalAum,
  //               element.weightInPercentage
  //             ];
  //             this.arrayOfExcelData[2].push(Object.assign(dataValue));

  //             if (element.hasOwnProperty('clientList') && element.clientList.length !== 0) {
  //               element.clientList.forEach((element, index4) => {
  //                 dataValue = [
  //                   index4 + 1,
  //                   element.clientName,
  //                   element.balanceUnit,
  //                   element.folio,
  //                   element.currentAmount,
  //                   element.weightInPercentage
  //                 ];
  //                 this.arrayOfExcelData[3].push(Object.assign(dataValue));
  //               });
  //             }
  //           });
  //         }
  //       });
  //     }
  //   });
  // }

  categoryWiseExcelSheet() {
    console.log(this.arrayOfExcelData);
    ExcelMisService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, this.arrayOfExcelData, 'Category wise MIS Report', 'category-wise-aum-mis');
  }

  subCategoryWiseExcelSheet() {
    let footer = [];
    footer = ['', 'Total', this.totalAumForSubSchemeName, ''];
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[1], this.arrayOfHeaders[1], this.arrayOfExcelData[this.selectedCategory].subCatList, footer, 'Sub Category Wise MIS Report');
  }

  applicantWiseExcelSheet() {
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[3], this.arrayOfHeaders[3], this.arrayOfExcelData[this.selectedCategory].applicantList, [], 'Applicant Wise MIS Report');
  }

  exportToExcelReport(choice) {
    switch (choice) {
      case 'category':
        this.categoryWiseExcelSheet();
        break;
      case 'sub-category':
        this.subCategoryWiseExcelSheet();
        break;
      case 'applicant-wise':
        this.applicantWiseExcelSheet();
        break;
    }
  }
}