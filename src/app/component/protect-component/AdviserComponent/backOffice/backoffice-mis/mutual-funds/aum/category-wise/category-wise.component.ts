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
  arrayOfExcelData: any[][] = [];
  @Output() changedValue = new EventEmitter();

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

  showSubTableList(index, category) {
    this.selectedCategory = index;
    category.showCategory = !category.showCategory;
    console.log("need to check this::", this.category[index]);
    // console.log(category);
    if (!category.showCategory) {
      if (this.category[index].hasOwnProperty('subCategoryList') && this.category[index].subCategoryList.length !== 0) {
        this.arrayOfExcelData[1] = [];
        this.appendingOfValuesInExcel(this.category[index].subCategoryList, 1);
      }
    } else {
      // remove
      this.removeValuesFromExcel(1);
    }
  }

  removeValuesFromExcel(choice) {
    this.arrayOfExcelData[choice].splice(0, 1);
  }

  getFileResponseDataForSubSchemeName(data) {
    this.showLoader = false;
    console.log("scheme Name:::", data);
    if (data) {
      this.category = data.categories;
      this.totalAumForSubSchemeName = data.totalAum;
      // excel init
      this.arrayOfExcelData[0] = [];
      this.excelInitOfCategories();
    }

    // this.excelSheetInitialization();
    this.category.forEach(o => {
      o.showCategory = true;
      this.subCategoryList.push(o.subCategoryList);

      o.subCategoryList.forEach(sub => {
        sub.showSubCategory = true;
      })
    });

  }
  showSchemeName(index, subcatshowSubcat) {
    subcatshowSubcat.showSubCategory = !subcatshowSubcat.showSubCategory
    subcatshowSubcat.schemes.forEach(element => {
      element.showScheme = true;
    });
    if (!subcatshowSubcat.showSubCategory) {
      this.arrayOfExcelData[2] = [];

      // this.arrayOfExcelData[3] = [];
      this.appendingOfValuesInExcel(this.category[this.selectedCategory].subCategoryList, 2);
    } else {
      this.removeValuesFromExcel(2);
    }
  }
  showApplicantName(index, schemeData) {
    schemeData.showScheme = !schemeData.showScheme


    // this.category[this.selectedCategory].subCategoryList[index].showSubCategory = (subcashowSubcat) ? subcashowSubcat = false : subcashowSubcat = true;
  }
  aumReport() {
    this.changedValue.emit(true);
  }
  getFilerrorResponse(err) {
    this.showLoader = false;
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
    let dataValue = [];

    this.category.forEach((element, index1) => {
      dataValue = [
        index1 + 1,
        element.name,
        element.totalAum,
        element.weightInPercentage
      ];
      this.arrayOfExcelData[0].push(Object.assign(dataValue));
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

  appendingOfValuesInExcel(iterable, choice) {
    switch (choice) {
      case 0:
        // categories
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[0].push(Object.assign([
            index1,
            element.name,
            element.totalAum,
            element.weightInPercentage
          ]));
        });
        break;
      case 1:
        // sub categories
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[1].push(Object.assign([
            index1,
            element.name,
            element.totalAum,
            element.weightInPercentage
          ]));
        });
        break;
      case 2:
        // scheme
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[3].push(Object.assign([
            index1,
            element.schemeName,
            element.totalAum,
            element.weightInPercentage
          ]));
        });
        break;
      case 3:
        // applicant
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[4].push(Object.assign([
            index1,
            element.clientName,
            element.balanceUnit,
            element.folio,
            element.currentAmount,
            element.weightInPercentage
          ]));
        });
        break;
    }
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
    ExcelMisService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, this.arrayOfExcelData, 'selectedScheme', 'Category Wise MIS Report');
  }

  subCategoryWiseExcelSheet() {
    let footer = [];
    footer = ['', 'Total', this.totalAumForSubSchemeName, ''];
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[1], this.arrayOfHeaders[1], this.arrayOfExcelData[1], footer, 'Sub Category Wise MIS Report');
  }

  applicantWiseExcelSheet() {
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[3], this.arrayOfHeaders[3], this.arrayOfExcelData[3], [], 'Applicant Wise MIS Report');
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