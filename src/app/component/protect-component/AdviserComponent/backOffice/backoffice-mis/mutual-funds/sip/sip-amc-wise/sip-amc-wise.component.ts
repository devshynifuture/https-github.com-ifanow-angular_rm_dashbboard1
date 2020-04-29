import { Component, OnInit, ViewChildren, Output, EventEmitter } from '@angular/core';
import { BackOfficeService } from '../../../../back-office.service';
import { SipComponent } from '../sip.component';
import { AuthService } from 'src/app/auth-service/authService';
import { FormatNumberDirective } from 'src/app/format-number.directive';
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
  constructor(private backoffice: BackOfficeService, public sip: SipComponent) { }
  teamMemberId = 2929;
  @Output() changedValue = new EventEmitter();

  @ViewChildren(FormatNumberDirective) formatNumber;

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
          }
        }
      )
    }
  }
  showSchemeName(index, subcashowSubcat, investorData) {
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
          }
        }
      )
    }
  }
  showApplicantName(index, subcashowSubcat, applicantData) {
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
}
