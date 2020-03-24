import { Component, OnInit } from '@angular/core';
import { AumComponent } from '../aum.component';
import { BackOfficeService } from '../../../../back-office.service';

@Component({
  selector: 'app-amc-wise',
  templateUrl: './amc-wise.component.html',
  styleUrls: ['./amc-wise.component.scss']
})
export class AmcWiseComponent implements OnInit {
  teamMemberId=2929;

  constructor(public aum:AumComponent,private backoffice:BackOfficeService) { }

  ngOnInit() {
    this.getAmcWiseData();
    this.getApplicantName();
  }
  aumReport()
  {
   this.aum.aumComponent=true;
  }
  getAmcWiseData(){
    this.backoffice.amcWiseGet(this.teamMemberId).subscribe(
      data => {
        console.log(data);
      }
    )
  }
  getApplicantName(){
    const obj={
      amcName:'Aditya birla',
      schemeCode:'abc-1233',
      teamMemberId:this.teamMemberId,
      totalAum:2000
    }
    this.backoffice.amcWiseApplicantGet(obj).subscribe(
      data => {
        console.log(data);
      }
    )
  }
}
