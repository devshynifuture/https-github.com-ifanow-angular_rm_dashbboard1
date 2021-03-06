import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BackOfficeService } from '../../../../back-office.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AumComponent } from '../aum.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ExcelMisService } from '../excel-mis.service';
import { MfServiceService } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service';
import { RoleService } from 'src/app/auth-service/role.service';
import { UtilService } from 'src/app/services/util.service';

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
  @Input() data;
  @Input() filterObj;
  isSubCatLoading = false;

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
      'Current Value',
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
      { width: 30, key: 'Current Value' },
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
  @Output() aumFilter = new EventEmitter();

  selectedSubCategory: any;
  selectedClientIndex: any;
  totalCurrentValue = 0;
  totalWeight = 0;
  propertyName: any;
  propertyName2: any;
  propertyName3: any;
  propertyName4: any;
  reverse = true;
  reverse2 = true;
  reverse3 = true;
  reverse4 = true;
  parentId: any;
  clientId: any;
  categoryWiseTotalArr = [];
  subCategoryWiseTotalArr = [];
  schemeWiseTotalArr = [];
  applicantWiseTotalArr = [];
  arnRiaValue: any;
  viewMode: any;
  arnRiaList = [];
  selectedSchemeName: any;
  selectedSubCategoryName: any;
  selectedCategoryName: any;
  isSchemeLoading: boolean;
  viewModeID: any;
  aumId: any;
  aumIdList: any;
  // categoryTotal: number = 0;
  // subCategoryTotal: number = 0;
  // applicantTotal: number = 0;
  // schemeTotal: number = 0;
  constructor(
    private backoffice: BackOfficeService,
    private dataService: EventService,
    public aum: AumComponent,
    private mfService: MfServiceService,
    public roleService: RoleService
  ) {
    this.backoffice.misAumData.subscribe(
      data => {
        if (data.value == 'category') {
          if (data.aumId.length > 0) {
            this.aumId = data.aumId,
              this.viewModeID = data.viewModeID;
            this.aumIdList = UtilService.getFilterSelectedAumIDs(this.aumId);
            this.arnRiaValue = data.arnRiaValue;
            this.getArnRiaList();
            this.getSubCatSchemeName();
          } else {
            this.viewModeID = 'All';
            this.aumId = 0;
          }
        }
      }
    )
  }

  selectedCategory;

  ngOnInit() {
    this.clientId = AuthService.getClientId();
    this.parentId = AuthService.getAdminAdvisorId();
    if (this.data.hasOwnProperty('arnRiaValue') && this.data.hasOwnProperty('viewMode')) {
      this.arnRiaValue = this.data.arnRiaValue;
      this.viewMode = this.data.viewMode;
    } else {
      this.viewMode = 'All';
      this.arnRiaValue = -1;
    }

    // this.clientFolioWise();
    // this.getSubCatAum();
  }

  changeValueOfArnRia(item) {
    if (item.name !== 'All') {
      this.arnRiaValue = item.id;
      this.viewMode = item.number;
    } else {
      this.arnRiaValue = -1;
    }
    this.getSubCatSchemeName();
  }

  getArnRiaList() {
    this.backoffice.getArnRiaList(this.advisorId)
      .subscribe(
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

  sortBySubCat(applicant, propertyName) {
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

  sortByScheme(applicant, propertyName) {
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

  sortByApplicant(applicant, propertyName) {
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

  getSubCatSchemeName() {
    this.arrayOfExcelData = [];
    this.isLoading = true;
    this.totalCurrentValue = 0;
    this.totalWeight = 0;
    this.category = [{}, {}, {}];
    const obj = {
      advisorId: (this.parentId == this.advisorId) ? 0 : this.advisorId,
      arnRiaDetailsId: this.arnRiaValue,
      parentId: (this.data) ? this.data.parentId : -1
    };
    if (this.aumIdList && this.aumIdList.length >= 0) {
      obj['rtId'] = this.aumIdList;
    }
    this.backoffice.getTotalByAumScheme(obj).subscribe(
      data => this.getFileResponseDataForSubSchemeName(data),
      err => this.getFilerrorResponse(err)
    );
  }

  emitFilterListResponse(res) {
    if (res) {
      this.aumIdList = UtilService.getFilterSelectedAumIDs(res);
      this.getSubCatSchemeName();
    }
  }


  // clientFolioWise() {
  //   const obj = {
  //     amcName: 'Aditya Birla',
  //     teamMemberId: this.teamMemberId
  //   };
  //   this.backoffice.getClientFolioWiseInCategory(obj).subscribe(
  //     data => {
  //     },
  //     err => this.getFilerrorResponse(err)
  //   );
  // }

  showSubTableList(index, category, catIndex) {
    this.selectedCategoryName = category.name;
    this.selectedCategory = index;
    category.showCategory = !category.showCategory;


    this.isSubCatLoading = true;
    let data = {
      advisorId: this.advisorId,
      arnRiaDetailId: this.arnRiaValue,
      categoryId: category.id,
      parentId: this.parentId
    }
    if (this.aumIdList && this.aumIdList.length >= 0) {
      data['rtId'] = this.aumIdList;
    }
    category.subCategoryList = [{}, {}, {}];
    this.backoffice.getSubCategoryListMisAUM(data)
      .subscribe(res => {
        if (res) {
          this.isSubCatLoading = false;
          console.log(res);

          res.subcategory.map(item => {
            item.showSubCategory = true;
          });
          category.subCategoryList = res.subcategory;
          if (!category.showCategory) {
            if (this.category[this.selectedCategory].hasOwnProperty('subCategoryList') && this.category[this.selectedCategory].subCategoryList.length !== 0) {
              this.appendingOfValuesInExcel(this.category[this.selectedCategory].subCategoryList, index, 'sub-category');
            }
          } else {
            // remove
            this.removeValuesFromExcel('sub-category', index);
            if (category.subCategoryList.length !== 0) {
              category.subCategoryList.forEach(subCatElement => {
                subCatElement.showSubCategory = true;
                if (subCatElement.schemes.length !== 0) {
                  subCatElement.schemes.forEach(schemeElement => {
                    schemeElement.showScheme = true;
                    if (schemeElement.clientList.length !== 0) {
                      schemeElement.clientList.forEach(element => {
                        element.show = true;
                      });
                    }
                  });
                }
              });
            }
          }
        } else {
          this.isSubCatLoading = false;
        }
      }, err => {
        this.isSubCatLoading = false;
        console.error(err);
      })

  }

  removeValuesFromExcel(whichList, index) {
    switch (whichList) {
      case 'sub-category':
        this.arrayOfExcelData[index].subCatList = [];
        break;
      case 'schemes':
        this.arrayOfExcelData[this.selectedCategory].subCatList[index].schemeList = [];
        break;
      case 'applicant':
        this.arrayOfExcelData[this.selectedCategory].subCatList[this.selectedSubCategory].schemeList[index].applicantList = [];
        break;
    }
  }

  getFileResponseDataForSubSchemeName(data) {
    this.isLoading = false;
    this.showLoader = false;
    this.totalCurrentValue = 0;
    if (data) {
      this.category = data.categories;
      this.totalAumForSubSchemeName = data.totalAum;
      // excel init
      this.category.forEach(o => {
        o.showCategory = true;
        this.totalCurrentValue += o.totalAum;
        this.totalWeight += o.weightInPercentage;
        this.subCategoryList.push(o.subCategoryList);

        // o.subCategoryList.forEach(sub => {
        //   sub.showSubCategory = true;
        // });


      });
      this.excelInitOfCategories();
    } else {
      this.category = [];
    }

    // this.excelSheetInitialization();



    let totalAumObj: any = {};
    if (this.data && this.data.totalAumObj) {
      totalAumObj = this.data.totalAumObj;
      console.log('totalAumObj : ', totalAumObj);
      console.log('sumAumTotal : ', this.totalCurrentValue);
      console.log('sumWeightInPercTotal : ', this.totalWeight);
      this.totalCurrentValue = totalAumObj.totalAum ? totalAumObj.totalAum : this.totalCurrentValue;
      this.totalWeight = 100;
    }

  }

  showSchemeName(subCategory, index, catIndex, categoryName) {
    this.selectedCategoryName = categoryName;
    this.selectedSubCategoryName = subCategory.name;
    this.selectedSubCategory = index;
    this.selectedCategory = catIndex;
    subCategory.showSubCategory = !subCategory.showSubCategory;


    subCategory.schemes = [{}, {}, {}];
    let data = {
      advisorId: (this.parentId == this.advisorId) ? 0 : this.advisorId,
      arnRiaDetailId: this.arnRiaValue,
      parentId: this.parentId,
      subCategoryId: subCategory.id,
      totalAum: subCategory.totalAum,
    }
    if (this.aumIdList && this.aumIdList.length >= 0) {
      data['rtId'] = this.aumIdList;
    }
    this.isSchemeLoading = true;
    this.backoffice.getSchemeListMisAUM(data)
      .subscribe(res => {
        if (res) {
          this.isSchemeLoading = false;
          console.log("schemes :: ", res);
          subCategory.schemes = res;
          subCategory.schemes.map(element => {
            element.showScheme = true;
          });

          if (!subCategory.showSubCategory) {
            this.appendingOfValuesInExcel(this.category[this.selectedCategory].subCategoryList[this.selectedSubCategory].schemes, index, 'schemes');
          } else {
            this.removeValuesFromExcel('schemes', index);
            if (subCategory.schemes.length !== 0) {
              subCategory.schemes.forEach(schemeElement => {
                schemeElement.showScheme = true;
                if (schemeElement.clientList.length !== 0) {
                  schemeElement.clientList.forEach(element => {
                    element.show = true;
                  });
                }
              });
            }
          }
        }
      }, err => {
        this.isSchemeLoading = false;
        console.error(err);
      });

  }

  closeAllBottomOpenedCat(category) {
    if (category.hasOwnProperty('subCategoryList') && category.subCategoryList.length !== 0) {
      category.subCategoryList.forEach(subCatElement => {
        subCatElement.showSubCategory = false;
        if (subCatElement.schemes.length !== 0) {
          subCatElement.schemes.forEach(schemeElement => {
            schemeElement.showScheme = false;
            if (schemeElement.clientList.length !== 0) {
              schemeElement.clientList.forEach(element => {
                element.show = false;
              });
            }
          });
        }
      });
    }
    console.log('this is category:::::', category);
  }

  closeAllBottomOpenedSubCat(subCatElement) {
    if (subCatElement.schemes.length !== 0) {
      subCatElement.schemes.forEach(schemeElement => {
        schemeElement.showScheme = false;
        if (schemeElement.clientList.length !== 0) {
          schemeElement.clientList.forEach(element => {
            element.show = false;
          });
        }
      });
    }
  }

  closeAllBottomOpenedScheme(schemeElement) {
    if (schemeElement.clientList.length !== 0) {
      schemeElement.clientList.forEach(element => {
        element.show = false;
      });
    }
  }

  showApplicantName(schemeData, index, subCatIndex, catIndex, subCatName, catName) {
    this.selectedSubCategory = subCatIndex;
    this.selectedCategory = catIndex;
    this.selectedClientIndex = index;

    this.selectedCategoryName = catName;
    this.selectedSubCategoryName = subCatName;
    this.selectedSchemeName = schemeData.schemeName;

    schemeData.showScheme = !schemeData.showScheme;
    if (!schemeData.showScheme) {
      this.appendingOfValuesInExcel(this.category[this.selectedCategory].subCategoryList[this.selectedSubCategory].schemes[this.selectedClientIndex].clientList, index, 'applicant');
    } else {
      this.removeValuesFromExcel('applicant', index);
    }
    schemeData.clientList = this.casFolioNumber(schemeData.clientList)
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
    this.category.forEach(element => {
      element.showCategory = true;
    });
  }

  getFilerrorResponse(err) {
    this.isLoading = false;
    this.category = [];
    this.dataService.openSnackBar(err, 'Dismiss');
  }

  excelInitOfCategories() {
    let dataValue = {};
    let sumAumTotal = 0;
    let sumWeightInPercTotal = 0;
    this.category.forEach((element, index1) => {
      dataValue = {
        index: index1 + 1,
        categoryName: element.name,
        // totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
        totalAum: element.totalAum,
        weightInPerc: element.weightInPercentage,
        subCatList: []
      };
      this.arrayOfExcelData.push(dataValue);
      sumAumTotal = sumAumTotal + element.totalAum;
      sumWeightInPercTotal = sumWeightInPercTotal + element.weightInPercentage;
    });
    sumWeightInPercTotal = Math.round(sumWeightInPercTotal);
    let totalAumObj: any = {};
    if (this.data && this.data.totalAumObj) {
      totalAumObj = this.data.totalAumObj;
      this.categoryWiseTotalArr = ['Total', '', totalAumObj.totalAum ? totalAumObj.totalAum : this.totalCurrentValue, 100];
    }
    console.log('totalAumObj : ', totalAumObj);
    console.log('sumAumTotal : ', sumAumTotal);
    console.log('sumWeightInPercTotal : ', sumWeightInPercTotal);
  }

  appendingOfValuesInExcel(iterable, index, choice) {
    let sumTotalAumTemp = 0;
    let sumTotalWeightInPercTemp = 0;
    switch (choice) {
      case 'sub-category':
        // categories
        this.subCategoryWiseTotalArr = [];
        sumTotalAumTemp = 0;
        sumTotalWeightInPercTemp = 0;
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].subCatList.push({
            index: index1 + 1,
            name: element.name,
            // totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
            totalAum: element.totalAum,
            weightInPerc: element.weightInPercentage,
            schemeList: [],
          });
          sumTotalAumTemp = sumTotalAumTemp + element.totalAum;
          sumTotalWeightInPercTemp = sumTotalWeightInPercTemp + element.weightInPercentage;
        });
        sumTotalWeightInPercTemp = Math.round(sumTotalWeightInPercTemp);
        this.subCategoryWiseTotalArr = ['Total', '', sumTotalAumTemp, Math.round(sumTotalWeightInPercTemp)];
        break;
      case 'schemes':
        this.schemeWiseTotalArr = [];
        // sub categories
        sumTotalAumTemp = 0;
        sumTotalWeightInPercTemp = 0;
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedCategory].subCatList[index].schemeList.push({
            index: index1 + 1,
            name: element.schemeName,
            // totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
            totalAum: element.totalAum,
            weightInPerc: element.weightInPercentage,
            applicantList: [],
          });
          sumTotalAumTemp = sumTotalAumTemp + element.totalAum;
          sumTotalWeightInPercTemp = sumTotalWeightInPercTemp + element.weightInPercentage;
        });
        sumTotalWeightInPercTemp = Math.round(sumTotalWeightInPercTemp);
        this.schemeWiseTotalArr = ['Total', '', sumTotalAumTemp, Math.round(sumTotalWeightInPercTemp)];
        break;
      case 'applicant':
        this.applicantWiseTotalArr = [];
        sumTotalAumTemp = 0;
        sumTotalWeightInPercTemp = 0;
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedCategory].subCatList[this.selectedSubCategory]
            .schemeList[index].applicantList.push({
              name: element.name,
              // balanceUnit: this.mfService.mutualFundRoundAndFormat(element.balanceUnit, 2),
              balanceUnit: element.balanceUnit,
              folioNumber: this.casFolioNumber(element),
              // totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
              totalAum: element.totalAum,
              weightInPerc: element.weightInPercentage,
            });
          sumTotalAumTemp = sumTotalAumTemp + element.totalAum;
          sumTotalWeightInPercTemp = sumTotalWeightInPercTemp + element.weightInPercentage;
        });
        sumTotalWeightInPercTemp = Math.round(sumTotalWeightInPercTemp);
        this.applicantWiseTotalArr = ['Total', '', '', sumTotalAumTemp, Math.round(sumTotalWeightInPercTemp)];
        break;
    }
  }

  categoryWiseExcelSheet() {
    ExcelMisService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, this.arrayOfExcelData, 'MIS Report - Category wise AUM', 'category-wise-aum-mis', {
      categoryList: false,
      subCatList: false,
      schemeList: false,
      applicantList: false
    }, this.categoryWiseTotalArr);
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
  subCategoryWiseExcelSheet(index) {
    const copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));

    copyOfExcelData.forEach((element, index1) => {
      if (index1 === index) {
        return;
      } else {
        if (element.subCatList.length !== 0) {
          element.subCatList = [];
        }
      }
    });
    const arrayOfExcelHeaders = this.arrayOfHeaders.slice();
    const arrayOfExcelStyles = this.arrayOfHeaderStyles.slice();
    arrayOfExcelStyles.shift();
    arrayOfExcelHeaders.shift();

    ExcelMisService.exportExcel3(arrayOfExcelHeaders, arrayOfExcelStyles, copyOfExcelData[index].subCatList, 'MIS Report - Category wise AUM', 'category-wise-aum-mis', {
      categoryList: true,
      subCatList: false,
      schemeList: false,
      applicantList: false
    }, this.subCategoryWiseTotalArr, [["Selected Category Name: -", this.selectedCategoryName]]);
  }

  applicantWiseExcelSheet(index) {
    const applicantList = this.arrayOfExcelData[this.selectedCategory].subCatList[this.selectedSubCategory].schemeList[this.selectedClientIndex].applicantList;
    const newarr = [];
    applicantList.forEach(element => {
      newarr.push({
        field1: element.name,
        // field2: this.mfService.mutualFundRoundAndFormat(element.balanceUnit, 2),
        field2: element.balanceUnit,
        field3: this.casFolioNumber(element),
        // field4: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
        field4: element.totalAum,
        field5: element.weightInPerc,
      });
    });

    let arrOfParentName = [["Selected Category name: ", this.selectedCategoryName], ["Selected Sub Category name: ", this.selectedSubCategoryName], ['Selected Scheme name', this.selectedSchemeName]];
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[3], this.arrayOfHeaders[3], newarr, [], 'MIS Report - Category Wise AUM', this.applicantWiseTotalArr, arrOfParentName);
  }

  schemeWiseExcelSheet(catIndex, subCatIndex) {
    const copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));

    copyOfExcelData.forEach((element, index1) => {
      if (index1 === catIndex) {
        return;
      } else {
        if (element.subCatList.length !== 0) {
          element.subCatList.forEach(element => {
            element.schemeList = [];
          });
        }
      }
    });

    const arrayOfExcelHeaders = this.arrayOfHeaders.slice();
    const arrayOfExcelStyles = this.arrayOfHeaderStyles.slice();
    arrayOfExcelStyles.shift();
    arrayOfExcelStyles.shift();
    arrayOfExcelHeaders.shift();
    arrayOfExcelHeaders.shift();
    let arrOfParentName = [["Selected Category name: " + this.selectedCategoryName], ["Selected Sub Category name: ", this.selectedSubCategoryName]];

    ExcelMisService.exportExcel4(arrayOfExcelHeaders, arrayOfExcelStyles, copyOfExcelData[catIndex].subCatList[subCatIndex].schemeList, 'MIS Report - Category wise AUM', 'category-wise-aum-mis', {
      categoryList: true,
      subCatList: true,
      schemeList: false,
      applicantList: false
    }, this.schemeWiseTotalArr, arrOfParentName);
  }

  exportToExcelReport(choice, catIndex, subCatIndex, schemeIndex) {
    switch (choice) {
      case 'category':
        this.categoryWiseExcelSheet();
        break;
      case 'sub-category':
        this.subCategoryWiseExcelSheet(catIndex);
        break;
      case 'schemes':
        this.schemeWiseExcelSheet(catIndex, subCatIndex);
        break;
      case 'applicant':
        this.applicantWiseExcelSheet(catIndex);
        break;
    }
  }
}