import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AumComponent } from '../aum.component';
import { BackOfficeService } from '../../../../back-office.service';
import { AuthService } from 'src/app/auth-service/authService';
import { ExcelMisService } from '../excel-mis.service';
import { MfServiceService } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service';
import { RoleService } from 'src/app/auth-service/role.service';
import { UtilService } from 'src/app/services/util.service';

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
  @Input() filterObj;
  @Output() aumFilter = new EventEmitter();
  selectedApplicant: any;
  selectedScheme: any;
  selectedFolio: any;
  selectedClient: any;
  selectedCat: any;
  isLoadingCategory = false;
  categoryListArr: any[];
  isLoadingSubCategory = false;
  isLoadingScheme = false;
  schemeListArr: any[];
  @Input() data;
  parentId: any;
  clientIdToPass;
  arnRiaList = [];
  arnRiaValue;
  selectedApplicantName: any;
  selectedSubCategory: any;
  selectedSchemeName: any;
  selectedSubCatName: any;
  selectedSchemeFolioName: any;
  viewModeID: string;
  aumId: number;
  aumIdList: any;

  constructor(public aum: AumComponent, private backoffice: BackOfficeService, private mfService: MfServiceService, public roleService: RoleService) {

    this.backoffice.misAumData.subscribe(
      data => {
        if (data.value == 'applicant') {
          if (data.aumId.length > 0) {
            this.aumId = data.aumId,
              this.viewModeID = data.viewModeID;
            this.aumIdList = UtilService.getFilterSelectedAumIDs(this.aumId);
            this.arnRiaValue = data.arnRiaValue;
            this.advisorId = AuthService.getAdvisorId();
            this.clientId = AuthService.getClientId();
            this.getArnRiaList();
            this.aumApplicantWiseTotalaumApplicantNameGet();

          } else {
            this.viewModeID = 'All';
            this.aumId = 0;
          }
        }
      }
    )
  }

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
    // this.advisorId = AuthService.getAdvisorId();
    // this.clientId = AuthService.getClientId();
    this.parentId = AuthService.getAdminAdvisorId();
    if (this.data.hasOwnProperty('arnRiaValue') && this.data.hasOwnProperty('viewMode')) {
      this.arnRiaValue = this.data.arnRiaValue;
      this.viewMode = this.data.viewMode;
    } else {
      this.viewMode = 'All';
      this.arnRiaValue = -1;
    }
    // if (this.filterObj) {
    //   this.aumId = this.filterObj.aumId,
    //     this.viewModeID = this.filterObj.viewModeID;
    // } else {
    //   this.viewModeID = 'All';
    //   this.aumId = 0;
    // }
    // this.getArnRiaList();
    // this.aumApplicantWiseTotalaumApplicantNameGet();
  }

  filterIDWise(id, flagValue) {
    this.aumId = id;
    this.viewModeID = flagValue;
    this.aumApplicantWiseTotalaumApplicantNameGet();
  }

  emitFilterListResponse(res) {
    if (res) {
      this.aumIdList = UtilService.getFilterSelectedAumIDs(res);
      this.aumApplicantWiseTotalaumApplicantNameGet();
    }
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
    this.arrayOfExcelData = [];
    this.isLoading = true;
    this.totalCurrentValue = 0;
    this.totalWeight = 0;
    this.applicantName = [{}, {}, {}]
    const obj = {
      advisorId: (this.parentId == this.advisorId) ? 0 : this.advisorId,
      arnRiaDetailsId: this.arnRiaValue,
      parentId: (this.data) ? this.data.parentId : -1
    };
    if (this.aumIdList && this.aumIdList.length >= 0) {
      obj['rtId'] = this.aumIdList;
    }
    this.backoffice.getAumApplicantWiseTotalaumApplicantName(obj).subscribe(
      data => this.applicantNameGet(data),
      err => {
        this.isLoading = false;
        this.applicantName = [];
      }
    );
  }

  applicantWiseExcelSheet() {
    ExcelMisService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, this.arrayOfExcelData, 'MIS Report - Applicant wise AUM', 'applicant-wise-aum-mis', {
      applicantList: false,
      categoryList: false,
      suCategoryList: false,
      schemeList: false,
      schemeFolioList: false
    }, this.applicantWiseTotal);
  }

  categoryWiseExcelSheet(applicantIndex, catIndex) {
    const copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));

    copyOfExcelData.forEach((element, index1) => {
      if (index1 === applicantIndex) {
        return;
      } else {
        element.categoryList = [];
      }
    });

    const arrayOfExcelHeaders = this.arrayOfHeaders.slice();
    const arrayOfExcelStyles = this.arrayOfHeaderStyles.slice();
    arrayOfExcelHeaders.shift();
    arrayOfExcelStyles.shift();

    ExcelMisService.exportExcel3(arrayOfExcelHeaders, arrayOfExcelStyles, copyOfExcelData[applicantIndex].categoryList, 'MIS Report - Applicant wise AUM', 'applicant-wise-aum-mis', {
      applicantList: true,
      categoryList: false,
      subCategoryList: false,
      schemeList: false,
      schemeFolioList: false
    }, this.catWiseTotal,
      [['Selected Appnicant Name: ', this.selectedApplicantName]]
    );
  }

  subCategoryWiseExcelSheet(applicantIndex, catIndex, subCatIndex) {
    const copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));

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
    const arrayOfExcelHeaders = this.arrayOfHeaders.slice();
    const arrayOfExcelStyles = this.arrayOfHeaderStyles.slice();
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
    }, this.subCatWiseTotal,
      [['Selected Applicant name: ', this.selectedApplicantName], ["Selected Sub category name: ", this.selectedSubCatName]]
    );
  }

  subCatSchemeWiseExcelSheet(applicantIndex, catIndex, subCatIndex, schemeIndex) {
    const copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));

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

    const arrayOfExcelHeaders = this.arrayOfHeaders.slice();
    const arrayOfExcelStyles = this.arrayOfHeaderStyles.slice();
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
    }, this.subCatSchemeWiseTotal,
      [['Selected Applicant name: ', this.selectedApplicantName], ["Selected Sub category name: ", this.selectedSubCatName], ["Selected Scheme name: ", this.selectedSchemeName]]
    );
  }

  schemeWiseExcelSheet() {
    const schemeFolioList = this.arrayOfExcelData[this.selectedApplicant].categoryList[this.selectedCat].subCategoryList[this.selectedScheme].schemeList[this.selectedClient].schemeFolioList;
    const newarr = [];
    schemeFolioList.forEach(element => {
      newarr.push({
        field1: element.index,
        field2: element.name,
        field3: this.casFolioNumber(element),
        // field4: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
        field4: element.totalAum,
        // field5: this.mfService.mutualFundRoundAndFormat(element.balanceUnit, 2),
        field5: element.balanceUnit,
        field6: element.weightInPerc
      });
    });
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[4], this.arrayOfHeaders[4], newarr, [], 'MIS Report - Applicant wise AUM', this.schemeWiseTotal,
      [
        ['Selected Applicant name: ', this.selectedApplicantName],
        ["Selected Sub category name: ", this.selectedSubCatName],
        ["Selected Scheme name: ", this.selectedSchemeName],
        ["Selected Scheme Folio name: ", this.selectedSchemeFolioName]
      ]);
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
        // totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
        totalAum: element.totalAum,
        weightInPerc: element.weightInPercentage,
        categoryList: []
      });
      sumAumTotal = sumAumTotal + element.totalAum;
      sumWeightInPercTotal = sumWeightInPercTotal + element.weightInPercentage;
    });
    sumWeightInPercTotal = Math.round(sumWeightInPercTotal);
    let totalAumObj: any = {};
    if (this.data && this.data.totalAumObj) {
      totalAumObj = this.data.totalAumObj;
      this.applicantWiseTotal = ['Total', '', totalAumObj.totalAum ? totalAumObj.totalAum : this.totalCurrentValue, 100];
    }

    console.log('totalAumObj : ', totalAumObj);
    console.log('sumAumTotal : ', sumAumTotal);
    console.log('sumWeightInPercTotal : ', sumWeightInPercTotal);
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
            // totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
            totalAum: element.totalAum,
            weightInPerc: element.weightInPercentage,
            subCategoryList: []
          });
          sumAumTotal = sumAumTotal + element.totalAum;
          sumWeightInPercTotal = sumWeightInPercTotal + element.weightInPercentage;
        });
        sumWeightInPercTotal = Math.round(sumWeightInPercTotal);
        this.catWiseTotal = ['Total', '', sumAumTotal, Math.round(sumWeightInPercTotal)];
        break;
      case 'sub-category':
        // sub categories
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedApplicant].categoryList[index].subCategoryList.push({
            index: index1 + 1,
            name: element.name,
            // totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
            totalAum: element.totalAum,
            weightInPerc: element.weightInPercentage,
            schemeList: []
          });
          sumAumTotal = sumAumTotal + element.totalAum;
          sumWeightInPercTotal = sumWeightInPercTotal + element.weightInPercentage;
        });
        sumWeightInPercTotal = Math.round(sumWeightInPercTotal);
        this.subCatWiseTotal = ['Total', '', sumAumTotal, Math.round(sumWeightInPercTotal)];
        break;
      case 'schemes':
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedApplicant].categoryList[this.selectedCat]
            .subCategoryList[index].schemeList.push({
              index: index1 + 1,
              name: element.schemeName,
              folioNumber: this.casFolioNumber(element),
              // totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
              totalAum: element.totalAum,
              weightInPerc: element.weightInPercentage,
              schemeFolioList: []
            });
          sumAumTotal = sumAumTotal + element.totalAum;
          sumWeightInPercTotal = sumWeightInPercTotal + element.weightInPercentage;
        });
        sumWeightInPercTotal = Math.round(sumWeightInPercTotal);
        this.subCatSchemeWiseTotal = ['Total', '', '', sumAumTotal, Math.round(sumWeightInPercTotal)];
        break;
      case 'scheme-folio':
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedApplicant].categoryList[this.selectedCat]
            .subCategoryList[this.selectedScheme].schemeList[index].schemeFolioList.push({
              index: index1 + 1,
              name: element.schemeName,
              folioNumber: this.casFolioNumber(element),
              // totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
              totalAum: element.totalAum,
              // balanceUnit: this.mfService.mutualFundRoundAndFormat(element.balanceUnit, 2),
              balanceUnit: element.balanceUnit,
              weightInPerc: element.weightInPercentage
            });
          sumAumTotal = sumAumTotal + element.totalAum;
          sumWeightInPercTotal = sumWeightInPercTotal + element.weightInPercentage;
        });
        sumWeightInPercTotal = Math.round(sumWeightInPercTotal);
        this.schemeWiseTotal = ['Total', '', '', sumAumTotal, '', Math.round(sumWeightInPercTotal)];
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
    this.totalCurrentValue = 0;
    if (data) {
      console.log('here we have client id needed::::::::::', data);
      this.applicantName = data;
      this.applicantName.forEach(o => {
        o.show = true;
        this.totalCurrentValue += o.totalAum;
        this.totalWeight += o.weightInPercentage;
      });
      this.excelInitApplicant();
      let totalAumObj: any = {};
      if (this.data && this.data.totalAumObj) {
        totalAumObj = this.data.totalAumObj;
        console.log('totalAumObj : ', totalAumObj);
        console.log('sumAumTotal : ', this.totalCurrentValue);
        console.log('sumWeightInPercTotal : ', this.totalWeight);
        this.totalCurrentValue = totalAumObj.totalAum ? totalAumObj.totalAum : this.totalCurrentValue;
        this.totalWeight = 100;
      }
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
          };
          this.arnRiaList.unshift(obj);
        } else {
          // this.dataService.openSnackBar("No Arn Ria List Found", "Dismiss")
        }
      }
    );
  }

  changeValueOfArnRia(item) {
    if (item.name !== 'All') {
      this.arnRiaValue = item.id;
      this.viewMode = item.number;
    } else {
      this.arnRiaValue = -1;
    }
    this.aumApplicantWiseTotalaumApplicantNameGet();
  }


  category(applicantData, index) {
    this.clientIdToPass = applicantData.clientId;

    this.selectedApplicant = index;

    this.selectedApplicantName = applicantData.name;
    applicantData.show = !applicantData.show;

    if (applicantData.show == false) {
      this.isLoadingCategory = true;
      applicantData.categoryList = [];
      applicantData.categoryList = [{}, {}, {}];
      this.categoryListArr = [];
      const obj = {
        advisorId: (this.parentId == this.advisorId) ? 0 : this.advisorId,
        arnRiaDetailsId: this.arnRiaValue,
        parentId: (this.data) ? this.data.parentId : -1,
        familyMembertId: applicantData.id,
        clientTotalAum: applicantData.totalAum,
        clientId: this.clientIdToPass
      };
      if (this.aumIdList && this.aumIdList.length >= 0) {
        obj['rtId'] = this.aumIdList;
      }
      this.backoffice.getAumApplicantCategory(obj).subscribe(
        data => {
          this.isLoadingCategory = false;
          if (data) {
            console.log('this is category list data:::', data);
            data.forEach(element => {
              element.showCategory = true;
              element.familyMemberId = applicantData.id;
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
  casFolioNumber(data) {
    if (data && data.length > 0) {
      data.forEach(element => {
        if (element.rtMasterId == 6 && !element.folioNumber.includes("CAS")) {
          element.folioNumber = 'CAS-' + element.folioNumber;
        }

      });
    } else if (!Array.isArray(data)) {
      if (data && data.rtMasterId == 6 && !data.folioNumber.includes("CAS")) {
        data.folioNumber = 'CAS-' + data.folioNumber;
      }
      data = data ? data.folioNumber : [];
    }

    return data;
  }
  subCategory(catData, index, applicantIndex, catName) {

    this.selectedCat = index;
    this.selectedApplicant = applicantIndex;

    this.selectedSubCategory = catData.name;
    this.selectedApplicantName = catName;
    catData.showCategory = !catData.showCategory;

    if (catData.showCategory == false) {
      this.isLoadingSubCategory = true;
      catData.subCatList = [];
      catData.subCatList = [{}, {}, {}];
      this.subCategoryList = [];
      const obj = {
        advisorId: (this.parentId == this.advisorId) ? 0 : this.advisorId,
        arnRiaDetailsId: this.arnRiaValue,
        parentId: (this.data) ? this.data.parentId : -1,
        familyMembertId: catData.familyMemberId,
        categoryId: catData.id,
        categoryTotalAum: catData.totalAum,
        clientId: this.clientIdToPass
      };
      if (this.aumIdList && this.aumIdList.length >= 0) {
        obj['rtId'] = this.aumIdList;
      }
      this.backoffice.getAumApplicantSubCategory(obj).subscribe(
        data => {
          this.isLoadingSubCategory = false;
          if (data) {
            data.forEach(element => {
              element.showSubCategory = true;
              element.familyMemberId = catData.familyMemberId;

            });
            catData.subCatList = data;
            this.subCategoryList = data;
            this.subCategoryList = data;
            this.appendingOfValuesInExcel(data, index, 'sub-category');
          } else {
            this.subCategoryList = [];
            catData.subCatList = [];
            this.isLoadingSubCategory = false;
          }
        },
        err => {
          this.subCategoryList = [];
          catData.subCatList = [];
          this.isLoadingSubCategory = false;
        }
      );
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

  getScheme(subCatData, index, catIndex, applicantIndex, subCatName, catName) {
    this.selectedScheme = index;
    this.selectedCat = catIndex;
    this.selectedApplicant = applicantIndex;

    this.selectedSchemeName = subCatData.name;
    this.selectedSubCatName = subCatName;
    this.selectedApplicantName = catName;

    subCatData.showSubCategory = !subCatData.showSubCategory;

    if (subCatData.showSubCategory == false) {
      this.isLoadingScheme = true;
      this.schemeListArr = [];
      subCatData.schemeList = [];
      subCatData.schemeList = [{}, {}, {}];
      const obj = {
        advisorId: (this.parentId == this.advisorId) ? 0 : this.advisorId,
        arnRiaDetailsId: this.arnRiaValue,
        parentId: (this.data) ? this.data.parentId : -1,
        familyMembertId: subCatData.familyMemberId,
        subCategoryId: subCatData.id,
        subCategoryTotalAum: subCatData.totalAum,
        clientId: this.clientIdToPass
      };
      if (this.aumIdList && this.aumIdList.length >= 0) {
        obj['rtId'] = this.aumIdList;
      }
      this.backoffice.getAumApplicantScheme(obj).subscribe(
        data => {
          this.isLoadingScheme = false;
          if (data) {
            data = this.casFolioNumber(data);
            console.log(data);
            data.forEach(element => {
              element.showFolio = true;
            });
            subCatData.schemeList = data;
            this.schemeListArr = data;
            this.schemeList = data;
            this.appendingOfValuesInExcel(data, index, 'schemes');
          } else {
            this.schemeListArr = [];
            subCatData.schemeList = [];
            this.isLoadingScheme = false;
          }
        },
        err => {
          this.schemeListArr = [];
          subCatData.schemeList = [];
          this.isLoadingScheme = false;
        }
      );
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

  getSchemeFolio(schemeData, index, schemeIndex, catIndex, applicantIndex, schemeName, subCatName, catName) {

    this.selectedApplicant = applicantIndex;
    this.selectedClient = index;
    this.selectedScheme = schemeIndex;
    this.selectedCat = catIndex;
    this.selectedSchemeFolioName = schemeData.schemeName;

    this.selectedSchemeName = schemeName;
    this.selectedSubCatName = subCatName;
    this.selectedApplicantName = catName;


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
    this.changedValue.emit({
      value: true,
      arnRiaValue: this.arnRiaValue,
      viewMode: this.viewMode
    });
    this.aumFilter.emit({
      aumId: this.aumId,
      viewModeID: this.viewModeID
    })
    this.applicantName.forEach(element => {
      element.show = true;
    });
  }

}
