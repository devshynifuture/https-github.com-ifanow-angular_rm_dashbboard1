import { Component, OnInit, ViewChildren, Output, EventEmitter } from '@angular/core';
import { BackOfficeService } from '../../../../back-office.service';
import { SipComponent } from '../sip.component';
import { AuthService } from 'src/app/auth-service/authService';
import { FormatNumberDirective } from 'src/app/format-number.directive';
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
  isLoading=false;
  @Output() changedValue = new EventEmitter();
  propertyName: any;
  propertyName2: any;
  reverse=true;
  reverse2=true;
  constructor(private backoffice: BackOfficeService, public sip: SipComponent) { }

  ngOnInit() {
    
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.clientWiseClientName();
  }
  sortBy(applicant,propertyName){
    this.propertyName = propertyName;
    this.reverse = (propertyName !== null && this.propertyName === propertyName) ? !this.reverse : false;
    if (this.reverse === false){
      applicant=applicant.sort((a, b) =>
         a[propertyName] > b[propertyName] ? 1 : (a[propertyName] === b[propertyName] ? 0 : -1)
        );
    }else{
      applicant=applicant.sort((a, b) => 
        a[propertyName] > b[propertyName] ? -1 : (a[propertyName] === b[propertyName] ? 0 : 1)
      );
    }
  }
  sortByApplicant(applicant,propertyName){
    this.propertyName2 = propertyName;
    this.reverse2 = (propertyName !== null && this.propertyName2 === propertyName) ? !this.reverse2 : false;
    if (this.reverse2 === false){
      applicant=applicant.sort((a, b) =>
         a[propertyName] > b[propertyName] ? 1 : (a[propertyName] === b[propertyName] ? 0 : -1)
        );
    }else{
      applicant=applicant.sort((a, b) => 
        a[propertyName] > b[propertyName] ? -1 : (a[propertyName] === b[propertyName] ? 0 : 1)
      );
    }
  }
  aumReport() {
    this.changedValue.emit(true);

    // this.sip.sipComponent = true;
  }
  clientWiseClientName() {
    this.isLoading=true;
    this.filteredArray=[{},{},{}];
    const obj = {
      advisorId: this.advisorId,
      arnRiaDetailsId: -1,
      parentId: -1
    }
    this.backoffice.sipClientWiseClientName(obj).subscribe(
      data => {
        this.isLoading=false;
        if(data){
          this.clientList = data;
          this.clientList.forEach(o => {
            o.showCategory = true;
            this.totalOfSipAmount += o.sipAmount;
            this.totalOfSipCount += o.sipCount;
            this.totalWeight += o.weightInPercentage;
          });
          this.filteredArray = [...this.clientList];
        }else{
          this.filteredArray=[];
        }
       
      },
      err=>{
        this.isLoading = false;
        this.filteredArray=[];
      }
    )
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
    applicantData.applicantList = []
    if (applicantData.showCategory == false) {
      const obj = {
        advisorId: this.advisorId,
        arnRiaDetailsId: -1,
        clientId: applicantData.clientId,
        parentId: -1
      }
      this.backoffice.sipClientWiseApplicant(obj).subscribe(
        data => {
          if (data) {
            data.forEach(o => {
              o.showSubCategory = true;
            });
            applicantData.applicantList = data
            console.log(data)
          }
        }
      )
    }
  }
}
