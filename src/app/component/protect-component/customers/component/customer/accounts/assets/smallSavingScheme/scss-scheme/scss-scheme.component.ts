import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';

@Component({
  selector: 'app-scss-scheme',
  templateUrl: './scss-scheme.component.html',
  styleUrls: ['./scss-scheme.component.scss']
})
export class ScssSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;

  constructor(private cusService:CustomerService) { }
  displayedColumns19 = ['no', 'owner', 'payout', 'rate', 'tamt', 'amt', 'mdate', 'desc', 'status', 'icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId=2978;
    this.getScssSchemedata()
  }
  getScssSchemedata() {
    const obj={
      advisorId:this.advisorId,
      clientId:this.clientId,
      requiredDate:''
    }
    this.cusService.getSmallSavingSchemeSCSSData(obj).subscribe(
      data=>this.getKvpSchemedataResponse(data)
    )
  }
  getKvpSchemedataResponse(data: any) {
    this.datasource=data.scssList
    console.log(data)
  }
}
