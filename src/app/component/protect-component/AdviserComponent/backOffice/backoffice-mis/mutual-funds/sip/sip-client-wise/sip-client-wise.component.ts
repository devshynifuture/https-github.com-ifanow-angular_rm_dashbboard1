import { Component, OnInit, ViewChildren, Output, EventEmitter, Input } from '@angular/core';
import { BackOfficeService } from '../../../../back-office.service';
import { SipComponent } from '../sip.component';
import { AuthService } from 'src/app/auth-service/authService';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelMisSipService } from '../../aum/excel-mis-sip.service';
import { MfServiceService } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EventService } from 'src/app/Data-service/event.service';
@Component({
  selector: 'app-sip-client-wise',
  templateUrl: './sip-client-wise.component.html',
  styleUrls: ['./sip-client-wise.component.scss']
})
export class SipClientWiseComponent implements OnInit {
  showLoader = true;
  clientId: any;
  teamMemberId = 2929;
  advisorId: any;
  clientList: any;
  @ViewChildren(FormatNumberDirective) formatNumber;
  totalOfSipAmount = 0;
  totalOfSipCount = 0;
  totalWeight = 0
  clientFilter: any;
  filteredArray: any[];
  isLoading = false;
  @Output() changedValue = new EventEmitter();
  @Input() data;
  maxDate = new Date();

