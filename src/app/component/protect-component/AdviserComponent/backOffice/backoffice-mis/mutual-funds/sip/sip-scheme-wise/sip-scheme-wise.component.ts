import { Component, OnInit ,ViewChildren } from '@angular/core';
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
  @ViewChildren(FormatNumberDirective) formatNumber;
  totalOfSipAmount=0;
  totalOfSipCount=0;
  totalWeight=0;

  constructor(private backoffice:BackOfficeService,public sip:SipComponent) { }

  ngOnInit() {
    this.showLoader = false;
    this.advisorId=AuthService.getAdvisorId();
    this.clientId=AuthService.getClientId();
    this.getSchemeWiseGet();
  }

  aumReport()
  {
   this.sip.sipComponent=true;
  }
  getSchemeWiseGet(){
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      parentId:-1
    }
    this.backoffice.Sip_Schemewise_Get(obj).subscribe(
      data =>this.getSchemeWiseRes(data)
    )
  }
  
  getSchemeWiseRes(data) {
    console.log("scheme Name", data)
    this.category = data;

    this.category.forEach(o => {
      o.showCategory = true;
      this.totalOfSipAmount+=o.sipAmount;
      this.totalOfSipCount+=o.sipCount;
      this.totalWeight+=o.weightInPercentage;
      o.InvestorList=[];
    });
    this.showLoader = false;
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
            data[0].showSubCategory=true
            data[0].mutualFundSchemeMasterId=schemeData.mutualFundSchemeMasterId
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
