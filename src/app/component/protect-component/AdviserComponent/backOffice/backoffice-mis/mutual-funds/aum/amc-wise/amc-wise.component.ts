import { Component, OnInit } from '@angular/core';
import { AumComponent } from '../aum.component';
import { BackOfficeService } from '../../../../back-office.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-amc-wise',
  templateUrl: './amc-wise.component.html',
  styleUrls: ['./amc-wise.component.scss']
})
export class AmcWiseComponent implements OnInit {
  teamMemberId=2929;
  advisorId: any;

  constructor(public aum:AumComponent,private backoffice:BackOfficeService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getAmcWiseData();
    this.getApplicantName();
  }
  aumReport()
  {
   this.aum.aumComponent=true;
  }
  getAmcWiseData(){
    this.backoffice.amcWiseGet(this.advisorId).subscribe(
      data => {
        console.log(data);
      }
    )
  }
  getApplicantName(){
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailId:'arn-124',
      schemeMasterId:'abc-1233',
      totalAum:2000
    }
    this.backoffice.amcWiseApplicantGet(obj).subscribe(
      data => {
        console.log(data);
      }
    )
  }
}
