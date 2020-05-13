import { Component, OnInit, ViewChildren, Output, EventEmitter } from '@angular/core';
import { BackOfficeService } from '../../../../back-office.service';
import { SipComponent } from '../sip.component';
import { AuthService } from 'src/app/auth-service/authService';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelMisSipService } from '../../aum/excel-mis-sip.service';
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
  constructor(private backoffice: BackOfficeService, public sip: SipComponent) { }
  teamMemberId = 2929;
  @Output() changedValue = new EventEmitter();

  @ViewChildren(FormatNumberDirective) formatNumber;

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
      { width: 40, key: 'Registered Date' },
      { width: 40, key: 'From Date' },
      { width: 40, key: 'To Date' },
      { width: 30, key: 'Trigger Day' },
      { width: 30, key: 'Frequency' },
      { width: 30, key: 'Amount' },
      { width: 10, key: '% Weight' },
    ]
  ];
  arrayOfExcelData: any[] = [];


  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.amcGet();
  }

  filterArray() {
    // No users, empty list.
    if (!this.amcList.length) {
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
    this.changedValue.emit(true);
    //  this.sip.sipComponent=true;
  }
  amcGet() {
    this.isLoading = true;
    this.amcList = [{}, {}, {}];
    this.filteredArray = [{}, {}, {}];
    const obj = {
      advisorId: this.advisorId,
      arnRiaDetailsId: -1,
      parentId: -1
    }
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
          this.filteredArray = [...this.amcList];
        } else {
          this.amcList = []
        }
      },
      err => {
        this.isLoading = false;
        this.amcList = []
      }
    )
  }
  showSubTableList(index, category, schemeData) {
    this.selectedCategory = index;
    schemeData.showCategory = !schemeData.showCategory
    schemeData.schemeList = []
    if (schemeData.showCategory == false) {
      const obj = {
        advisorId: this.advisorId,
        amcId: schemeData.amcId,
        arnRiaDetailsId: -1,
        parentId: -1,
        sipAmount: schemeData.sipAmount,
      }

      this.backoffice.GET_SIP_AMC_SCHEME(obj).subscribe(
        data => {
          if (data) {
            data.forEach(element => {
              element.showSubCategory = true;
            });
            schemeData.schemeList = data
            console.log(data)
            this.schemeDataList = data
            if (schemeData.showCategory == false) {
              this.appendingOfValuesInExcel(this.amcList[this.selectedCategory].schemeList, index, 'schemes');
            } else {
              this.removeValuesFromExcel('schemes', index);
            }
          }
        }
      )
    }
  }
  removeValuesFromExcel(whichList, clientIndex) {
    console.log(clientIndex, this.arrayOfExcelData);

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

  appendingOfValuesInExcel(iterable, index, choice) {
    switch (choice) {
      case 'schemes':
        // scheme
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].schemeList.push({
            index: index1 + 1,
            name: element.schemeName,
            sipAmount: element.sipAmount,
            sipCount: element.sipCount,
            totalAum: element.totalAum,
            weightInPerc: element.weightInPercentage,
            investorList: []
          });
        });
        break;
      case 'investor':
        // investor
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedCategory].schemeList[this.selectedAmc].investorList.push({
            index: index1 + 1,
            name: element.investorName,
            sipAmount: element.sipAmount,
            sipCount: element.sipCount,
            weightInPerc: element.weightInPercentage,
            applicantList: []
          });
        });
        break;
      case 'applicant':
        // applicant
        iterable.forEach((element, index1) => {
          console.log(index, iterable, this.arrayOfExcelData);
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
            amount: element.sipAmount,
            weightInPerc: element.weightInPercentage
          });
        });
        break;
    }
    console.log(this.arrayOfExcelData);
  }

  excelInitAmcList() {
    this.amcList.forEach((element, index1) => {
      this.arrayOfExcelData.push({
        index: index1 + 1,
        name: element.amcName,
        sipAmount: element.sipAmount,
        sipCount: element.sipCount,
        totalAum: element.totalAum,
        weightInPerc: element.weightInPercentage,
        schemeList: [],
      });
    });

  }

  showSchemeName(index, subcashowSubcat, investorData) {
    this.selectedAmc = index;
    investorData.showSubCategory = !investorData.showSubCategory
    investorData.investorList = [];
    if (investorData.showSubCategory == false) {
      const obj = {
        advisorId: this.advisorId,
        arnRiaDetailsId: -1,
        parentId: -1,
        schemeId: investorData.mutualFundSchemeMasterId,
        sipAmount: investorData.sipAmount,
      }
      this.backoffice.GET_SIP_INVERSTORS(obj).subscribe(
        data => {
          if (data) {
            data.forEach(element => {
              element.showInvestor = true;
              element.mutualFundSchemeMasterId = investorData.mutualFundSchemeMasterId
            });
            investorData.investorList = data;
            console.log(data)
            if (investorData.showSubCategory == false) {
              this.appendingOfValuesInExcel(this.amcList[this.selectedCategory].schemeList[this.selectedAmc].investorList, index, 'investor');
            } else {
              this.removeValuesFromExcel('investor', index);
            }
          }
        }
      )
    }
  }
  showApplicantName(index, subcashowSubcat, applicantData) {
    this.selectedClientIndex = index;
    this.selectedSubCategory = subcashowSubcat
    applicantData.showInvestor = !applicantData.showInvestor
    applicantData.applicantList = [];
    if (applicantData.showInvestor == false) {
      const obj = {
        advisorId: this.advisorId,
        arnRiaDetailsId: -1,
        clientId: applicantData.clientId,
        parentId: -1,
        schemeId: applicantData.mutualFundSchemeMasterId,
        sipAmount: applicantData.sipAmount
      }
      this.backoffice.Sip_Investors_Applicant_Get(obj).subscribe(
        data => {
          if (data) {
            applicantData.applicantList = data;
            console.log(data)
          }
          if (applicantData.showInvestor == false) {
            this.appendingOfValuesInExcel(this.amcList[this.selectedCategory].schemeList[this.selectedAmc].investorList[this.selectedClientIndex].applicantList, index, 'applicant');
          } else {
            this.removeValuesFromExcel('applicant', index);
          }
        }
      )
    }
  }
  schemeInvestorGet() {
    const obj = {
      advisorId: this.advisorId,
      arnRiaDetailsId: -1,
      parentId: -1,
      schemeId: 122,
      sipAmount: 5000,
    }
    this.backoffice.GET_SIP_INVERSTORS(obj).subscribe(
      data => {
        console.log(data);
      }
    )
  }
  amcSchemeGet() {
    const obj = {
      advisorId: this.advisorId,
      amcId: 123,
      arnRiaDetailsId: -1,
      parentId: -1,
      sipAmount: 5000,
    }
    this.backoffice.GET_SIP_AMC_SCHEME(obj).subscribe(
      data => {
        console.log(data);
      }
    )
  }
  investorApplicantGet() {
    const obj = {
      advisorId: this.advisorId,
      arnRiaDetailsId: -1,
      clientId: this.clientId,
      parentId: -1,
      schemeId: 123,
      sipAmount: 2000
    }
    this.backoffice.Sip_Investors_Applicant_Get(obj).subscribe(
      data => {
        console.log(data);
      }
    )
  }
  exportToExcelSheet(choice, index, amcIndex) {
    switch (choice) {
      case 'amc-wise':
        this.amcWiseExcelReport();
        break;
      case 'scheme-wise':
        this.schemeWiseExcelReport(index);
        break;
      case 'investor-wise':
        this.investorWiseExcelSheet(index);
        break;
      case 'applicant-wise':
        this.applicantWiseExcelReport(index, amcIndex);
        break;
    }

    console.log(this.arrayOfExcelData);
  }
  amcWiseExcelReport() {
    ExcelMisSipService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, this.arrayOfExcelData, 'AMC wise MIS report', 'amc-wise-aum-mis', {
      amcList: false,
      schemeList: false,
      investorList: false,
      applicantList: false
    });
  }

  investorWiseExcelSheet(index) {
    let copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));
    copyOfExcelData.forEach((element, index1) => {
      if (index1 === index) {
        return;
      } else {
        element.investorList = [];
      }
    });

    ExcelMisSipService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, copyOfExcelData, 'AMC wise MIS report', 'amc-wise-aum-mis', {
      amcList: true,
      schemeList: true,
      investorList: false,
      applicantList: false
    });
  }

  schemeWiseExcelReport(index) {
    let copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));

    copyOfExcelData.forEach((element, index1) => {
      if (index1 === index) {
        return;
      } else {
        element.schemeList = [];
      }
    });
    ExcelMisSipService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, copyOfExcelData, 'AMC wise MIS report', 'amc-wise-aum-mis', {
      amcList: true,
      schemeList: false,
      investorList: false,
      applicantList: false
    });
  }

  applicantWiseExcelReport(index, amcIndex) {
    let applicantList = this.arrayOfExcelData[amcIndex].schemeList[index].applicantList;
    let newArray = [];
    applicantList.forEach(element => {
      newArray.push({
        field1: element.name,
        field2: element.balanceUnit,
        field3: element.folioNumber,
        field4: element.totalAum,
        field5: element.weightInPerc
      })
    });

    ExcelMisSipService.exportExcel(this.arrayOfHeaderStyles[2], this.arrayOfHeaders[2], newArray, [], 'AMC wise MIS report');
  }
}
