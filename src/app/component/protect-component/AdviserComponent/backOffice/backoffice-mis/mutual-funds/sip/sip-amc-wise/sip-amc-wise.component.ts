import { DateChangeDialogComponent } from './../../date-change-dialog/date-change-dialog.component';
import { Component, OnInit, ViewChildren, Output, EventEmitter, Input } from '@angular/core';
import { BackOfficeService } from '../../../../back-office.service';
import { SipComponent } from '../sip.component';
import { AuthService } from 'src/app/auth-service/authService';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelMisSipService } from '../../aum/excel-mis-sip.service';
import { MfServiceService } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service';
import { FormBuilder } from '@angular/forms';
import { EventService } from 'src/app/Data-service/event.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-sip-amc-wise',
  templateUrl: './sip-amc-wise.component.html',
  styleUrls: ['./sip-amc-wise.component.scss']
})
export class SipAmcWiseComponent implements OnInit {
  showLoader = true;
  clientId: any;
  advisorId: any;
  amcList: any;
  totalOfSipAmount = 0;
  totalOfSipCount = 0;
  totalWeight = 0;
  isLoading = false;
  propertyName: any;
  propertyName2: any;
  propertyName3: any;
  propertyName4: any;
  reverse = true;
  reverse2 = true;
  reverse3 = true;
  reverse4 = true;
  filteredArray: any[];
  amcFilter: any;
  selectedCategory: any;
  schemeData: any;
  selectedSubCategory: any;
  selectedClientIndex: any;
  selectedAmc: any;
  schemeDataList: any;
  isLoadingCategory = false;
  isLoadingSubCategory = false;
  isLoadingApplicant = false;
  subCategory: [];
  applicantList: [];
  caesedForm: any;
  parentId: any;
  maxDate = new Date();
  arnRiaList: any = [];
  arnRiaValue: any;
  viewMode: any;
  ceasedDate: any = new Date();

  constructor(
    private datePipe: DatePipe,
    private eventService: EventService,
    private backoffice: BackOfficeService,
    public sip: SipComponent,
    private fb: FormBuilder,
    private mfService: MfServiceService,
    public dialog: MatDialog
  ) { }

  teamMemberId = 2929;
  @Output() changedValue = new EventEmitter();
  @Input() data;

