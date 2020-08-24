import { DateChangeDialogComponent } from './../../date-change-dialog/date-change-dialog.component';
import { Component, OnInit, ViewChildren, EventEmitter, Output, Input } from '@angular/core';
import { SipComponent } from '../sip.component';
import { BackOfficeService } from '../../../../back-office.service';
import { AuthService } from 'src/app/auth-service/authService';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelMisSipService } from '../../aum/excel-mis-sip.service';
import { MfServiceService } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service';
import { FormBuilder } from '@angular/forms';
import { EventService } from 'src/app/Data-service/event.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-sip-scheme-wise',
  templateUrl: './sip-scheme-wise.component.html',
  styleUrls: ['./sip-scheme-wise.component.scss']
})
export class SipSchemeWiseComponent implements OnInit {
  showLoader = true;
  teamMemberId = 2929;
  advisorId: any;
  clientId: any;
  category: any;
  selectedCategory: any;
  InvestorList: any;
  applicantList: any;
  schemeFilter: any;
  isLoading = false;
  @ViewChildren(FormatNumberDirective) formatNumber;
  totalOfSipAmount = 0;
  totalOfSipCount = 0;
  totalWeight = 0;
  filteredArray: any[];
  propertyName: any;
  propertyName2: any;
  propertyName3: any;
  reverse = true;
  reverse2 = true;
  reverse3 = true;
  @Output() changedValue = new EventEmitter();
  @Input() data;
  maxDate = new Date();


  arrayOfHeaders: any[][] = [
    [
      'Sr. No.',
      'AMC Name',
      'SIP Amount',
      'SIP Count',
      '% Weight'
    ],
    [
      'Sr. No.',
      'Investor Name',
      'SIP Amount',
      'SIP Count',
      '% Weight'
    ],
    [
      'Sr. No.',
      'Applicant Name',
      'Scheme Name',
      'Folio',
      'Registered Date',
      'From Date',
      'To Date',
      'Trigger Day',
      'Frequency',
      'Amount',
      '% Weight',
    ],
    [
      'Applicant Name',
      'Balance Unit',
      'Folio',
      'Current Amount',
      '% Weight'
    ]
  ];
  amcTotalList = [];
  investorTotalList = [];
  schemeTotalList = [];
  applicant2TotalList = [];

