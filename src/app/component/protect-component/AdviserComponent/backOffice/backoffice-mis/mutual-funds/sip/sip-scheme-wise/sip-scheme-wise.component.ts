import { Component, OnInit ,ViewChildren, EventEmitter, Output } from '@angular/core';
import {SipComponent} from '../sip.component';
import { BackOfficeService } from '../../../../back-office.service';
import { AuthService } from 'src/app/auth-service/authService';
import { FormatNumberDirective } from 'src/app/format-number.directive';

@Component({
  selector: 'app-sip-scheme-wise',
  templateUrl: './sip-scheme-wise.component.html',
  styleUrls: ['./sip-scheme-wise.component.scss']
})
export class SipSchemeWiseComponent implements OnInit {
  showLoader=true;
  teamMemberId=2929;
  advisorId: any;
  clientId: any;
  category: any;
  selectedCategory: any;
  InvestorList: any;
  applicantList: any;
  schemeFilter:any;
  isLoading=false;
  @ViewChildren(FormatNumberDirective) formatNumber;
  totalOfSipAmount=0;
  totalOfSipCount=0;
  totalWeight=0;
  filteredArray: any[];
  @Output() changedValue = new EventEmitter();

  constructor(private backoffice:BackOfficeService,public sip:SipComponent) { }

  ngOnInit() {
    this.showLoader = false;
    this.advisorId=AuthService.getAdvisorId();
    this.clientId=AuthService.getClientId();
    this.getSchemeWiseGet();
  }

  aumReport()
  {
    this.changedValue.emit(true);

  //  this.sip.sipComponent=true;
  }
  getSchemeWiseGet(){
    this.isLoading=true;
    this.filteredArray=[{},{},{}]
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      parentId:-1
    }
    this.backoffice.Sip_Schemewise_Get(obj).subscribe(
      data =>this.getSchemeWiseRes(data),
      err=>{
        this.isLoading = false;
      }
    )
  }
  
  getSchemeWiseRes(data) {
    this.isLoading=false;
    console.log("scheme Name", data)
    this.category = data;
    if(this.category){
      this.category.forEach(o => {
        o.showCategory = true;
        this.totalOfSipAmount+=o.sipAmount;
        this.totalOfSipCount+=o.sipCount;
        this.totalWeight+=o.weightInPercentage;
        o.InvestorList=[];
      });
    }
    this.filteredArray = [...this.category];

    this.showLoader = false;
  }
   filterArray() {
    // No users, empty list.
    if (!this.category.length) {
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
    this.filteredArray =  users.filter((user) => {
      return properties.find((property) => {
        const valueString = user[property].toString().toLowerCase();
        return valueString.includes(this.schemeFilter.toLowerCase());
      })
      ? user
      : null;
    });
    
  }
  showSubTableList(index, category,schemeData) {
    schemeData.showCategory=!schemeData.showCategory
    schemeData.InvestorList=[]
    if(schemeData.showCategory==false){
      const obj={
        advisorId:this.advisorId,
        arnRiaDetailsId:-1,
        parentId:-1,
        schemeId:schemeData.mutualFundSchemeMasterId
      }
      this.backoffice.Scheme_Wise_Investor_Get(obj).subscribe(
        data =>{
          if(data){
            data.forEach(element => {
              element.showSubCategory=true;
              element.mutualFundSchemeMasterId=schemeData.mutualFundSchemeMasterId;
            });
            schemeData.InvestorList=data
            console.log(data)
          }
        }
      )
    }
   
    console.log(this.category[index])
    console.log(category)
  }
  showSchemeName(index, subcashowSubcat ,ApplicantData) {
    ApplicantData.showSubCategory=!ApplicantData.showSubCategory
    ApplicantData.applicantList=[];
    if(ApplicantData.showSubCategory==false){
      const obj={
        advisorId:this.advisorId,
        arnRiaDetailsId:-1,
        parentId:-1,

        schemeId: ApplicantData.mutualFundSchemeMasterId,
        clientId:ApplicantData.clientId
      }
      this.backoffice.scheme_wise_Applicants_Get(obj).subscribe(
        data =>{
          if(data){
            ApplicantData.applicantList=data;
            console.log(data)
          }
        }
      )
    }
  }

}