  @ViewChildren(FormatNumberDirective) formatNumber;
  amcWiseTotal = [];
  schemeWiseTotal = [];
  investorWiseTotal = [];
  applicantWiseTotal = [];

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
      'Scheme Name',
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
    ]
  ];
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
      { width: 50, key: 'Scheme Name' },
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
      { width: 45, key: 'Registered Date' },
      { width: 45, key: 'From Date' },
      { width: 45, key: 'To Date' },
      { width: 30, key: 'Trigger Day' },
      { width: 30, key: 'Frequency' },
      { width: 30, key: 'Amount' },
      { width: 10, key: '% Weight' },
    ]
  ];
  arrayOfExcelData: any[] = [];

  ngOnInit() {
    this.caesedForm = this.fb.group({
      ceaseddate: ['']
    });
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.parentId = AuthService.getAdminAdvisorId();
    if (this.data.hasOwnProperty('arnRiaValue') && this.data.hasOwnProperty('viewMode')) {
      this.arnRiaValue = this.data.arnRiaValue;
      this.viewMode = this.data.viewMode;
    } else {
      this.viewMode = 'All';
      this.arnRiaValue = -1;
    }
    this.getArnRiaList();
    this.amcGet();
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
    this.amcGet();
  }

  filterArray() {
    // No users, empty list.
    if (this.amcList && this.amcList.length == 0) {
      this.filteredArray = [];
      return;
    }

    // no search text, all users.
    if (!this.amcFilter) {
      this.filteredArray = [...this.amcList]; // keep your usersList immutable
      return;
    }

    const users = [...this.amcList]; // keep your usersList immutable
    const properties = Object.keys(users[0]); // get user properties

    // check all properties for each user and return user if matching to searchText
    this.filteredArray = users.filter((user) => {
      return properties.find((property) => {
        const valueString = user[property].toString().toLowerCase();
        return valueString.includes(this.amcFilter.toLowerCase());
      })
        ? user
        : null;
    });

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

  sortByScheme(applicant, propertyName) {
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

  sortByInvestor(applicant, propertyName) {
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

  aumReport() {
    this.changedValue.emit({
      value: true,
      arnRiaValue: this.arnRiaValue,
      viewMode: this.viewMode
    });
    this.filteredArray.forEach(element => {
      element.showCategory = true;
    });
    //  this.sip.sipComponent=true;
  }


  changeCeasedDateDialog(data, parentObj) {
    const dialogRef = this.dialog.open(DateChangeDialogComponent, {
      width: '300px',
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

  amcGet() {
    this.arrayOfExcelData = [];
    this.isLoading = true;
    this.totalOfSipAmount = 0;
    this.totalOfSipCount = 0;
    this.totalWeight = 0;
    this.amcList = [{}, {}, {}];
    this.filteredArray = [{}, {}, {}];
    const obj = {
      advisorId: (this.parentId) ? 0 : (this.data.arnRiaId != -1) ? 0 : [this.data.adminAdvisorIds],
      arnRiaDetailsId: this.arnRiaValue,
      parentId: (this.data) ? this.data.parentId : -1
    };
    this.backoffice.GET_SIP_AMC(obj).subscribe(
      data => {
        this.isLoading = false;
        if (data) {
          this.amcList = data;
          this.excelInitAmcList();
          this.amcList.forEach(o => {
            o.showCategory = true;
            this.totalOfSipAmount += o.sipAmount;
            this.totalOfSipCount += o.sipCount;
            this.totalWeight += o.weightInPercentage;

          });
          this.totalWeight = Math.round(this.totalWeight)
          this.filteredArray = [...this.amcList];
        } else {
          this.amcList = [];
          this.filteredArray = [];
        }
      },
      err => {
        this.isLoading = false;
        this.amcList = [];
        this.filteredArray = [];
      }
    );
  }

  showSubTableList(index, category, schemeData) {

    schemeData.showCategory = !schemeData.showCategory;
    if (schemeData.showCategory == false) {
      this.selectedCategory = index;
      this.isLoadingCategory = true;
      schemeData.schemeList = [];
      this.schemeDataList = [];
      schemeData.schemeList = [{}, {}, {}];
      const obj = {
        advisorId: (this.parentId) ? 0 : (this.data.arnRiaId != -1) ? 0 : [this.data.adminAdvisorIds],
        arnRiaDetailsId: this.arnRiaValue,
        parentId: (this.data) ? this.data.parentId : -1,
        sipAmount: schemeData.sipAmount,
        amcId: schemeData.amcId
      };

      this.backoffice.GET_SIP_AMC_SCHEME(obj).subscribe(
        data => {
          if (data) {
            console.log(data);
            this.isLoadingCategory = false;
            data.forEach(element => {
              element.showSubCategory = true;
            });
            schemeData.schemeList = data;
            this.schemeDataList = data;
            if (schemeData.showCategory == false) {
              this.appendingOfValuesInExcel(this.amcList[index].schemeList, index, 'schemes');
            }
          } else {
            schemeData.schemeList = [];
            this.schemeDataList = [];
          }
        },
        err => {
          schemeData.schemeList = [];
          this.schemeDataList = [];

          this.isLoadingCategory = false;
        }
      );
    } else {
      this.removeValuesFromExcel('schemes', index);
      if (schemeData.hasOwnProperty('schemeList') && schemeData.schemeList.length !== 0) {
        schemeData.schemeList.forEach(schemeElement => {
          schemeElement.showSubCategory = true;
        });
      }
    }
  }

  removeValuesFromExcel(whichList, clientIndex) {

    switch (whichList) {
      case 'schemes':
        this.arrayOfExcelData[this.selectedCategory].schemeList = [];
        break;
      case 'investor':
        this.arrayOfExcelData[this.selectedCategory].schemeList[this.selectedAmc].investorList = [];
        break;
      case 'applicant':
        this.arrayOfExcelData[this.selectedCategory].schemeList[this.selectedAmc].investorList[this.selectedClientIndex].applicantList = [];
        break;
    }
  }

  addCeasesdDate(sip, investor, date) {
    const obj = {
      id: sip.id,
      mutualFundId: sip.mutualFundId,
      amount: sip.amount,
      ceaseDate: this.datePipe.transform(date, 'yyyy-MM-dd'),
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

  appendingOfValuesInExcel(iterable, index, choice) {
    let sumWeightInPerc = 0;
    let sumSipAmount = 0;
    let sumSipCount = 0;

    switch (choice) {
      case 'schemes':
        // scheme
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].schemeList.push({
            index: index1 + 1,
            name: element.schemeName,
            sipAmount: this.mfService.mutualFundRoundAndFormat(element.sipAmount, 0),
            sipCount: element.sipCount,
            totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
            weightInPerc: element.weightInPercentage,
            investorList: []
          });
          sumSipAmount += element.sipAmount;
          sumSipCount += element.sipCount;
          sumWeightInPerc += element.weightInPercentage;
        });
        this.schemeWiseTotal = ['Total', '', sumSipAmount, sumSipCount, sumWeightInPerc];
        break;
      case 'investor':
        // investor
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedCategory].schemeList[this.selectedAmc].investorList.push({
            index: index1 + 1,
            name: element.investorName,
            sipAmount: this.mfService.mutualFundRoundAndFormat(element.sipAmount, 0),
            sipCount: element.sipCount,
            weightInPerc: element.weightInPercentage,
            applicantList: []
          });
          sumSipAmount += element.sipAmount;
          sumSipCount += element.sipCount;
          sumWeightInPerc += element.weightInPercentage;
        });
        this.investorWiseTotal = ['Total', '', sumSipAmount, sumSipCount, sumWeightInPerc];
        break;
      case 'applicant':
        // applicant
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedCategory].schemeList[this.selectedAmc].investorList[this.selectedClientIndex].applicantList.push({
            index: index1 + 1,
            name: element.investorName,
            schemeName: element.schemeName,
            folio: element.folioNumber,
            registeredDate: new Date(element.registeredDate),
            fromDate: new Date(element.from_date),
            toDate: new Date(element.to_date),
            triggerDay: element.sipTriggerDay,
            frequency: element.frequency,
            amount: this.mfService.mutualFundRoundAndFormat(element.sipAmount, 0),
            weightInPerc: element.weightInPercentage
          });
          sumSipAmount += element.sipAmount;
          sumWeightInPerc += element.sumWeightInPercentage;
        });
        this.applicantWiseTotal = ['Total', '', '', '', '', '', '', '', '', sumSipAmount, sumWeightInPerc];
        break;
    }
  }

  excelInitAmcList() {
    let sipAmountTotal = 0;
    let sumWeightInPercTotal = 0;
    let sipCountTotal = 0;
    this.amcList.forEach((element, index1) => {
      this.arrayOfExcelData.push({
        index: index1 + 1,
        name: element.amcName,
        sipAmount: this.mfService.mutualFundRoundAndFormat(element.sipAmount, 0),
        sipCount: element.sipCount,
        totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
        weightInPerc: element.weightInPercentage,
        schemeList: [],
      });
      sipAmountTotal += element.sipAmount;
      sipCountTotal += element.sipCount;
      sumWeightInPercTotal += element.weightInPercentage;
    });
    this.amcWiseTotal = ['Total', '', sipAmountTotal, sipCountTotal, sumWeightInPercTotal];
  }

  showSchemeName(index, subcashowSubcat, investorData) {

    this.selectedSubCategory = index;
    investorData.showSubCategory = !investorData.showSubCategory;
    if (investorData.showSubCategory == false) {
      this.selectedAmc = index;
      this.isLoadingSubCategory = true;
      this.subCategory = [];
      investorData.investorList = [];
      investorData.investorList = [{}, {}, {}];
      const obj = {
        advisorId: (this.parentId) ? 0 : (this.data.arnRiaId != -1) ? 0 : [this.data.adminAdvisorIds],
        arnRiaDetailsId: this.arnRiaValue,
        parentId: (this.data) ? this.data.parentId : -1,
        schemeId: investorData.mutualFundSchemeMasterId,
        sipAmount: investorData.sipAmount,
      };
      this.backoffice.GET_SIP_INVERSTORS(obj).subscribe(
        data => {
          this.isLoadingSubCategory = false;
          if (data) {
            console.log('this is some value:::', data);
            data.forEach(element => {
              element.showInvestor = true;
              element.mutualFundSchemeMasterId = investorData.mutualFundSchemeMasterId;
            });
            investorData.investorList = data;
            this.subCategory = data;
            if (investorData.showSubCategory == false) {
              this.appendingOfValuesInExcel(this.amcList[this.selectedCategory].schemeList[index].investorList, index, 'investor');
            }
          } else {
            investorData.investorList = [];
            this.subCategory = [];
          }
        },
        err => {
          investorData.investorList = [];
          this.subCategory = [];
          this.isLoadingSubCategory = false;
        }
      );
    } else {
      this.removeValuesFromExcel('investor', index);
      if (investorData.hasOwnProperty('investorList') && investorData.investorList.length !== 0) {
        investorData.investorList.foreach(investorElement => {
          investorElement.showInvestor = false;
        });
      }
    }
  }

  preventDefault(e) {
    e.preventDefault();
  }

  showApplicantName(index, subcashowSubcat, applicantData) {
    this.selectedSubCategory = subcashowSubcat;
    applicantData.showInvestor = !applicantData.showInvestor;

    if (applicantData.showInvestor == false) {
      this.selectedClientIndex = index;
      this.isLoadingApplicant = true;
      applicantData.applicantList = [];
      this.applicantList = [];
      applicantData.applicantList = [{}, {}, {}];
      const obj = {
        clientId: applicantData.clientId,
        schemeId: applicantData.mutualFundSchemeMasterId,
        sipAmount: applicantData.sipAmount,
        advisorId: (this.parentId) ? 0 : (this.data.arnRiaId != -1) ? 0 : [this.data.adminAdvisorIds],
        arnRiaDetailsId: this.arnRiaValue,
        parentId: (this.data) ? this.data.parentId : -1
      };
      this.backoffice.Sip_Investors_Applicant_Get(obj).subscribe(
        data => {
          this.isLoadingApplicant = false;
          if (data) {
            data.forEach(o => {
              o.isEdit = false;
            });
            applicantData.applicantList = data;
            this.applicantList = data;
          } else {
            applicantData.applicantList = [];
            this.applicantList = [];
          }
          if (applicantData.showInvestor == false) {
            this.appendingOfValuesInExcel(this.amcList[this.selectedCategory].schemeList[this.selectedAmc].investorList[this.selectedClientIndex].applicantList, index, 'applicant');
          }
        },
        err => {
          this.applicantList = [];
          applicantData.applicantList = [];
          this.isLoadingApplicant = false;
        }
      );
    } else {
      this.removeValuesFromExcel('applicant', index);
    }
  }

  /* schemeInvestorGet() {
     const obj = {
       advisorId: (this.parentId == this.advisorId) ? 0 : (this.data.arnRiaId != -1) ? 0 : [this.data.adminAdvisorIds],
       arnRiaDetailsId: (this.data) ? this.data.arnRiaId : -1,
       parentId: (this.data) ? this.data.parentId : -1,
       schemeId: 122,
       sipAmount: 5000,
     }
     this.backoffice.GET_SIP_INVERSTORS(obj).subscribe(
       data => {
       }
     )
   }*/
  // amcSchemeGet() {
  //   const obj = {
  //     amcId: 123,
  //     sipAmount: 5000,
  //     advisorId: (this.parentId == this.advisorId) ? 0 : this.advisorId,
  //     arnRiaDetailsId: (this.data) ? this.data.arnRiaId : -1,
  //     parentId: (this.data) ? this.data.parentId : -1
  //   }
  //   this.backoffice.GET_SIP_AMC_SCHEME(obj).subscribe(
  //     data => {
  //     }
  //   )
  // }
  // investorApplicantGet() {
  //   const obj = {
  //     clientId: this.clientId,
  //     schemeId: 123,
  //     sipAmount: 2000,
  //     advisorId: (this.parentId == this.advisorId) ? 0 : (this.data.arnRiaId != -1) ? 0 : [this.data.adminAdvisorIds],
  //     arnRiaDetailsId: (this.data) ? this.data.arnRiaId : -1,
  //     parentId: (this.data) ? this.data.parentId : -1
  //   }
  //   this.backoffice.Sip_Investors_Applicant_Get(obj).subscribe(
  //     data => {
  //     }
  //   )
  // }
  exportToExcelSheet(choice, catIndex, subCatIndex, investorIndex) {
    switch (choice) {
      case 'amc-wise':
        this.amcWiseExcelReport();
        break;
      case 'scheme-wise':
        this.schemeWiseExcelReport(catIndex);
        break;
      case 'investor-wise':
        this.investorWiseExcelSheet(catIndex, subCatIndex);
        break;
      case 'applicant-wise':
        this.applicantWiseExcelReport(catIndex);
        break;
    }

  }

  amcWiseExcelReport() {
    ExcelMisSipService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, this.arrayOfExcelData, 'MIS report - AMC wise SIP', 'amc-wise-aum-mis', {
      amcList: false,
      schemeList: false,
      investorList: false,
      applicantList: false
    }, this.amcWiseTotal);
  }

  schemeWiseExcelReport(catIndex) {
    const copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));

    copyOfExcelData.forEach((element, index1) => {
      if (index1 === catIndex) {
        return;
      } else {
        element.schemeList = [];
      }
    });

    const arrayOfExcelHeaders = this.arrayOfHeaders.slice();
    const arrayOfExcelStyles = this.arrayOfHeaderStyles.slice();
    arrayOfExcelHeaders.shift();
    arrayOfExcelStyles.shift();

    ExcelMisSipService.exportExcel3(arrayOfExcelHeaders, arrayOfExcelStyles, copyOfExcelData[catIndex].schemeList, 'MIS report - AMC wise SIP', 'amc-wise-aum-mis', {
      amcList: true,
      schemeList: false,
      investorList: false,
      applicantList: false
    }, this.schemeWiseTotal);
  }

  investorWiseExcelSheet(catIndex, subCatIndex) {
    const copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));
    copyOfExcelData.forEach((element, index1) => {
      if (element.hasOwnProperty('schemeList') && element.schemeList.length !== 0) {
        element.schemeList.forEach((element, index2) => {
          if (catIndex === index2) {
            return;
          } else {
            element.investorList = [];
          }
        });
      }
    });

    const arrayOfExcelHeaders = this.arrayOfHeaders.slice();
    const arrayOfExcelStyles = this.arrayOfHeaderStyles.slice();

    arrayOfExcelHeaders.shift();
    arrayOfExcelHeaders.shift();
    arrayOfExcelStyles.shift();
    arrayOfExcelStyles.shift();

    ExcelMisSipService.exportExcel4(arrayOfExcelHeaders, arrayOfExcelStyles, copyOfExcelData[catIndex].schemeList[subCatIndex].investorList, 'MIS report - AMC wise SIP', 'amc-wise-aum-mis', {
      amcList: true,
      schemeList: true,
      investorList: false,
      applicantList: false
    }, this.investorWiseTotal);
  }

  applicantWiseExcelReport(index) {
    const applicantList = this.arrayOfExcelData[this.selectedCategory].schemeList[this.selectedAmc].investorList[this.selectedClientIndex].applicantList;
    const newarr = [];
    let sumSipAmtTotal = 0;
    let sumWeightInPercTotal = 0;
    applicantList.forEach((element, index1) => {
      newarr.push({
        field1: index1 + 1,
        field2: element.name,
        field3: element.schemeName,
        field4: element.folio,
        field5: new Date(element.registeredDate),
        field6: new Date(element.fromDate),
        field7: new Date(element.toDate),
        field8: element.triggerDay,
        field9: element.frequency,
        field10: this.mfService.mutualFundRoundAndFormat(element.amount, 0),
        field11: element.weightInPerc
      });
      sumSipAmtTotal += element.amount;
      sumWeightInPercTotal += element.weightInPerc;
    });
    this.applicantWiseTotal = ['', '', '', '', '', '', '', '', 'Total', sumSipAmtTotal, sumWeightInPercTotal];
    ExcelMisSipService.exportExcel(this.arrayOfHeaderStyles[3], this.arrayOfHeaders[3], newarr, [], 'MIS report - AMC wise SIP', this.applicantWiseTotal);
    // ExcelMisService.exportExcel(this.arrayOfHeaderStyles[3], this.arrayOfHeaders[3], newarr, [], 'Applicant Wise MIS Report', this.applicantWiseTotalArr);
  }
}
