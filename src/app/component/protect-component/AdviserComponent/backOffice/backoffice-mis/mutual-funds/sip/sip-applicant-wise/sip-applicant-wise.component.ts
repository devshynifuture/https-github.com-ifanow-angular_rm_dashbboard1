import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BackOfficeService } from '../../../../back-office.service';
import {SipComponent} from '../sip.component';
import { AuthService } from 'src/app/auth-service/authService';
@Component({
  selector: 'app-sip-applicant-wise',
  templateUrl: './sip-applicant-wise.component.html',
  styleUrls: ['./sip-applicant-wise.component.scss']
})
export class SipApplicantWiseComponent implements OnInit {
  showLoader=true;
  teamMemberId=2929;
  clientId: any;
  advisorId: any;
  applicantList: any;
  totalOfSipAmount=0;
  totalOfSipCount=0;
  totalWeight =0;
  filteredArray: any[];
  applicantFilter: any;
  isLoading=false;
  @Output() changedValue = new EventEmitter();
  propertyName: any;
  reverse=true;

  constructor(private backoffice:BackOfficeService,public sip:SipComponent) { }

  ngOnInit() {
    this.advisorId=AuthService.getAdvisorId();
    this.clientId=AuthService.getClientId();
    this.schemeWiseApplicantGet();
  }
  sortBy(applicant,propertyName){
    this.propertyName = propertyName;
    this.reverse = (propertyName !== null && this.propertyName === propertyName) ? !this.reverse : false;
    if (this.reverse === false){
      applicant=applicant.sort((a, b) => a[propertyName] > b[propertyName] ? 1 : -1);
    }else{
      applicant=applicant.reverse();
    }
  }
  aumReport()
  {
  this.changedValue.emit(true);

  //  this.sip.sipComponent=true;
  }  
  schemeWiseApplicantGet(){
    this.isLoading=true;
    this.filteredArray=[{},{},{}];
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      parentId:-1,
    }
    this.backoffice.sipApplicantList(obj).subscribe(
      data =>{
        this.isLoading=false;
        console.log("scheme Name", data)
        this.applicantList = data;
        if(this.applicantList){
          this.applicantList.forEach(o => {
            o.showScheme = true;
            this.totalOfSipAmount+=o.totalAum;
            this.totalOfSipCount+=o.count;
            this.totalWeight+=o.weightInPercentage;
            o.InvestorList=[];
          });
        }
        this.filteredArray = [...this.applicantList];
      },
      err=>{
        this.isLoading = false;
      }
    )
  }
  showSubTableList(applicantData) {
    applicantData.showScheme=!applicantData.showScheme
    applicantData.schemeList=[];
    if(applicantData.showScheme==false){
      const obj={
        advisorId:this.advisorId,
        arnRiaDetailsId:-1,
        parentId:-1,
        familyMemberId:applicantData.id,
        totalAum:applicantData.totalAum
      }
      this.backoffice.sipApplicantFolioList(obj).subscribe(
        data =>{
          if(data){
            data.forEach(element => {
              element.name=applicantData.name
            });
            applicantData.schemeList=data
            console.log(data)
          }
        }
      )
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
    this.filteredArray =  users.filter((user) => {
      return properties.find((property) => {
        const valueString = user[property].toString().toLowerCase();
        return valueString.includes(this.applicantFilter.toLowerCase());
      })
      ? user
      : null;
    });
    
  }
}
