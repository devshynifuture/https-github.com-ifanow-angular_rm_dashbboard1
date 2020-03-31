import { Component, OnInit } from '@angular/core';
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
  constructor(private backoffice:BackOfficeService,public sip:SipComponent) { }

  ngOnInit() {
    this.showLoader = false;
    this.advisorId=AuthService.getAdvisorId();
    this.clientId=AuthService.getClientId();
    this.schemeWiseApplicantGet()
  }
  aumReport()
  {
   this.sip.sipComponent=true;
  }  
  schemeWiseApplicantGet(){
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      clientId:this.clientId,
      parentId:-1,
      schemeId:123
    }
    this.backoffice.scheme_wise_Applicants_Get(obj).subscribe(
      data =>{
        console.log(data);
      }
    )
  }
}
