import { Component, OnInit } from '@angular/core';
import { BackOfficeService } from '../../../../back-office.service';
import {SipComponent} from '../sip.component';
import { AuthService } from 'src/app/auth-service/authService';
@Component({
  selector: 'app-sip-amc-wise',
  templateUrl: './sip-amc-wise.component.html',
  styleUrls: ['./sip-amc-wise.component.scss']
})
export class SipAmcWiseComponent implements OnInit {
  showLoader=true;
  clientId: any;
  advisorId: any;
  amcList: any;
  constructor(private backoffice:BackOfficeService,public sip:SipComponent) { }
  teamMemberId=2929;

  ngOnInit() {
    this.showLoader = false;
    this.advisorId=AuthService.getAdvisorId();
    this.clientId=AuthService.getClientId();
    this.amcGet();
    this.amcSchemeGet();
    this.schemeInvestorGet();
    this.investorApplicantGet();
  }

  aumReport()
  {
   this.sip.sipComponent=true;
  }  
  amcGet(){
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      parentId:-1
    }
    this.backoffice.GET_SIP_AMC(obj).subscribe(
      data =>{
        this.amcList=data;
        this.amcList.forEach(o => {
          o.showCategory = true;
        });
        console.log(data);
      }
    )
  }
  schemeInvestorGet(){
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      parentId:-1,
      schemeId:122,
      sipAmount:5000,
    }
    this.backoffice.GET_SIP_INVERSTORS(obj).subscribe(
      data =>{
        console.log(data);
      }
    )
  }
  amcSchemeGet(){
    const obj={
      advisorId:this.advisorId,
      amcId:123,
      arnRiaDetailsId:-1,
      parentId:-1,
      sipAmount:5000,
    }
    this.backoffice.GET_SIP_AMC_SCHEME(obj).subscribe(
      data =>{
        console.log(data);
      }
    )
  }
  investorApplicantGet(){
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      clientId:this.clientId,
      parentId:-1,
      schemeId:123,
      sipAmount:2000
    }
    this.backoffice.Sip_Investors_Applicant_Get(obj).subscribe(
      data =>{
        console.log(data);
      }
    )
  }
}