  arrayOfHeaderStyles: { width: number; key: string; }[][] = [
    [
      { width: 10, key: 'Sr. No.' },
      { width: 50, key: 'AMC Name' },
      { width: 30, key: 'SIP Amount' },
      { width: 30, key: 'SIP Count' },
      { width: 10, key: '% Weight' }
    ],
    [
      { width: 10, key: 'Sr. No.' },
      { width: 50, key: 'Investor Name' },
      { width: 30, key: 'SIP Amount' },
      { width: 30, key: 'SIP Count' },
      { width: 10, key: '% Weight' }
    ],
    [
      { width: 10, key: 'Sr. No.' },
      { width: 40, key: 'Applicant Name' },
      { width: 50, key: 'Scheme Name' },
      { width: 40, key: 'Folio Number' },
      { width: 40, key: 'Registered Date' },
      { width: 40, key: 'From Date' },
      { width: 40, key: 'To Date' },
      { width: 30, key: 'Trigger Day' },
      { width: 30, key: 'Frequency' },
      { width: 30, key: 'Amount' },
      { width: 10, key: '% Weight' },
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
  selectedSubCategory: any;
  selectedCategoryApp: any;
  isLoadingSubCategory: boolean;
  isLoadingCategory: boolean;
  applicantListArr: any[];
  subCatList: any[];
  caesedForm: any;
  parentId: any;
  viewMode;
  arnRiaList;
  arnRiaValue;
  ceasedDate: any;

  constructor(private datePipe: DatePipe, private eventService: EventService, private backoffice: BackOfficeService, private fb: FormBuilder, public sip: SipComponent, private mfService: MfServiceService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.caesedForm = this.fb.group({
      ceaseddate: ['']
    });
    this.showLoader = false;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.parentId = AuthService.getParentId() ? AuthService.getParentId() : this.advisorId;
    if (this.data.hasOwnProperty('arnRiaValue') && this.data.hasOwnProperty('viewMode')) {
      this.arnRiaValue = this.data.arnRiaValue;
      this.viewMode = this.data.viewMode;
    } else {
      this.viewMode = 'All';
      this.arnRiaValue = -1;
    }
    this.getArnRiaList();
    this.getSchemeWiseGet();
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
    this.getSchemeWiseGet();
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

  sortByInvestor(applicant, propertyName) {
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

  sortByApplicant(applicant, propertyName) {
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

  aumReport() {
    this.changedValue.emit({
      value: true,
      arnRiaValue: this.arnRiaValue,
      viewMode: this.viewMode
    });
    //  this.sip.sipComponent=true;
    this.filteredArray.forEach(element => {
      element.showCategory = true;
    });
  }

  getSchemeWiseGet() {
    this.arrayOfExcelData = [];
    this.totalOfSipAmount = 0;
    this.totalOfSipCount = 0;
    this.totalWeight = 0;
    this.isLoading = true;
    this.filteredArray = [{}, {}, {}];
    const obj = {
      advisorId: (this.parentId == this.advisorId) ? 0 : this.advisorId,
      arnRiaDetailsId: this.arnRiaValue,
      parentId: (this.data) ? this.data.parentId : -1
    };
    this.backoffice.Sip_Schemewise_Get(obj).subscribe(
      data => this.getSchemeWiseRes(data),
      err => {
        this.isLoading = false;
        this.filteredArray = [];
      }
    );
  }

  changeCeasedDateDialog(data, parentObj) {
    const dialogRef = this.dialog.open(DateChangeDialogComponent, {
      width: '663px',
      data
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.addCeasesdDate(data, parentObj, result);
          this.ceasedDate = result;
          data.isEdit = true;
        } else {
          data.isEdit = false;
        }
      });
  }


  addCeasesdDate(sip, investor, date) {
    const obj = {
      id: sip.id,
      mutualFundId: sip.mutualFundId,
      amount: sip.amount,
      ceaseDate: this.datePipe.transform(this.caesedForm.controls.ceaseddate.value, 'yyyy/MM/dd'),
    };
    this.backoffice.addCeasedDate(obj).subscribe(
      data => {
        console.log(data);
        investor.applicantList.splice(investor.applicantList.indexOf(sip), 1);
        this.eventService.openSnackBar('Cease date added successfully', 'Dismiss');
      },
      err => {

      }
    );

  }

  getSchemeWiseRes(data) {
    this.isLoading = false;
    if (data) {
      this.category = data;
      console.log('main category::::', this.category);
      this.excelInitClientList();
      this.category.forEach(o => {
        o.showCategory = true;
        this.totalOfSipAmount += o.sipAmount;
        this.totalOfSipCount += o.sipCount;
        this.totalWeight += o.weightInPercentage;
        o.InvestorList = [];
      });
      this.totalWeight = Math.round(this.totalWeight)
      this.filteredArray = [...this.category];
    } else {
      this.filteredArray = [];
    }

    this.showLoader = false;
  }

  filterArray() {
    // No users, empty list.
    if (this.category && this.category.length == 0) {
      this.filteredArray = [];
      return;
    }

    // no search text, all users.
    if (!this.schemeFilter) {
      this.filteredArray = [...this.category]; // keep your usersList immutable
      return;
    }

    const users = [...this.category]; // keep your usersList immutable
    const properties = Object.keys(users[0]); // get user properties

    // check all properties for each user and return user if matching to searchText
    this.filteredArray = users.filter((user) => {
      return properties.find((property) => {
        const valueString = user[property].toString().toLowerCase();
        return valueString.includes(this.schemeFilter.toLowerCase());
      })
        ? user
        : null;
    });

  }

  preventDefault(e) {
    e.preventDefault();
  }

  showSubTableList(index, category, schemeData) {
    schemeData.showCategory = !schemeData.showCategory;
    if (schemeData.showCategory == false) {
      this.selectedCategory = index;
      this.isLoadingCategory = true;
      schemeData.subCatList = [];
      this.subCatList = [];
      schemeData.subCatList = [{}, {}, {}];
      const obj = {
        advisorId: (this.parentId == this.advisorId) ? 0 : this.advisorId,
        arnRiaDetailsId: this.arnRiaValue,
        parentId: (this.data) ? this.data.parentId : -1,
        schemeId: schemeData.mutualFundSchemeMasterId
      };
      this.backoffice.Scheme_Wise_Investor_Get(obj).subscribe(
        data => {
          this.isLoadingCategory = false;
          if (data) {
            console.log('tihs is sub category data:::', data);
            data.forEach(element => {
              element.showSubCategory = true;
              element.mutualFundSchemeMasterId = schemeData.mutualFundSchemeMasterId;
            });
            schemeData.subCatList = data;
            this.subCatList = data;

            this.appendingOfValuesInExcel(data, index, 'investor');

          } else {
            this.subCatList = [];
            schemeData.subCatList = [];
            this.isLoadingCategory = false;
          }
        },
        err => {
          this.subCatList = [];
          schemeData.subCatList = [];
          this.isLoadingCategory = false;
        }
      );
    } else {
      this.removeValuesFromExcel('investor', index);
      if (schemeData.hasOwnProperty('subCatList') && schemeData.subCatList.length !== 0) {
        schemeData.subCatList.forEach(subCatElement => {
          subCatElement.showSubCategory = false;
        });
      }
    }

  }

  removeValuesFromExcel(whichList, index) {
    switch (whichList) {
      case 'investor':
        this.arrayOfExcelData[index].subCatList = [];
        break;
      case 'schemes':
        this.arrayOfExcelData[this.selectedCategory].subCatList[index].schemeList = [];
        break;
      case 'applicant':
        this.arrayOfExcelData[this.selectedCategory].subCatList[this.selectedCategoryApp].schemeList[index].applicantList = [];
        break;
    }
  }

  appendingOfValuesInExcel(iterable, index, choice) {
    let sumAmtTotal = 0;
    let sumWeightInPercTotal = 0;

    switch (choice) {
      case 'investor':
        // categories
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].subCatList.push({
            index: index1 + 1,
            name: element.investorName,
            sipAmount: this.mfService.mutualFundRoundAndFormat(element.sipAmount, 0),
            sipCount: element.sipCount,
            weightInPerc: element.weightInPercentage,
            schemeList: []
          });
          sumAmtTotal += element.sipAmount;
          sumWeightInPercTotal += element.weightInPercentage;
        });
        this.investorTotalList = ['Total', '', sumAmtTotal, '', sumWeightInPercTotal];
        break;
      case 'schemes':
        // sub categories
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedCategory].subCatList[index].schemeList.push({
            name: element.investorName,
            schemeName: element.schemeName,
            folio: element.folioNumber,
            registeredDate: new Date(element.registeredDate),
            fromDate: new Date(element.from_date),
            toDate: new Date(element.to_date),
            toTriggerDay: element.sipTriggerDay,
            frequency: element.frequency,
            amount: this.mfService.mutualFundRoundAndFormat(element.sipAmount, 0),
            weightInPerc: element.weightInPercentage,
          });
          sumAmtTotal += element.sipAmount;
          sumWeightInPercTotal += element.weightInPercentage;
        });
        this.schemeTotalList = ['Total', '', '', '', '', '', '', '', '', sumAmtTotal, sumWeightInPercTotal];
        break;
      // case 'applicant':
      // iterable.forEach((element, index1) => {
      //   this.arrayOfExcelData[this.selectedCategory].subCatList[this.selectedCategoryApp].schemeList[index].applicantList.push({
      //     name: element.investorName,
      //     schemeName: element.schemeName,
      //     folio: element.folioNumber,
      //     registeredDate: new Date(element.registeredDate),
      //     fromDate: new Date(element.from_date),
      //     toDate: new Date(element.to_date),
      //     toTriggerDay: element.sipTriggerDay,
      //     frequency: element.frequency,
      //     amount: this.mfService.mutualFundRoundAndFormat(element.sipAmount, 0),
      //     weightInPerc: element.weightInPercentage,
      //   });
      //   sumAmtTotal += element.sipAmount;
      //   sumWeightInPercTotal += element.weightInPercentage;
      // });
      // this.applicant2TotalList = ['Total', '', '', '', '', '', '', '', '', sumAmtTotal, sumWeightInPercTotal];
      // break;
    }
    console.log(this.arrayOfExcelData);
  }

  showSchemeName(index, subcashowSubcat, ApplicantData) {
    ApplicantData.showSubCategory = !ApplicantData.showSubCategory;
    if (ApplicantData.showSubCategory == false) {
      this.selectedCategoryApp = index;
      this.isLoadingSubCategory = true;
      this.applicantListArr = [];
      ApplicantData.applicantList = [{}, {}, {}];
      const obj = {
        advisorId: (this.parentId == this.advisorId) ? 0 : this.advisorId,
        arnRiaDetailsId: this.arnRiaValue,
        parentId: (this.data) ? this.data.parentId : -1,

        schemeId: ApplicantData.mutualFundSchemeMasterId,
        clientId: ApplicantData.clientId
      };
      this.backoffice.scheme_wise_Applicants_Get(obj).subscribe(
        data => {
          this.isLoadingSubCategory = false;
          if (data) {
            console.log('this is  scheme Data data::', data);
            data.forEach(o => {
              o.isEdit = false;
            });
            ApplicantData.applicantList = data;
            this.applicantListArr = data;
            this.appendingOfValuesInExcel(data, index, 'schemes');
          } else {
            this.applicantListArr = [];
            ApplicantData.applicantList = [];
            this.isLoadingSubCategory = false;
          }
        },
        err => {
          this.applicantListArr = [];
          ApplicantData.applicantList = [];
          this.isLoadingSubCategory = false;
        }
      );
    } else {
      this.removeValuesFromExcel('schemes', index);
      if (ApplicantData.hasOwnProperty('applicantList') && ApplicantData.applicantList.length !== 0) {
        console.log(ApplicantData.schemeList);
      }
    }
  }

  excelInitClientList() {
    let data = {};
    let sumAmtTotal = 0;
    let sumWeightInPercTotal = 0;
    this.category.forEach((element, index1) => {
      data = {
        index: index1 + 1,
        name: element.schemeName,
        sipAmount: this.mfService.mutualFundRoundAndFormat(element.sipAmount, 0),
        sipCount: element.sipCount,
        weightInPerc: element.weightInPercentage,
        subCatList: [],
      };
      this.arrayOfExcelData.push(data);
      sumAmtTotal += element.sipAmount;
      sumWeightInPercTotal += element.weightInPercentage;
    });
    this.amcTotalList = ['Total', '', '', sumAmtTotal, sumWeightInPercTotal];
  }

  exportToExcelSheet(choice, catIndex, investorIndex) {
    switch (choice) {
      case 'scheme-wise':
        this.schemeWiseExcelReport(catIndex);
        break;
      case 'investor-wise':
        this.investorWiseExcelSheet(catIndex);
        break;
      case 'applicant-wise':
        this.applicantWiseExcelReport(catIndex, investorIndex);
        break;
    }

  }

  schemeWiseExcelReport(index) {
    ExcelMisSipService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, this.arrayOfExcelData, 'MIS Report - Scheme wise SIP', 'category-wise-aum-mis', {
      clientList: false,
      subCatList: false,
      schemeList: false
    }, this.amcTotalList);
  }

  investorWiseExcelSheet(index) {
    const copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));
    copyOfExcelData.forEach((element, index1) => {
      if (index1 === index) {
        return;
      } else {
        element.subCatList = [];
      }
    });

    const arrayOfExcelHeaders = this.arrayOfHeaders.slice();
    const arrayOfExcelStyles = this.arrayOfHeaderStyles.slice();

    arrayOfExcelStyles.shift();
    arrayOfExcelHeaders.shift();

    ExcelMisSipService.exportExcel3(arrayOfExcelHeaders, arrayOfExcelStyles, copyOfExcelData[index].subCatList, 'MIS Report - Scheme wise SIP', 'category-wise-aum-mis', {
      clientList: true,
      subCatList: false,
      schemeList: false
    }, this.investorTotalList);
  }

  applicantWiseExcelReport(index, amcIndex) {
    const applicantList = this.arrayOfExcelData[this.selectedCategory].subCatList[this.selectedCategoryApp].schemeList;
    const newarr = [];
    applicantList.forEach(element => {
      newarr.push({
        field1: element.index,
        field2: element.name,
        field3: element.schemeName,
        field4: element.folio,
        field5: new Date(element.registeredDate),
        field6: new Date(element.fromDate),
        field7: new Date(element.toDate),
        field8: element.toTriggerDay,
        field9: element.frequency,
        field10: this.mfService.mutualFundRoundAndFormat(element.amount, 0),
        field11: element.weightInPerc,
      });
    });

    ExcelMisSipService.exportExcel(this.arrayOfHeaderStyles[2], this.arrayOfHeaders[2], newarr, [], 'MIS Report - Scheme wise SIP', this.schemeTotalList);
    // ExcelMisSipService.exportExcel(this.arrayOfHeaderStyles[3], this.arrayOfHeaders[3], newarr, [], 'AMC wise MIS report', this.applicantWiseTotal);
  }
}
