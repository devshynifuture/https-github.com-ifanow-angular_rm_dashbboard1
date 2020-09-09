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
  displayedColumns2 = ['No', 'investorName', 'currentValue', 'number', 'description'];
  isLoading =true;
  dataSource = new MatTableDataSource([] as Array<any>);flag: string;
  startDate: any;
  endDate: any;
  dataSource1 =new MatTableDataSource([] as Array<any>);


  constructor(public utils: UtilService,private subInjectService: SubscriptionInject) { }

  ngOnInit() {
    // this.expense = this.inputData
  }
  @Input()
  set data(data) {
    this.inputData = data;
    this.startDate=data.startDate;
    this.endDate = data.endDate;
    this.dataSource.data = [{}, {}, {}];
    this.dataSource.data = [{}, {}, {}];
    this.dataSource1.data = [{}, {}, {}];
    this.getSipData(data);
  }

  get data() {
    return this.inputData;
  }
  getSipData(data){
    this.flag = data.name
   if(data.name == 'Mutual fund - SIP'){
      if(data.assetList.length > 0){
        this.dataSource.data = data.assetList
      }else{
        this.dataSource.data = []
      }
    }else{
      if(data.assetList.length > 0){
        data.assetList.forEach(element => {
          element.name = (data.name == 'Life insurance premium') ? element.lifeAssuredName :(data.name == 'General insurance premium') ? element.policyHolderName : (data.name == 'Loan EMI') ? element.ownerName : (element.ownerList.length > 0 ? element.ownerList[0].name : '') 
          element.currentValue =(data.name == 'General insurance premium') ? element.premiumAmount : (data.name == 'Loan EMI') ? element.loanAmount :element.currentValue 
          element.number = (data.name == 'Life insurance premium' ||data.name=='General insurance premium') ? element.policyNumber : (data.name == 'Loan EMI') ? ((element.loanTypeId == 1)?'Home Loan':(element.loanTypeId == 2)?'Vehicle':(element.loanTypeId == 3)?'Education':(element.loanTypeId == 4)?'Credit Card':(element.loanTypeId == 5)?'Personal':'Mortgage') : 
          (data.name == 'Recurring deposits') ? element.rdNumber:element.accountNumber
        });
        this.dataSource1.data = data.assetList
      }else{
        this.dataSource1.data = []
      }
    }
    this.isLoading =false;
  }
  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
