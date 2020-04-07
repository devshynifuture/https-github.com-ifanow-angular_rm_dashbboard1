import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AumComponent } from '../aum.component';
import { BackOfficeService } from '../../../../back-office.service';
import { AuthService } from 'src/app/auth-service/authService';
import { ExcelMisService } from '../excel-mis.service';

@Component({
  selector: 'app-applicant-wise',
  templateUrl: './applicant-wise.component.html',
  styleUrls: ['./applicant-wise.component.scss']
})
export class ApplicantWiseComponent implements OnInit {
  advisorId: any;
  clientId: any;
  totalCurrentValue = 0;
  totalWeight = 0;
  subCategoryList: any;
  categoryList: any;
  schemeList: any;
  isLoading=false;
  propertyName: any;
  reverse=true;
  @Output() changedValue = new EventEmitter();
  selectedApplicant: any;

  constructor(public aum: AumComponent, private backoffice: BackOfficeService) { }
  applicantName;
  showLoader = true;
  teamMemberId = 2929;
  arrayOfExcelData: any[] = [];
  arrayOfHeaders: any[][] = [
    [
      'Sr. No.',
      'Applicant Name',
      'Current Value',
      '% Weight'
    ],
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
      'Folio',
      'Current Value',
      '% Weight',
    ],
    [
      'Sr. No.',
      'Scheme Name',
      'Folio Number',
      'Current Value',
      'Balance Unit',
      '% Weight',
    ]
  ];
  arrayOfHeaderStyles: any[][] = [
    [
      { width: 10, key: 'Sr. No.' },
      { width: 50, key: 'Applicant Name' },
      { width: 30, key: 'Current Value' },
      { width: 10, key: '% Weight' }
    ],
    [
      { width: 10, key: 'Sr. No.' },
      { width: 50, key: 'Category Name' },
      { width: 30, key: 'Current Value' },
      { width: 10, key: '% Weight' }
    ],
    [
      { width: 10, key: 'Sr. No.' },
      { width: 50, key: 'Sub Category Name' },
      { width: 30, key: 'Current Name' },
      { width: 10, key: '% Weight' }
    ],
    [
      { width: 10, key: 'Sr. No.' },
      { width: 30, key: 'Scheme Name' },
      { width: 30, key: 'Folio' },
      { width: 30, key: 'Current Value' },
      { width: 10, key: '% Weight' },
    ],
    [
      { width: 10, key: 'Sr. No.' },
      { width: 30, key: 'Scheme Name' },
      { width: 30, key: 'Folio Number' },
      { width: 30, key: 'Current Value' },
      { width: 30, key: 'Balance Unit' },
      { width: 10, key: '% Weight' },
    ]
  ];

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.aumApplicantWiseTotalaumApplicantNameGet();
  }
  sortBy(applicant,propertyName){
    this.propertyName = propertyName;
    this.reverse = (propertyName !== null && this.propertyName === propertyName) ? !this.reverse : false;
    if (this.reverse === false){
      applicant=applicant.sort((a, b) => a[propertyName] > b[propertyName] ? 1 : -1);
    }else{
      applicant=applicant.reverse();
    }
  }
  aumApplicantWiseTotalaumApplicantNameGet() {
    this.isLoading=true;
    this.applicantName=[{},{},{}]
    const obj = {
      advisorId: this.advisorId,
      arnRiaDetailsId: -1,
      parentId: -1
    }
    this.backoffice.getAumApplicantWiseTotalaumApplicantName(obj).subscribe(
      data => this.applicantNameGet(data),
      err => {
        this.isLoading = false;
      }
    )
  }

  applicantWiseExcelSheet() {
    ExcelMisService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, this.arrayOfExcelData, 'Applicant wise MIS Report', 'applicant-wise-aum-mis')
  }

  categoryWiseExcelSheet() {
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[1], this.arrayOfHeaders[1], this.arrayOfExcelData[this.selectedApplicant].categoryList, [], 'applicant-wise-aum-mis');
  }

  subCategoryWiseExcelSheet() {
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[2], this.arrayOfHeaders[2], this.arrayOfExcelData[this.selectedApplicant].subCategoryList, [], 'applicant-wise-aum-mis');
  }

  subCatSchemeWiseExcelSheet() {
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[3], this.arrayOfHeaders[3], this.arrayOfExcelData[this.selectedApplicant].schemeList, [], 'applicant-wise-aum-mis');
  }

  schemeWiseExcelSheet() {
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[4], this.arrayOfHeaders[4], this.arrayOfExcelData[this.selectedApplicant].schemeFolioList, [], 'applicant-wise-aum-mis');
  }

  exportToExcelSheet(choice) {
    switch (choice) {
      case 'applicant-wise':
        this.applicantWiseExcelSheet();
        break;
      case 'category-wise':
        this.categoryWiseExcelSheet();
        break;
      case 'sub-category-wise':
        this.subCategoryWiseExcelSheet();
        break;
      case 'sub-cat-scheme-wise':
        this.subCatSchemeWiseExcelSheet();
        break;
      case 'scheme-wise':
        this.schemeWiseExcelSheet();
        break;
    }
  }

  // initializeExcelSheet() {
  //   let dataValue = [];
  //   this.arrayOfExcelData[0] = [];
  //   this.arrayOfExcelData[1] = [];
  //   this.arrayOfExcelData[2] = [];
  //   this.arrayOfExcelData[3] = [];
  //   this.arrayOfExcelData[4] = [];
  //   this.applicantName.forEach((element, index1) => {
  //     dataValue = [
  //       index1 + 1,
  //       element.name,
  //       element.totalAum,
  //       element.weightInPercentage
  //     ];
  //     this.arrayOfExcelData[0].push(Object.assign(dataValue));
  //   });

  //   this.categoryList.forEach((element, index2) => {
  //     dataValue = [
  //       index2 + 1,
  //       element.name,
  //       element.totalAum,
  //       element.weightInPercentage
  //     ]
  //     this.arrayOfExcelData[1].push(Object.assign(dataValue))
  //   });

  //   this.subCategoryList.forEach((element, index3) => {
  //     dataValue = [
  //       index3 + 1,
  //       element.name,
  //       element.totalAum,
  //       element.weightInPercentage
  //     ];
  //     this.arrayOfExcelData[2].push(Object.assign(dataValue));
  //     if (element.hasOwnProperty('schemes') && element.schemes) {
  //       if (element.schemes.length !== 0) {
  //         element.schemes.forEach((element, index4) => {
  //           dataValue = [
  //             index3 + 1,
  //             element.schemeName,
  //             element.folio,
  //             element.totalAum,
  //             element.weightInPercentage
  //           ];
  //           this.arrayOfExcelData[3].push(Object.assign(dataValue));
  //         });
  //       }
  //     }
  //   });

  //   this.schemeList.forEach((element, index5) => {
  //     dataValue = [
  //       index5 + 1,
  //       element.schemeName,
  //       element.folioNumber,
  //       element.totalAum,
  //       element.balanceUnit,
  //       element.weightInPercentage
  //     ];

  //     this.arrayOfExcelData[4].push(Object.assign(dataValue));
  //   });
  // }

  excelInitApplicant() {
    this.applicantName.forEach((element, index1) => {
      this.arrayOfExcelData.push({
        index: index1 + 1,
        name: element.name,
        totalAum: element.totalAum,
        weightInperc: element.weightInPercentage,
        categoryList: [],
        subCategoryList: [],
        schemeList: [],
        schemeFolioList: []
      });
    });
  }

  appendingOfValuesInExcel(iterable, index, choice) {
    console.log(iterable, index, choice);
    switch (choice) {
      case 'category':
        // categories
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].categoryList.push({
            index: index1 + 1,
            name: element.name,
            totalAum: element.totalAum,
            weightInPerc: element.weightInPercentage
          });
        });
        break;
      case 'sub-category':
        // sub categories
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].subCategoryList.push({
            index: index1 + 1,
            name: element.name,
            totalAum: element.totalAum,
            weightInPerc: element.weightInPercentage
          });
        });
        break;
      case 'schemes':
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].schemeList.push({
            index: index1 + 1,
            name: element.schemeName,
            folioNumber: element.folioNumber,
            totalAum: element.totalAum,
            weightInPerc: element.weightInPercentage
          });
        });
        break;
      case 'scheme-folio':
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].schemeFolioList.push({
            index: index1 + 1,
            name: element.schemeName,
            folioNumber: element.folioNumber,
            totalAum: element.totalAum,
            balanceUnit: element.balanceUnit,
            weightInPerc: element.weightInPercentage
          });
        });
        break;
    }
    console.log(this.arrayOfExcelData);
  }

  removeValuesFromExcel(whichList, applicantIndex) {
    console.log(applicantIndex);

    switch (whichList) {
      case 'category':
        this.arrayOfExcelData[applicantIndex].categoryList = [];
        this.arrayOfExcelData[applicantIndex].subCategoryList = [];
        this.arrayOfExcelData[applicantIndex].schemeList = [];
        this.arrayOfExcelData[applicantIndex].schemeFolioList = [];
        break;
      case 'sub-category':
        this.arrayOfExcelData[applicantIndex].subCategoryList = [];
        this.arrayOfExcelData[applicantIndex].schemeList = [];
        this.arrayOfExcelData[applicantIndex].schemeFolioList = [];
        break;
      case 'schemes':
        this.arrayOfExcelData[applicantIndex].schemeList = [];
        this.arrayOfExcelData[applicantIndex].schemeFolioList = [];
        break;
      case 'scheme-folio':
        this.arrayOfExcelData[applicantIndex].schemeFolioList = [];
        break;
    }
  }

  applicantNameGet(data) {
    this.isLoading=false;
    this.applicantName = data;
    if (this.applicantName) {
      this.excelInitApplicant();
      this.applicantName.forEach(o => {
        o.show = true;
        this.totalCurrentValue += o.totalAum;
        this.totalWeight += o.weightInPercentage;
      });
    }
    this.showLoader = false;
  }


  category(applicantData, index) {
    this.selectedApplicant = index;
    applicantData.show = !applicantData.show
    applicantData.categoryList = []
    if (applicantData.show == false) {
      const obj = {
        advisorId: this.advisorId,
        arnRiaDetailsId: -1,
        parentId: -1,
        familyMembertId: applicantData.id,
        clientTotalAum: applicantData.totalAum
      }
      this.backoffice.getAumApplicantCategory(obj).subscribe(
        data => {
          if (data) {
            data.forEach(element => {
              element.showCategory = true;
              element.familyMemberId = applicantData.id
            });
            applicantData.categoryList = data
            console.log(data);
            this.categoryList = data;
            this.appendingOfValuesInExcel(data, this.selectedApplicant, 'category');
          }
        }
      )
    } else {
      this.removeValuesFromExcel('category', index);
    }
  }
  sortCategoryApplicant(data, show, applicantData) {
    console.log("fasdfkasdf", data);
    applicantData.category = data;
    applicantData.show = (show) ? show = false : show = true;

  }
  subCategory(catData, applicantIndex) {
    this.selectedApplicant = applicantIndex;
    catData.showCategory = !catData.showCategory
    catData.subCatList = []
    if (catData.showCategory == false) {
      const obj = {
        advisorId: this.advisorId,
        arnRiaDetailsId: -1,
        parentId: -1,
        familyMembertId: catData.familyMemberId,
        categoryId: catData.id,
        categoryTotalAum: catData.totalAum
      }
      this.backoffice.getAumApplicantSubCategory(obj).subscribe(
        data => {
          if (data) {
            data.forEach(element => {
              element.showSubCategory=true;
              element.familyMemberId=catData.familyMemberId;;
            });
            catData.subCatList = data;
            console.log(data);
            this.subCategoryList = data;
            this.appendingOfValuesInExcel(data, this.selectedApplicant, 'sub-category');
          }
        }
      )
    } else {
      this.removeValuesFromExcel('sub-category', applicantIndex);
    }
  }

  getResponseSubCategoryData(data, category, showCategory) {
    console.log(data);
    category.showCategory = (showCategory) ? showCategory = false : showCategory = true;
    category.subCategoryList = data;
  }
  getScheme(subCatData, applicantIndex) {
    this.selectedApplicant = applicantIndex;
    subCatData.showSubCategory = !subCatData.showSubCategory
    subCatData.schemeList = []
    if (subCatData.showSubCategory == false) {
      const obj = {
        advisorId: this.advisorId,
        arnRiaDetailsId: -1,
        parentId: -1,
        familyMembertId: subCatData.familyMemberId,
        subCategoryId: subCatData.id,
        subCategoryTotalAum: subCatData.totalAum
      }
      this.backoffice.getAumApplicantScheme(obj).subscribe(
        data => {
          if (data) {
            data.forEach(element => {
              element.showFolio=true;
            });
            subCatData.schemeList = data
            console.log(data);
            this.schemeList = data;
            this.appendingOfValuesInExcel(data, this.selectedApplicant, 'schemes');
          }
        }
      )
    } else {
      this.removeValuesFromExcel('schemes', applicantIndex);
    }
  }
  getSchemeFolio(schemeData, applicantIndex) {
    this.selectedApplicant = applicantIndex;

    schemeData.showFolio = !schemeData.showFolio;
    // console.log(schemeData, this.schemeList);
    //  need to check
    if (schemeData.showFolio === false) {
      this.appendingOfValuesInExcel(this.schemeList, this.selectedApplicant, 'scheme-folio');
    } else {
      this.removeValuesFromExcel('scheme-folio', applicantIndex);
    }
  }
  getResponseSchemeData(data, subCat) {
    subCat.schemes = data;
    subCat.showSubCategory = (subCat.showSubCategory) ? subCat.showSubCategory = false : subCat.showSubCategory = true;
  }
  aumReport() {
    this.changedValue.emit(true);
  }

}