  propertyName: any;
  propertyName2: any;
  reverse = true;
  reverse2 = true;
  arrayOfExcelData: any[] = [];
  clientTotalArray = [];
  applicantTotalArray = [];
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
      { width: 40, key: 'Registered Date' },
      { width: 40, key: 'From Date' },
      { width: 40, key: 'To Date' },
      { width: 30, key: 'Trigger Day' },
      { width: 30, key: 'Frequency' },
      { width: 30, key: 'Amount' },
      { width: 10, key: '% Weight' },
    ]
  ];
  selectedClient: any;
  isLoadingApplicant: boolean;
  applicantList: any;
  caesedForm: any;
  parentId: any;
  arnRiaList = [];
  arnRiaValue: any;
  viewMode: any;

  constructor(private datePipe: DatePipe, private eventService: EventService, private backoffice: BackOfficeService, public sip: SipComponent, private fb: FormBuilder, private mfService: MfServiceService) { }



  ngOnInit() {
    this.caesedForm = this.fb.group({
      ceaseddate: ['']
    });
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
    this.clientWiseClientName();
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
    this.clientWiseClientName();
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
  }
  exportToExcelSheet(choice, catIndex) {
    switch (choice) {
      case 'client-wise':
        this.clientWiseExcelSheet(catIndex);
        break;
      case 'investor-wise':
        this.investorWiseExcelSheet(catIndex);
        break;
    }
  }
  excelInitClientList() {
    let data = {};
    let sumAmtTotal = 0;
    let sumWeightInPercTotal = 0;
    this.clientList.forEach((element, index1) => {
      data = {
        index: index1 + 1,
        name: element.investorName,
        sipAmount: this.mfService.mutualFundRoundAndFormat(element.sipAmount, 0),
        weightInPerc: element.weightInPercentage,
        investorList: [],
      }
      sumAmtTotal += element.sipAmount;
      sumWeightInPercTotal += element.weightInPercentage;
      this.arrayOfExcelData.push(data);
    });
    this.clientTotalArray = ['Total', '', sumAmtTotal, sumWeightInPercTotal];
  }

  clientWiseExcelSheet(index) {
    ExcelMisSipService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, this.arrayOfExcelData, 'MIS Report - Client wise SIP', 'client-wise-aum-mis', {
      clientList: false,
      investorList: false,
      schemeList: false,
      schemeFolioList: false
    }, this.clientTotalArray);
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
        investor.applicantList.splice(investor.applicantList.indexOf(sip), 1);
        this.eventService.openSnackBar('Cease date added successfully', 'Dismiss');
      },
      err => {

      }
    )

  }
  investorWiseExcelSheet(catIndex) {
    let copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));
    copyOfExcelData.forEach((element, index1) => {
      if (index1 === catIndex) {
        return;
      } else {
        element.investorList = [];
      }
    });
    let arrayOfExcelHeaders = this.arrayOfHeaders.slice();
    let arrayOfExcelStyles = this.arrayOfHeaders.slice();

    arrayOfExcelHeaders.shift();
    arrayOfExcelStyles.shift();

    ExcelMisSipService.exportExcel3(arrayOfExcelHeaders, arrayOfExcelStyles, copyOfExcelData[catIndex].investorList, 'MIS Report - Client wise SIP', 'client-wise-aum-mis', {
      clientList: true,
      investorList: false,
      schemeList: false,
      schemeFolioList: false
    });
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

  clientWiseClientName() {
    this.arrayOfExcelData = [];
    this.isLoading = true;
    this.filteredArray = [{}, {}, {}];
    const obj = {
      advisorId: (this.parentId) ? 0 : (this.data.arnRiaId != -1) ? 0 : [this.data.adminAdvisorIds],
      arnRiaDetailsId: (this.data) ? this.data.arnRiaId : -1,
      parentId: (this.data) ? this.data.parentId : -1
    }
    this.backoffice.sipClientWiseClientName(obj).subscribe(
      data => {
        this.isLoading = false;
        if (data) {
          this.clientList = data;
          this.excelInitClientList();
          this.clientList.forEach(o => {
            o.showCategory = true;
            this.totalOfSipAmount += o.sipAmount;
            this.totalOfSipCount += o.sipCount;
            this.totalWeight += o.weightInPercentage;
          });
          this.filteredArray = [...this.clientList];
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
  preventDefault(e) {
    e.preventDefault();
  }
  appendingOfValuesInExcel(iterable, index, choice) {
    let sumAmtTotal = 0;
    let sumWeightInPercTotal = 0;
    switch (choice) {
      case 'applicant':
        // investor
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].investorList.push({
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
            weightInPerc: element.weightInPercentage,
            schemeList: [],
          });
          sumAmtTotal += element.sipAmount;
          sumWeightInPercTotal += element.weightInPercentage;
        });
        this.applicantTotalArray = ['Total', '', '', '', '', '', '', '', '', sumAmtTotal, sumWeightInPercTotal];
        break;
      case 'schemes':
        // schemes
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedClient].investorList[index].schemeList.push({
            index: index1 + 1,
            name: element.schemeName,
            totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
            weightInPerc: element.weightInPercentage,
            schemeFolioList: []
          });
        });
        break;
    }
  }
  filterArray() {
    // No users, empty list.
    if (!this.clientList.length) {
      this.filteredArray = [];
      return;
    }

    // no search text, all users.
    if (!this.clientFilter) {
      this.filteredArray = [...this.clientList]; // keep your usersList immutable
      return;
    }

    const users = [...this.clientList]; // keep your usersList immutable
    const properties = Object.keys(users[0]); // get user properties

    // check all properties for each user and return user if matching to searchText
    this.filteredArray = users.filter((user) => {
      return properties.find((property) => {
        const valueString = user[property].toString().toLowerCase();
        return valueString.includes(this.clientFilter.toLowerCase());
      })
        ? user
        : null;
    });

  }
  showSubTableList(index, category, applicantData) {
    applicantData.showCategory = !applicantData.showCategory
    if (applicantData.showCategory == false) {
      this.isLoadingApplicant = true;
      applicantData.applicantList = [];
      this.applicantList = [];
      applicantData.applicantList = [{}, {}, {}];
      const obj = {
        clientId: applicantData.clientId,
        advisorId: (this.parentId) ? 0 : (this.data.arnRiaId != -1) ? 0 : [this.data.adminAdvisorIds],
        arnRiaDetailsId: (this.data) ? this.data.arnRiaId : -1,
        parentId: (this.data) ? this.data.parentId : -1
      }
      this.backoffice.sipClientWiseApplicant(obj).subscribe(
        data => {
          this.isLoadingApplicant = false
          if (data) {
            data.forEach(o => {
              o.showSubCategory = true;
              o.isEdit = false;
            });
            applicantData.applicantList = data
            this.applicantList = data
            if (applicantData.showCategory == false) {
              this.appendingOfValuesInExcel(data, index, 'applicant');
            }
          }
        },
        err => {
          applicantData.applicantList = [];
          this.applicantList = []
          this.isLoadingApplicant = false
        }
      )
    } else {
      this.removeValuesFromExcel('applicant', index);
    }
  }
}
