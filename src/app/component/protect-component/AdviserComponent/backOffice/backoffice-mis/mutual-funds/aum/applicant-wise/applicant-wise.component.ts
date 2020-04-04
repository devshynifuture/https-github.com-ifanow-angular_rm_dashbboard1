import { Component, OnInit } from '@angular/core';
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

  constructor(public aum: AumComponent, private backoffice: BackOfficeService) { }
  applicantName;
  showLoader = true;
  teamMemberId = 2929;
  arrayOfExcelData: any[][] = [];
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
  aumApplicantWiseTotalaumApplicantNameGet() {
    const obj = {
      advisorId: this.advisorId,
      arnRiaDetailsId: -1,
      parentId: -1
    }
    this.backoffice.getAumApplicantWiseTotalaumApplicantName(obj).subscribe(
      data => this.applicantNameGet(data),
      err => {
        this.showLoader = false;
      }
    )
  }

  applicantWiseExcelSheet() {
    ExcelMisService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, this.arrayOfExcelData, 'selected value', 'Applicant wise')
  }

  categoryWiseExcelSheet() {
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[1], this.arrayOfHeaders[1], this.arrayOfExcelData[1], [], 'Category wise');
  }

  subCategoryWiseExcelSheet() {
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[2], this.arrayOfHeaders[2], this.arrayOfExcelData[2], [], 'Sub Category wise');
  }

  subCatSchemeWiseExcelSheet() {
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[3], this.arrayOfHeaders[3], this.arrayOfExcelData[3], [], 'SubCategory Scheme wise');
  }

  schemeWiseExcelSheet() {
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[4], this.arrayOfHeaders[4], this.arrayOfExcelData[4], [], 'Scheme wise');
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

  initializeExcelSheet() {
    let dataValue = [];
    this.arrayOfExcelData[0] = [];
    this.arrayOfExcelData[1] = [];
    this.arrayOfExcelData[2] = [];
    this.arrayOfExcelData[3] = [];
    this.arrayOfExcelData[4] = [];
    this.applicantName.forEach((element, index1) => {
      dataValue = [
        index1 + 1,
        element.name,
        element.totalAum,
        element.weightInPercentage
      ];
      this.arrayOfExcelData[0].push(Object.assign(dataValue));
    });

    this.categoryList.forEach((element, index2) => {
      dataValue = [
        index2 + 1,
        element.name,
        element.totalAum,
        element.weightInPercentage
      ]
      this.arrayOfExcelData[1].push(Object.assign(dataValue))
    });

    this.subCategoryList.forEach((element, index3) => {
      dataValue = [
        index3 + 1,
        element.name,
        element.totalAum,
        element.weightInPercentage
      ];
      this.arrayOfExcelData[2].push(Object.assign(dataValue));
      if (element.hasOwnProperty('schemes') && element.schemes) {
        if (element.schemes.length !== 0) {
          element.schemes.forEach((element, index4) => {
            dataValue = [
              index3 + 1,
              element.schemeName,
              element.folio,
              element.totalAum,
              element.weightInPercentage
            ];
            this.arrayOfExcelData[3].push(Object.assign(dataValue));
          });
        }
      }
    });

    this.schemeList.forEach((element, index5) => {
      dataValue = [
        index5 + 1,
        element.schemeName,
        element.folioNumber,
        element.totalAum,
        element.balanceUnit,
        element.weightInPercentage
      ];

      this.arrayOfExcelData[4].push(Object.assign(dataValue));
    });
  }

  applicantNameGet(data) {
    this.applicantName = data;
    // this.initializeExcelSheet();
    console.log("this is data that we need", data);
    this.applicantName.forEach(o => {
      o.show = true;
      this.totalCurrentValue += o.totalAum;
      this.totalWeight += o.weightInPercentage;
    });
    this.showLoader = false;
  }

  category(applicantData) {
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
            data[0].showCategory = true;
            data[0].familyMemberId = applicantData.id
            applicantData.categoryList = data
            console.log(data);
            this.categoryList = data;
          }
        }
      )
    }
  }
  sortCategoryApplicant(data, show, applicantData) {
    console.log("fasdfkasdf", data);
    applicantData.category = data;
    applicantData.show = (show) ? show = false : show = true;

  }
  subCategory(catData) {
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
            data[0].showSubCategory = true;
            data[0].familyMemberId = catData.familyMemberId;
            catData.subCatList = data;
            console.log(data);
            this.subCategoryList = data;
          }
        }
      )
    }
  }

  getResponseSubCategoryData(data, category, showCategory) {
    console.log(data);
    category.showCategory = (showCategory) ? showCategory = false : showCategory = true;
    category.subCategoryList = data;
  }
  getScheme(subCatData) {
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
            data[0].showFolio = true
            subCatData.schemeList = data
            console.log(data);
            this.schemeList = data;
            this.initializeExcelSheet();
          }
        }
      )
    }
  }
  getSchemeFolio(schemeData) {
    schemeData.showFolio = !schemeData.showFolio

  }
  getResponseSchemeData(data, subCat) {
    subCat.schemes = data;
    subCat.showSubCategory = (subCat.showSubCategory) ? subCat.showSubCategory = false : subCat.showSubCategory = true;
  }
  aumReport() {
    this.aum.aumComponent = true;
  }

}
