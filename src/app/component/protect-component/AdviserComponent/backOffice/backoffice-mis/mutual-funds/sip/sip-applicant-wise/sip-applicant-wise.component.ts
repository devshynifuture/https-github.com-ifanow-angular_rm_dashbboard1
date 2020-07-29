import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { BackOfficeService } from '../../../../back-office.service';
import { SipComponent } from '../sip.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ExcelMisSipService } from '../../aum/excel-mis-sip.service';
import { FormBuilder } from '@angular/forms';
import { MfServiceService } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service';
import { EventService } from 'src/app/Data-service/event.service';
import { DatePipe } from '@angular/common';
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
  @Input() data;

  propertyName: any;
  propertyName2: any;
  reverse = true;
  reverse2 = true;
  maxDate = new Date();
  clientTotalArr = [];
  applicantTotalArr = [];
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
  caesedForm: any;
  parentId: any;
  arnRiaList: any = [];
  arnRiaValue: any;
  viewMode: any;

  constructor(private datePipe: DatePipe, private backoffice: BackOfficeService, public sip: SipComponent, private fb: FormBuilder, private mfService: MfServiceService, private eventService: EventService) { }

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
      this.viewMode = "All";
      this.arnRiaValue = -1;
    }
    this.getArnRiaList();
    this.schemeWiseApplicantGet();
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
    this.schemeWiseApplicantGet();
  }
  getFormControl() {
    return this.caesedForm.controls;
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
    this.filteredArray.forEach(element => {
      element.showCategory = true
    });
    //  this.sip.sipComponent=true;
  }
  schemeWiseApplicantGet() {
    this.arrayOfExcelData = [];
    this.isLoading = true;
    this.filteredArray = [{}, {}, {}];
    const obj = {
      advisorId: (this.parentId == this.advisorId) ? 0 : this.advisorId,
      arnRiaDetailsId: (this.data) ? this.data.arnRiaId : -1,
      parentId: (this.data) ? this.data.parentId : -1
    }
    this.backoffice.sipApplicantList(obj).subscribe(
      data => {
        this.isLoading = false;
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
    applicantData.showScheme = !applicantData.showScheme

    if (applicantData.showScheme == false) {
      this.selectedClient = index;
      this.isLoadingApplicant = true
      applicantData.schemeList = [];
      this.applicantListArr = []
      applicantData.schemeList = [{}, {}, {}];
      const obj = {
        advisorId: (this.parentId == this.advisorId) ? 0 : this.advisorId,
        arnRiaDetailsId: (this.data) ? this.data.arnRiaId : -1,
        parentId: (this.data) ? this.data.parentId : -1,
        familyMemberId: applicantData.id,
        totalAum: applicantData.totalAum,
        clientId: applicantData.clientId
      }
      this.backoffice.sipApplicantFolioList(obj).subscribe(
        data => {
          if (data) {
            this.isLoadingApplicant = false
            data.forEach(element => {
              element.name = applicantData.name
              element.isEdit = false;
            });
            applicantData.schemeList = data
            this.applicantListArr = data
            if (applicantData.showScheme == false) {
              this.appendingOfValuesInExcel(data, index, 'applicant');
            }
          } else {
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
    } else {
      this.removeValuesFromExcel('applicant', index);
    }
  }
  clientWiseExcelSheet(index) {
    ExcelMisSipService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, this.arrayOfExcelData, 'MIS Report - Applicant wise SIP', 'client-wise-aum-mis', {
      clientList: false,
      investorList: false,
      schemeList: false,
      schemeFolioList: false
    }, this.clientTotalArr);
  }
  addCeasesdDate(sip, investor, date) {
    var obj = {
      id: sip.id,
      mutualFundId: sip.mutualFundId,
      amount: sip.amount,
      ceaseDate: this.datePipe.transform(this.caesedForm.controls.ceaseddate.value, 'yyyy/MM/dd'),
    }
    this.backoffice.addCeasedDate(obj).subscribe(
      data => {
        console.log(data);
        investor.schemeList.splice(investor.schemeList.indexOf(sip), 1);
        this.eventService.openSnackBar('Cease date added successfully', 'Dismiss');
      },
      err => {

      }
    )

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
    let investorList = this.arrayOfExcelData[index].investorList;

    let newarr = [];
    investorList.forEach((element, index1) => {
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
        field11: element.weightInPerc,
      });
    });

    ExcelMisSipService.exportExcel(this.arrayOfHeaderStyles[1], this.arrayOfHeaders[1], newarr, [], 'MIS - Report Applicant wise SIP', this.applicantTotalArr);
    // ExcelMisService.exportExcel(this.arrayOfHeaderStyles[3], this.arrayOfHeaders[3], newarr, [], 'Scheme Folio Wise', this.scheme2WiseTotal);
  }
  excelInitClientList() {
    let sumAmtTotal = 0;
    let sumWeightInPerc = 0;
    let data = {};
    this.applicantList.forEach((element, index1) => {
      data = {
        index: index1 + 1,
        name: element.name,
        sipAmount: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
        weightInPerc: element.weightInPercentage,
        investorList: [],
      }
      sumAmtTotal += element.totalAum;
      sumWeightInPerc += element.weightInPercentage;
      this.arrayOfExcelData.push(data);
    })
    this.clientTotalArr = ['Total', '', sumAmtTotal, sumWeightInPerc];
  }
  preventDefault(e) {
    e.preventDefault();
  }
  appendingOfValuesInExcel(iterable, index, choice) {
    let sumAmtTotal = 0;
    let sumWeightInPerc = 0;
    switch (choice) {
      case 'applicant':
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
            amount: this.mfService.mutualFundRoundAndFormat(element.amount, 0),
            weightInPerc: element.weightInPercentage,
            schemeList: [],
          });
          sumAmtTotal += element.amount;
          sumWeightInPerc += element.weightInPercentage
        });
        this.applicantTotalArr = ['Total', '', '', '', '', '', '', '', '', sumAmtTotal, sumWeightInPerc];
        break;
    }
  }
  removeValuesFromExcel(whichList, index) {

    switch (whichList) {
      case 'investor':
        this.arrayOfExcelData[index].investorList = [];
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
