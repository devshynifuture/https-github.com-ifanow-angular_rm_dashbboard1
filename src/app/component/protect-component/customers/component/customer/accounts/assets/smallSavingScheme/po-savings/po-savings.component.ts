import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';

@Component({
  selector: 'app-po-savings',
  templateUrl: './po-savings.component.html',
  styleUrls: ['./po-savings.component.scss']
})
export class PoSavingsComponent implements OnInit {
  advisorId: any;
  clientId: number;

  constructor(private cusService:CustomerService) { }
  displayedColumns20 = ['no', 'owner', 'cvalue', 'rate', 'balanceM', 'balAs', 'desc', 'status', 'icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId=2978;
    this.getPoSavingSchemedata()
  }
  getPoSavingSchemedata() {
    const obj={
      advisorId:this.advisorId,
      clientId:this.clientId
    }
    this.cusService.getSmallSavingSchemePOSAVINGData(obj).subscribe(
      data=>this.getPoSavingSchemedataResponse(data)
    )
  }
  getPoSavingSchemedataResponse(data)
  {
    this.datasource=data.PostOfficeSavingsList;
    console.log(data)
  }

}
