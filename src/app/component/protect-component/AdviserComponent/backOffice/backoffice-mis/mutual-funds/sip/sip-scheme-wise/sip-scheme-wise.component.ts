import { Component, OnInit } from '@angular/core';
import {SipComponent} from '../sip.component';
import { BackOfficeService } from '../../../../back-office.service';
import { AuthService } from 'src/app/auth-service/authService';

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
      o.InvestorList=[];
      o.applicantList=[];
    });
    this.showLoader = false;
  }

  showSubTableList(index, category,schemeData) {
    // this.selectedCategory = index
    schemeData.showCategory!=schemeData.showCategory
    // this.category[index].showCategory = (category) ? category = false : category = true;
    // this.category[index].InvestorList=[];
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
        //  data.forEach(o => {
        //     o.showSubCategory = true;
        //   });
          data[0].showSubCategory=true
          schemeData.InvestorList=data[0]
          // this.category[index].InvestorList.push(data[0])
          // this.category.InvestorList.forEach(o => {
          //   o.showSubCategory = true;
          // });
          console.log(data)
        }
      )
    }
   
    console.log(this.category[index])
    console.log(category)
  }
  showSchemeName(index, subcashowSubcat ,ApplicantData) {
    ApplicantData.showSubCategory!=ApplicantData.showSubCategory
    // this.category[this.selectedCategory].InvestorList[index].showSubCategory = (subcashowSubcat) ? subcashowSubcat = false : subcashowSubcat = true;
    ApplicantData.applicantList=[];
    if(ApplicantData.showSubCategory=false){
      const obj={
        advisorId:this.advisorId,
        arnRiaDetailsId:-1,
        parentId:-1,
        schemeId: ApplicantData.mutualFundSchemeMasterId,
        clientId:ApplicantData.clientId
      }
      this.backoffice.scheme_wise_Applicants_Get(obj).subscribe(
        data =>{
          ApplicantData.applicantList=data[0];
          // this.category[this.selectedCategory].applicantList.push(data[0])
          console.log(data)
        }
      )
    }
  }

}
