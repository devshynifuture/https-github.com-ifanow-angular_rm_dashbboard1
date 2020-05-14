import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BackOfficeService } from '../../../../back-office.service';
import { SipComponent } from '../sip.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ExcelMisSipService } from '../../aum/excel-mis-sip.service';
@Component({
  selector: 'app-sip-applicant-wise',
  templateUrl: './sip-applicant-wise.component.html',
  styleUrls: ['./sip-applicant-wise.component.scss']
})
export class SipApplicantWiseComponent implements OnInit {
  showLoader = true;
  teamMemberId = 2929;
  clientId: any;
  advisorId: any;
  applicantList: any;
  totalOfSipAmount = 0;
  totalOfSipCount = 0;
  totalWeight = 0;
  filteredArray: any[];
  applicantFilter: any;
  isLoading = false;
  @Output() changedValue = new EventEmitter();
  propertyName: any;
  propertyName2: any;
  reverse = true;
  reverse2 = true;
  arrayOfExcelData: any[] = [];
  arrayOfHeaders: any[][] = [
    [
      'Sr. No.',
      'Client Name',
      'SIP Amount',
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
  arrayOfHeaderStyles: any[][] = [
    [
      { width: 10, key: 'Sr. No.' },
      { width: 50, key: 'Client Name' },
      { width: 30, key: 'SIP Amount' },
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
  selectedClient: any;
  isLoadingApplicant: boolean = false;
  applicantListArr: any[];

  constructor(private backoffice: BackOfficeService, public sip: SipComponent) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.schemeWiseApplicantGet();
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
  sortByApplicant(applicant, propertyName) {
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
  aumReport() {
    this.changedValue.emit(true);

    //  this.sip.sipComponent=true;
  }
  schemeWiseApplicantGet() {
    this.isLoading = true;
    this.filteredArray = [{}, {}, {}];
    const obj = {
      advisorId: this.advisorId,
      arnRiaDetailsId: -1,
      parentId: -1,
    }
    this.backoffice.sipApplicantList(obj).subscribe(
      data => {
        this.isLoading = false;
        console.log("scheme Name", data)
        if (data) {
          this.applicantList = data;
          this.excelInitClientList()
          this.applicantList.forEach(o => {
            o.showScheme = true;
            this.totalOfSipAmount += o.totalAum;
            this.totalOfSipCount += o.count;
            this.totalWeight += o.weightInPercentage;
            o.InvestorList = [];
          });
          this.filteredArray = [...this.applicantList];
        } else {
          this.filteredArray = [];
        }
      },
      err => {
        this.isLoading = false;
        this.filteredArray = [];
      }
    )
  }
  showSubTableList(index, applicantData) {
    this.isLoadingApplicant = true
    applicantData.showScheme = !applicantData.showScheme
    applicantData.schemeList = [];
    this.applicantListArr = []
    applicantData.schemeList = [{}, {}, {}];
    if (applicantData.showScheme == false) {
      const obj = {
        advisorId: this.advisorId,
        arnRiaDetailsId: -1,
        parentId: -1,
        familyMemberId: applicantData.id,
        totalAum: applicantData.totalAum
      }
      this.backoffice.sipApplicantFolioList(obj).subscribe(
        data => {
          if (data) {
            this.isLoadingApplicant = false
            data.forEach(element => {
              element.name = applicantData.name
            });
            applicantData.schemeList = data
            this.applicantListArr = data
            if (applicantData.showCategory == false) {
              this.appendingOfValuesInExcel(data, index, 'applicant');
            } else {
              this.removeValuesFromExcel('applicant', index);
            }
            console.log(data)
          }else{
            applicantData.schemeList = [];
            this.applicantListArr = []
            this.isLoadingApplicant = false
          }
        },
        err => {
          applicantData.schemeList = [];
          this.applicantListArr = []
          this.isLoadingApplicant = false
        }
      )
    }
  }
  clientWiseExcelSheet(index) {
    ExcelMisSipService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, this.arrayOfExcelData, 'Client wise MIS Report', 'client-wise-aum-mis', {
      clientList: false,
      investorList: false,
      schemeList: false,
      schemeFolioList: false
    });
  }
  exportToExcelSheet(choice, index) {
    switch (choice) {
      case 'client-wise':
        this.clientWiseExcelSheet(index);
        break;
      case 'investor-wise':
        this.investorWiseExcelSheet(index);
        break;
    }
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

    ExcelMisSipService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, copyOfExcelData, 'applicant-wise-aum-mis', 'applicant-wise-aum-mis', {
      clientList: true,
      investorList: false,
      schemeList: false,
      schemeFolioList: false
    });
  }
  excelInitClientList() {
    let data = {};
    this.applicantList.forEach((element, index1) => {
      data = {
        index: index1 + 1,
        name: element.name,
        sipAmount: element.totalAum,
        weightInPerc: element.weightInPercentage,
        investorList: [],
      }
      this.arrayOfExcelData.push(data);
    })
  }
  appendingOfValuesInExcel(iterable, index, choice) {
    switch (choice) {
      case 'applicant':
        console.log(iterable, this.arrayOfExcelData, index);
        // investor
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].investorList.push({
            index: index1 + 1,
            name: element.name,
            schemeName: element.schemeName,
            folio: element.folioNumber,
            registeredDate: new Date(element.registeredDate),
            fromDate: new Date(element.from_date),
            toDate: new Date(element.to_date),
            triggerDay: element.sipTriggerDay,
            frequency: element.frequency,
            amount: element.sipAmount,
            weightInPerc: element.weightInPercentage,
            schemeList: [],
          });
        });
        break;
      case 'schemes':
        // schemes
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedClient].investorList[index].schemeList.push({
            index: index1 + 1,
            name: element.schemeName,
            totalAum: element.totalAum,
            weightInPerc: element.weightInPercentage,
            schemeFolioList: []
          });
        });
        break;
    }
    console.log(this.arrayOfExcelData);
  }
  removeValuesFromExcel(whichList, index) {

    switch (whichList) {
      case 'investor':
        this.arrayOfExcelData[index].investorList = [];
        break;
      case 'schemes':
        this.arrayOfExcelData[this.selectedClient].investorList[index].schemeList = [];
        break;
    }
  }
  filterArray() {
    // No users, empty list.
    if (!this.applicantList.length) {
      this.filteredArray = [];
      return;
    }

    // no search text, all users.
    if (!this.applicantFilter) {
      this.filteredArray = [...this.applicantList]; // keep your usersList immutable
      return;
    }

    const users = [...this.applicantList]; // keep your usersList immutable
    const properties = Object.keys(users[0]); // get user properties

    // check all properties for each user and return user if matching to searchText
    this.filteredArray = users.filter((user) => {
      return properties.find((property) => {
        const valueString = user[property].toString().toLowerCase();
        return valueString.includes(this.applicantFilter.toLowerCase());
      })
        ? user
        : null;
    });

  }
}
