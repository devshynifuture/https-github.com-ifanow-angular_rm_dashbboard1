import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AumComponent } from '../aum.component';
import { BackOfficeService } from '../../../../back-office.service';
import { AuthService } from 'src/app/auth-service/authService';
import { ExcelMisService } from '../excel-mis.service';
import { MfServiceService } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service';

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
  propertyName: any;
  propertyName2: any;
  propertyName3: any;
  propertyName4: any;
  propertyName5: any;
  reverse = true;
  reverse2 = true;
  reverse3 = true;
  reverse4 = true;
  reverse5 = true;
  @Output() changedValue = new EventEmitter();
  selectedApplicant: any;
  selectedScheme: any;
  selectedFolio: any;
  selectedClient: any;
  selectedCat: any;
  isLoadingCategory: boolean = false;
  categoryListArr: any[];
  isLoadingSubCategory: boolean = false;
  isLoadingScheme: boolean = false;
  schemeListArr: any[];
  @Input() data;
  parentId: any;
  clientIdToPass;
  arnRiaList = [];
  arnRiaValue;

  constructor(public aum: AumComponent, private backoffice: BackOfficeService, private mfService: MfServiceService) { }
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

  applicantWiseTotal = [];
  catWiseTotal = [];
  subCatWiseTotal = [];
  subCatSchemeWiseTotal = [];
  schemeWiseTotal = [];
  viewMode;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.parentId = AuthService.getParentId() ? AuthService.getParentId() : this.advisorId;
    if (this.data.hasOwnProperty('arnRiaValue') && this.data.hasOwnProperty('viewMode')) {
      this.arnRiaValue = this.data.arnRiaValue;
      this.viewMode = this.data.viewMode;
    } else {
      this.viewMode = "All";
      this.arnRiaValue = -1;
    }

    this.getArnRiaList();
    this.aumApplicantWiseTotalaumApplicantNameGet();
  }
  sortBy(applicant, propertyName) {
    this.propertyName = propertyName;
    this.reverse = (propertyName !== null && this.propertyName === propertyName) ? !this.reverse : false;
    if (this.reverse === false) {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName] ? 1 : (a[propertyName] === b[propertyName] ? 0 : -1)
      );
    } else {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName] ? -1 : (a[propertyName] === b[propertyName] ? 0 : 1)
      );
    }
  }
  sortByCat(applicant, propertyName) {
    this.propertyName2 = propertyName;
    this.reverse2 = (propertyName !== null && this.propertyName2 === propertyName) ? !this.reverse2 : false;
    if (this.reverse2 === false) {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName] ? 1 : (a[propertyName] === b[propertyName] ? 0 : -1)
      );
    } else {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName] ? -1 : (a[propertyName] === b[propertyName] ? 0 : 1)
      );
    }
  }
  sortBySubCat(applicant, propertyName) {
    this.propertyName3 = propertyName;
    this.reverse3 = (propertyName !== null && this.propertyName3 === propertyName) ? !this.reverse3 : false;
    if (this.reverse3 === false) {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName] ? 1 : (a[propertyName] === b[propertyName] ? 0 : -1)
      );
    } else {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName] ? -1 : (a[propertyName] === b[propertyName] ? 0 : 1)
      );
    }
  }
  sortByScheme(applicant, propertyName) {
    this.propertyName4 = propertyName;
    this.reverse4 = (propertyName !== null && this.propertyName4 === propertyName) ? !this.reverse4 : false;
    if (this.reverse4 === false) {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName] ? 1 : (a[propertyName] === b[propertyName] ? 0 : -1)
      );
    } else {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName] ? -1 : (a[propertyName] === b[propertyName] ? 0 : 1)
      );
    }
  }
  sortByBalanceUnit(applicant, propertyName) {
    this.propertyName5 = propertyName;
    this.reverse5 = (propertyName !== null && this.propertyName5 === propertyName) ? !this.reverse5 : false;
    if (this.reverse5 === false) {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName] ? 1 : (a[propertyName] === b[propertyName] ? 0 : -1)
      );
    } else {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName] ? -1 : (a[propertyName] === b[propertyName] ? 0 : 1)
      );
    }
  }
  aumApplicantWiseTotalaumApplicantNameGet() {
    this.isLoading = true;
    this.applicantName = [{}, {}, {}]
    const obj = {
      advisorId: (this.parentId) ? 0 : (this.data.arnRiaDetailId != -1) ? 0 : [this.data.adminAdvisorIds],
      arnRiaDetailsId: this.arnRiaValue,
      parentId: (this.data) ? this.data.parentId : -1
    }
    this.backoffice.getAumApplicantWiseTotalaumApplicantName(obj).subscribe(
      data => this.applicantNameGet(data),
      err => {
        this.isLoading = false;
        this.applicantName = [];
      }
    )
  }

  applicantWiseExcelSheet() {
    ExcelMisService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, this.arrayOfExcelData, 'MIS Report - Applicant wise AUM', 'applicant-wise-aum-mis', {
      applicantList: false,
      categoryList: false,
      suCategoryList: false,
      schemeList: false,
      schemeFolioList: false
    }, this.applicantWiseTotal)
  }

  categoryWiseExcelSheet(applicantIndex, catIndex) {
    let copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));

    copyOfExcelData.forEach((element, index1) => {
      if (index1 === applicantIndex) {
        return;
      } else {
        element.categoryList = [];
      }
    });

    let arrayOfExcelHeaders = this.arrayOfHeaders.slice();
    let arrayOfExcelStyles = this.arrayOfHeaderStyles.slice();
    arrayOfExcelHeaders.shift();
    arrayOfExcelStyles.shift();

    ExcelMisService.exportExcel3(arrayOfExcelHeaders, arrayOfExcelStyles, copyOfExcelData[applicantIndex].categoryList, 'MIS Report - Applicant wise AUM', 'applicant-wise-aum-mis', {
      applicantList: true,
      categoryList: false,
      subCategoryList: false,
      schemeList: false,
      schemeFolioList: false
    }, this.catWiseTotal);
  }

  subCategoryWiseExcelSheet(applicantIndex, catIndex, subCatIndex) {
    let copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));

    copyOfExcelData.forEach((element, index1) => {
      if (index1 === applicantIndex) {
        return;
      } else {
        if (element.hasOwnProperty('categoryList') && element.categoryList.length !== 0) {
          element.categoryList.forEach((element, index2) => {
            element.subCategoryList = [];
          });
        }
      }
    });
    let arrayOfExcelHeaders = this.arrayOfHeaders.slice();
    let arrayOfExcelStyles = this.arrayOfHeaderStyles.slice();
    arrayOfExcelHeaders.shift();
    arrayOfExcelHeaders.shift();
    arrayOfExcelStyles.shift();
    arrayOfExcelStyles.shift();

    ExcelMisService.exportExcel4(arrayOfExcelHeaders, arrayOfExcelStyles, copyOfExcelData[applicantIndex].categoryList[catIndex].subCategoryList, 'MIS Report - Applicant wise AUM', 'applicant-wise-aum-mis', {
      applicantList: true,
      categoryList: true,
      subCategoryList: false,
      schemeList: false,
      schemeFolioList: false
    }, this.subCatWiseTotal);
  }

  subCatSchemeWiseExcelSheet(applicantIndex, catIndex, subCatIndex, schemeIndex) {
    let copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));

    copyOfExcelData.forEach((element, index1) => {
      if (index1 === applicantIndex) {
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

    let arrayOfExcelHeaders = this.arrayOfHeaders.slice();
    let arrayOfExcelStyles = this.arrayOfHeaderStyles.slice();
    arrayOfExcelHeaders.shift();
    arrayOfExcelHeaders.shift();
    arrayOfExcelHeaders.shift();
    arrayOfExcelStyles.shift();
    arrayOfExcelStyles.shift();
    arrayOfExcelStyles.shift();

    ExcelMisService.exportExcel5(arrayOfExcelHeaders, arrayOfExcelStyles, copyOfExcelData[applicantIndex].categoryList[catIndex].subCategoryList[subCatIndex].schemeList, 'MIS Report - Applicant wise AUM', 'applicant-wise-aum-mis', {
      applicantList: true,
      categoryList: true,
      subCategoryList: true,
      schemeList: false,
      schemeFolioList: false
    }, this.subCatSchemeWiseTotal);
  }

  schemeWiseExcelSheet() {
    let schemeFolioList = this.arrayOfExcelData[this.selectedApplicant].categoryList[this.selectedCat].subCategoryList[this.selectedScheme].schemeList[this.selectedClient].schemeFolioList;
    let newarr = [];
    schemeFolioList.forEach(element => {
      newarr.push({
        field1: element.index,
        field2: element.name,
        field3: element.folioNumber,
        field4: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
        field5: this.mfService.mutualFundRoundAndFormat(element.balanceUnit, 2),
        field6: element.weightInPerc
      });
    });
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[4], this.arrayOfHeaders[4], newarr, [], 'MIS Report - Applicant wise AUM', this.schemeWiseTotal);
  }

  exportToExcelSheet(choice, applicantIndex, catIndex, subCatIndex, schemeIndex) {
    switch (choice) {
      case 'applicant-wise':
        this.applicantWiseExcelSheet();
        break;
      case 'category-wise':
        this.categoryWiseExcelSheet(applicantIndex, catIndex);
        break;
      case 'sub-category-wise':
        this.subCategoryWiseExcelSheet(applicantIndex, catIndex, subCatIndex);
        break;
      case 'sub-cat-scheme-wise':
        this.subCatSchemeWiseExcelSheet(applicantIndex, catIndex, subCatIndex, schemeIndex);
        break;
      case 'scheme-wise':
        this.schemeWiseExcelSheet();
        break;
    }
  }

  excelInitApplicant() {
    let sumAumTotal = 0;
    let sumWeightInPercTotal = 0;
    this.applicantName.forEach((element, index1) => {
      this.arrayOfExcelData.push({
        index: index1 + 1,
        name: element.name,
        totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
        weightInPerc: element.weightInPercentage,
        categoryList: []
      });
      sumAumTotal = sumAumTotal + element.totalAum;
      sumWeightInPercTotal = sumWeightInPercTotal + element.weightInPercentage;
    });

    this.applicantWiseTotal = ['Total', '', sumAumTotal, sumWeightInPercTotal];
  }

  appendingOfValuesInExcel(iterable, index, choice) {
    let sumAumTotal = 0;
    let sumWeightInPercTotal = 0;

    switch (choice) {
      case 'category':
        // categories
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].categoryList.push({
            index: index1 + 1,
            name: element.name,
            totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
            weightInPerc: element.weightInPercentage,
            subCategoryList: []
          });
          sumAumTotal = sumAumTotal + element.totalAum;
          sumWeightInPercTotal = sumWeightInPercTotal + element.weightInPercentage;
        });
        this.catWiseTotal = ['Total', '', sumAumTotal, sumWeightInPercTotal];
        break;
      case 'sub-category':
        // sub categories
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedApplicant].categoryList[index].subCategoryList.push({
            index: index1 + 1,
            name: element.name,
            totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
            weightInPerc: element.weightInPercentage,
            schemeList: []
          });
          sumAumTotal = sumAumTotal + element.totalAum;
          sumWeightInPercTotal = sumWeightInPercTotal + element.weightInPercentage;
        });
        this.subCatWiseTotal = ['Total', '', sumAumTotal, sumWeightInPercTotal];
        break;
      case 'schemes':
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedApplicant].categoryList[this.selectedCat]
            .subCategoryList[index].schemeList.push({
              index: index1 + 1,
              name: element.schemeName,
              folioNumber: element.folioNumber,
              totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
              weightInPerc: element.weightInPercentage,
              schemeFolioList: []
            });
          sumAumTotal = sumAumTotal + element.totalAum;
          sumWeightInPercTotal = sumWeightInPercTotal + element.weightInPercentage;
        });
        this.subCatSchemeWiseTotal = ['Total', '', '', sumAumTotal, sumWeightInPercTotal];
        break;
      case 'scheme-folio':
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedApplicant].categoryList[this.selectedCat]
            .subCategoryList[this.selectedScheme].schemeList[index].schemeFolioList.push({
              index: index1 + 1,
              name: element.schemeName,
              folioNumber: element.folioNumber,
              totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
              balanceUnit: this.mfService.mutualFundRoundAndFormat(element.balanceUnit, 2),
              weightInPerc: element.weightInPercentage
            });
          sumAumTotal = sumAumTotal + element.totalAum;
          sumWeightInPercTotal = sumWeightInPercTotal + element.weightInPercentage;
        });
        this.schemeWiseTotal = ['Total', '', '', sumAumTotal, '', sumWeightInPercTotal];
        break;
    }
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
  }

  applicantNameGet(data) {
    this.isLoading = false;
    if (data) {
      console.log("here we have client id needed::::::::::", data);
      this.applicantName = data;
      this.excelInitApplicant();
      this.applicantName.forEach(o => {
        o.show = true;
        this.totalCurrentValue += o.totalAum;
        this.totalWeight += o.weightInPercentage;
      });
    } else {
      this.applicantName = [];
    }
    this.showLoader = false;
  }

  getArnRiaList() {
    this.backoffice.getArnRiaList(this.advisorId).subscribe(
      data => {
        if (data) {
          // this.advisorId = 0;
          this.arnRiaList = data;
          const obj = {
            number: 'All',
            id: -1
          }
          this.arnRiaList.unshift(obj);
        } else {
          // this.dataService.openSnackBar("No Arn Ria List Found", "Dismiss")
        }
      }
    )
  }

  changeValueOfArnRia(item) {
    if (item.name !== 'All') {
      this.arnRiaValue = item.id
      this.viewMode = item.number;
    } else {
      this.arnRiaValue = -1;
    }
    this.aumApplicantWiseTotalaumApplicantNameGet();
  }


  category(applicantData, index) {
    this.clientIdToPass = applicantData.clientId;

    this.selectedApplicant = index;
    applicantData.show = !applicantData.show;

    if (applicantData.show == false) {
      this.isLoadingCategory = true;
      applicantData.categoryList = [];
      applicantData.categoryList = [{}, {}, {}];
      this.categoryListArr = [];
      const obj = {
        advisorId: (this.parentId) ? 0 : (this.data.arnRiaDetailId != -1) ? 0 : [this.data.adminAdvisorIds],
        arnRiaDetailsId: this.arnRiaValue,
        parentId: (this.data) ? this.data.parentId : -1,
        familyMembertId: applicantData.id,
        clientTotalAum: applicantData.totalAum,
        clientId: this.clientIdToPass
      }
      this.backoffice.getAumApplicantCategory(obj).subscribe(
        data => {
          this.isLoadingCategory = false;
          if (data) {
            console.log("this is category list data:::", data);
            data.forEach(element => {
              element.showCategory = true;
              element.familyMemberId = applicantData.id
            });
            this.isLoadingCategory = false;
            applicantData.categoryList = data;
            this.categoryListArr = data;
            this.categoryList = data;
            this.appendingOfValuesInExcel(data, index, 'category');
          } else {
            this.categoryListArr = [];
            applicantData.categoryList = [];
            this.isLoadingCategory = false;
          }
        },
        err => {
          this.categoryListArr = [];
          applicantData.categoryList = [];
          this.isLoadingCategory = false;
        }
      );
    } else {
      this.removeValuesFromExcel('category', index);
      if (applicantData.hasOwnProperty('categoryList') && applicantData.categoryList.length !== 0) {
        applicantData.categoryList.forEach(applicantElement => {
          applicantElement.showCategory = true;
          if (applicantElement.hasOwnProperty('subCatList') && applicantElement.subCatList.length !== 0) {
            applicantElement.subCatList.forEach(subCatElement => {
              subCatElement.shoeSubCategory = true;
              if (subCatElement.hasOwnProperty('schemeList') && subCatElement.schemeList.length !== 0) {
                subCatElement.schemeList.forEach(element => {
                  element.showFolio = false;
                  element.showScheme = true;
                });
              }
            });
          }
        });
      }
    }
  }
  sortCategoryApplicant(data, show, applicantData) {
    applicantData.category = data;
    applicantData.show = (show) ? show = false : show = true;

  }
  subCategory(catData, index, applicantIndex) {

    this.selectedCat = index;
    this.selectedApplicant = applicantIndex;
    catData.showCategory = !catData.showCategory

    if (catData.showCategory == false) {
      this.isLoadingSubCategory = true
      catData.subCatList = [];
      catData.subCatList = [{}, {}, {}];
      this.subCategoryList = []
      const obj = {
        advisorId: (this.parentId) ? 0 : (this.data.arnRiaDetailId != -1) ? 0 : [this.data.adminAdvisorIds],
        arnRiaDetailsId: this.arnRiaValue,
        parentId: (this.data) ? this.data.parentId : -1,
        familyMembertId: catData.familyMemberId,
        categoryId: catData.id,
        categoryTotalAum: catData.totalAum,
        clientId: this.clientIdToPass
      }
      this.backoffice.getAumApplicantSubCategory(obj).subscribe(
        data => {
          this.isLoadingSubCategory = false
          if (data) {
            data.forEach(element => {
              element.showSubCategory = true;
              element.familyMemberId = catData.familyMemberId;;
            });
            catData.subCatList = data;
            this.subCategoryList = data
            this.subCategoryList = data;
            this.appendingOfValuesInExcel(data, index, 'sub-category');
          } else {
            this.subCategoryList = []
            catData.subCatList = [];
            this.isLoadingSubCategory = false
          }
        },
        err => {
          this.subCategoryList = []
          catData.subCatList = [];
          this.isLoadingSubCategory = false
        }
      )
    } else {
      this.removeValuesFromExcel('sub-category', index);

      if (catData.hasOwnProperty('subCatList') && catData.subCatList.length !== 0) {
        catData.subCatList.forEach(subCatElement => {
          subCatElement.shoeSubCategory = true;
          if (subCatElement.hasOwnProperty('schemeList') && subCatElement.schemeList.length !== 0) {
            subCatElement.schemeList.forEach(element => {
              element.showFolio = false;
              element.showScheme = true;
            });
          }
        });
      }

    }
  }

  getResponseSubCategoryData(data, category, showCategory) {
    category.showCategory = (showCategory) ? showCategory = false : showCategory = true;
    category.subCategoryList = data;
  }
  getScheme(subCatData, index, catIndex, applicantIndex) {
    this.selectedScheme = index;
    this.selectedCat = catIndex;
    this.selectedApplicant = applicantIndex;

    subCatData.showSubCategory = !subCatData.showSubCategory

    if (subCatData.showSubCategory == false) {
      this.isLoadingScheme = true
      this.schemeListArr = []
      subCatData.schemeList = []
      subCatData.schemeList = [{}, {}, {}];
      const obj = {
        advisorId: (this.parentId) ? 0 : (this.data.arnRiaDetailId != -1) ? 0 : [this.data.adminAdvisorIds],
        arnRiaDetailsId: this.arnRiaValue,
        parentId: (this.data) ? this.data.parentId : -1,
        familyMembertId: subCatData.familyMemberId,
        subCategoryId: subCatData.id,
        subCategoryTotalAum: subCatData.totalAum,
        clientId: this.clientIdToPass
      }
      this.backoffice.getAumApplicantScheme(obj).subscribe(
        data => {
          this.isLoadingScheme = false
          if (data) {
            data.forEach(element => {
              element.showFolio = true;
            });
            subCatData.schemeList = data
            this.schemeListArr = data
            this.schemeList = data;
            this.appendingOfValuesInExcel(data, index, 'schemes');
          } else {
            this.schemeListArr = []
            subCatData.schemeList = []
            this.isLoadingScheme = false
          }
        },
        err => {
          this.schemeListArr = []
          subCatData.schemeList = []
          this.isLoadingScheme = false
        }
      )
    } else {
      this.removeValuesFromExcel('schemes', index);

      if (subCatData.hasOwnProperty('schemeList') && subCatData.schemeList.length !== 0) {
        subCatData.schemeList.forEach(element => {
          element.showFolio = false;
          element.showScheme = true;
        });
      }
    }
  }
  getSchemeFolio(schemeData, index, schemeIndex, catIndex, applicantIndex) {

    this.selectedApplicant = applicantIndex;
    this.selectedClient = index;
    this.selectedScheme = schemeIndex;
    this.selectedCat = catIndex;


    schemeData.showFolio = !schemeData.showFolio;
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
    this.applicantName.forEach(element => {
      element.show = true
    });
  }

}
