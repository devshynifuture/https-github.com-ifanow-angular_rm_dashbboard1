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
  isLoading = false;
  @Output() changedValue = new EventEmitter();
  selectedApplicant: any;
  selectedScheme: any;
  selectedFolio: any;
  selectedClient: any;
  selectedCat: any;

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
  aumApplicantWiseTotalaumApplicantNameGet() {
    this.isLoading = true;
    this.applicantName = [{}, {}, {}]
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
    ExcelMisService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, this.arrayOfExcelData, 'Applicant wise MIS Report', 'applicant-wise-aum-mis', {
      applicantList: false,
      categoryList: false,
      suCategoryList: false,
      schemeList: false,
      schemeFolioList: false
    })
  }

  categoryWiseExcelSheet(applicantIndex) {
    let copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));

    copyOfExcelData.forEach((element, index1) => {
      if (index1 === applicantIndex) {
        return;
      } else {
        element.categoryList = [];
      }
    });
    ExcelMisService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, copyOfExcelData, 'Applicant wise MIS Report', 'applicant-wise-aum-mis', {
      applicantList: true,
      categoryList: false,
      subCategoryList: false,
      schemeList: false,
      schemeFolioList: false
    });
  }

  subCategoryWiseExcelSheet(index) {
    let copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));

    copyOfExcelData.forEach((element, index1) => {
      if (index1 === index) {
        return;
      } else {
        if (element.hasOwnProperty('categoryList') && element.categoryList.length !== 0) {
          element.categoryList.forEach((element, index2) => {
            element.subCategoryList = [];
          });
        }
      }
    });

    console.log("this is what i sent:::", copyOfExcelData);
    ExcelMisService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, copyOfExcelData, 'Applicant wise MIS Report', 'applicant-wise-aum-mis', {
      applicantList: true,
      categoryList: true,
      subCategoryList: false,
      schemeList: false,
      schemeFolioList: false
    });
  }

  subCatSchemeWiseExcelSheet(index) {
    let copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));

    copyOfExcelData.forEach((element, index1) => {
      if (index1 === index) {
        return;
      } else {
        element.categoryList.forEach((element, index2) => {
          if (element.hasOwnProperty('subCategoryList') && element.subCategoryList.length !== 0) {
            element.subCategoryList.forEach(element => {
              element.schemeList = [];
            });
          }
        });
      }
    });
    console.log("this is what i sent:::", copyOfExcelData);
    ExcelMisService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, copyOfExcelData, 'Applicant wise MIS Report', 'applicant-wise-aum-mis', {
      applicantList: true,
      categoryList: true,
      subCategoryList: true,
      schemeList: false,
      schemeFolioList: false
    });
  }

  schemeWiseExcelSheet() {
    let schemeFolioList = this.arrayOfExcelData[this.selectedApplicant].categoryList[this.selectedCat].subCategoryList[this.selectedScheme].schemeList[this.selectedClient].schemeFolioList;
    let newarr = [];
    schemeFolioList.forEach(element => {
      newarr.push({
        field1: element.index,
        field2: element.name,
        field3: element.folioNumber,
        field4: element.totalAum,
        field5: element.balanceUnit,
        field6: element.weightInPerc
      });
    });
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[4], this.arrayOfHeaders[4], newarr, [], 'applicant-wise-aum-mis');
  }

  exportToExcelSheet(choice, index) {
    switch (choice) {
      case 'applicant-wise':
        this.applicantWiseExcelSheet();
        break;
      case 'category-wise':
        this.categoryWiseExcelSheet(index);
        break;
      case 'sub-category-wise':
        this.subCategoryWiseExcelSheet(index);
        break;
      case 'sub-cat-scheme-wise':
        this.subCatSchemeWiseExcelSheet(index);
        break;
      case 'scheme-wise':
        this.schemeWiseExcelSheet();
        break;
    }
    console.log(this.arrayOfExcelData);
  }

  excelInitApplicant() {
    this.applicantName.forEach((element, index1) => {
      this.arrayOfExcelData.push({
        index: index1 + 1,
        name: element.name,
        totalAum: element.totalAum,
        weightInperc: element.weightInPercentage,
        categoryList: []
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
            weightInPerc: element.weightInPercentage,
            subCategoryList: []
          });
        });
        break;
      case 'sub-category':
        // sub categories
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedApplicant].categoryList[index].subCategoryList.push({
            index: index1 + 1,
            name: element.name,
            totalAum: element.totalAum,
            weightInPerc: element.weightInPercentage,
            schemeList: []
          });
        });
        break;
      case 'schemes':
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedApplicant].categoryList[this.selectedCat]
            .subCategoryList[index].schemeList.push({
              index: index1 + 1,
              name: element.schemeName,
              folioNumber: element.folioNumber,
              totalAum: element.totalAum,
              weightInPerc: element.weightInPercentage,
              schemeFolioList: []
            });
        });
        break;
      case 'scheme-folio':
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedApplicant].categoryList[this.selectedCat]
            .subCategoryList[this.selectedScheme].schemeList[index].schemeFolioList.push({
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

  removeValuesFromExcel(whichList, index) {

    switch (whichList) {
      case 'category':
        this.arrayOfExcelData[index].categoryList = [];
        break;
      case 'sub-category':
        this.arrayOfExcelData[this.selectedApplicant].categoryList[index].subCategoryList = [];
        break;
      case 'schemes':
        this.arrayOfExcelData[this.selectedApplicant].categoryList[this.selectedCat]
          .subCategoryList[index].schemeList = [];
        break;
      case 'scheme-folio':
        this.arrayOfExcelData[this.selectedApplicant].categoryList[this.selectedCat]
          .subCategoryList[this.selectedScheme].schemeList[index].schemeFolioList = [];
        break;
    }
    console.log(this.arrayOfExcelData);
  }

  applicantNameGet(data) {
    this.isLoading = false;
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
            data[0].showCategory = true;
            data[0].familyMemberId = applicantData.id
            applicantData.categoryList = data
            console.log(data);
            this.categoryList = data;
            this.appendingOfValuesInExcel(data, index, 'category');
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
  subCategory(catData, index, applicantIndex) {
    console.log(applicantIndex);


    this.selectedCat = index;
    this.selectedApplicant = applicantIndex;
    catData.showCategory = !catData.showCategory
    catData.subCatList = [];

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
            this.appendingOfValuesInExcel(data, index, 'sub-category');
          }
        }
      )
    } else {
      this.removeValuesFromExcel('sub-category', index);
    }
  }

  getResponseSubCategoryData(data, category, showCategory) {
    console.log(data);
    category.showCategory = (showCategory) ? showCategory = false : showCategory = true;
    category.subCategoryList = data;
  }
  getScheme(subCatData, index, catIndex, applicantIndex) {
    console.log(applicantIndex);
    this.selectedScheme = index;
    this.selectedCat = catIndex;
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
            data[0].showFolio = true
            subCatData.schemeList = data
            console.log(data);
            this.schemeList = data;
            this.appendingOfValuesInExcel(data, index, 'schemes');
          }
        }
      )
    } else {
      this.removeValuesFromExcel('schemes', index);
    }
  }
  getSchemeFolio(schemeData, index, schemeIndex, catIndex, applicantIndex) {

    this.selectedApplicant = applicantIndex;
    this.selectedClient = index;
    this.selectedScheme = schemeIndex;
    this.selectedCat = catIndex;


    schemeData.showFolio = !schemeData.showFolio;
    // console.log(schemeData, this.schemeList);
    //  need to check
    if (schemeData.showFolio === false) {
      this.appendingOfValuesInExcel(this.schemeList, index, 'scheme-folio');
    } else {
      this.removeValuesFromExcel('scheme-folio', index);
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
