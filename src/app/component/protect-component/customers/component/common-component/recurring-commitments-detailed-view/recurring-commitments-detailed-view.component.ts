import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-recurring-commitments-detailed-view',
  templateUrl: './recurring-commitments-detailed-view.component.html',
  styleUrls: ['./recurring-commitments-detailed-view.component.scss']
})
export class RecurringCommitmentsDetailedViewComponent implements OnInit {
  inputData: any;
  income: any;
  monthlyContribution: any[];
  expense: any;
  displayedColumns = ['date', 'investorName', 'schemeName', 'folio', 'sipAmount'];
  isLoading =true;
  dataSource = new MatTableDataSource([] as Array<any>);flag: string;
  startDate: any;
  endDate: any;
;

  constructor(public utils: UtilService,private subInjectService: SubscriptionInject) { }

  ngOnInit() {
    this.expense = this.inputData
  }
  @Input()
  set data(data) {
    this.inputData = data;
    this.startDate=data.startDate;
    this.endDate = data.endDate;
    this.dataSource.data = [{}, {}, {}];
    this.getSipData(data);
  }

  get data() {
    return this.inputData;
  }
  getSipData(data){
    if(data.mutualfund){
      this.flag = 'MUTUAL FUND SIP'
      this.dataSource.data = data.mutualfund
    }else{
      this.dataSource.data=[]
      this.flag = 'DETAILED VIEW'
    }
  }
  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
