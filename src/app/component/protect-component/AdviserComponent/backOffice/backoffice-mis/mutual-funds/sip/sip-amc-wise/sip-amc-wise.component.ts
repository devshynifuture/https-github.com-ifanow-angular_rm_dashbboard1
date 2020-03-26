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
  constructor(private backoffice:BackOfficeService,public sip:SipComponent) { }
  teamMemberId=2929;

  ngOnInit() {
    this.showLoader = false;
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
    this.backoffice.GET_SIP_AMC(this.teamMemberId).subscribe(
      data =>{
        console.log(data);
      }
    )
  }
  schemeInvestorGet(){
    const obj={
      schemeCode:'abc-123',
      sipAmount:5000,
      teamMemberId:this.teamMemberId
    }
    this.backoffice.GET_SIP_INVERSTORS(obj).subscribe(
      data =>{
        console.log(data);
      }
    )
  }
  amcSchemeGet(){
    const obj={
      amcName:'Aditya birla',
      sipAmount:5000,
      teamMemberId:this.teamMemberId
    }
    this.backoffice.GET_SIP_AMC_SCHEME(obj).subscribe(
      data =>{
        console.log(data);
      }
    )
  }
  investorApplicantGet(){
    const obj={
      clientId:this.clientId,
      schemeCode:'abc-123',
      sipAmount:5000,
      teamMemberId:this.teamMemberId
    }
    this.backoffice.Sip_Investors_Applicant_Get(obj).subscribe(
      data =>{
        console.log(data);
      }
    )
  }
}
