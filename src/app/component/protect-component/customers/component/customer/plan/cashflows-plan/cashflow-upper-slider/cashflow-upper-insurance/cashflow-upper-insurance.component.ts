import { AuthService } from './../../../../../../../../../auth-service/authService';
import { Component, OnInit, Input } from '@angular/core';
import { UpperTableBox, Group } from '../../cashflow.interface';
import { CashFlowsPlanService } from '../../cashflows-plan.service';

@Component({
  selector: 'app-cashflow-upper-insurance',
  templateUrl: './cashflow-upper-insurance.component.html',
  styleUrls: ['./cashflow-upper-insurance.component.scss']
})
export class CashflowUpperInsuranceComponent implements OnInit {

  constructor(private cashflowService: CashFlowsPlanService) { }

  @Input() data;
  cashFlowCategory;
  dataSource = ELEMENT_DATA2;
  displayedColumns: string[] = ['description', 'month1', 'month2', 'month3', 'month4', 'month5', 'month6', 'month7', 'month8', 'month9', 'month10', 'month11', 'month12', 'total', 'remove'];
  year;
  advisorId = AuthService.getAdvisorId();
  clientId = AuthService.getClientId();

  ngOnInit() {
    this.cashFlowCategory = this.data.tableInUse;
    this.year = this.data.year;

    // api not created 
    this.getCashflowMonthlyInsuranceData();
  }

  getCashflowMonthlyInsuranceData() {
    this.cashflowService
      .getCashflowMonthlyInsuranceValues({ advisorId: this.advisorId, clientId: this.clientId })
      .subscribe(res => {
        console.log(res);
      }, err => {
        console.error(err);
      });
  }

  isGroup(index, item): boolean {
    return item.groupName;
  }

  addOneInYear(value: string) {
    return String(parseInt(value) + 1);
  }

}


const ELEMENT_DATA2: (UpperTableBox | Group)[] = [
  { groupName: 'Goal Based' },
  { description: '2020', month1: '25', month2: '21', month3: '2,10,000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },
  { description: '2020', month1: '25', month2: '21', month3: '2,10,000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },
  { description: '2020', month1: '25', month2: '21', month3: '2,10,000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },
  { groupName: 'Non Goal Based' },
  { description: '2020', month1: '25', month2: '21', month3: '2,10,000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },
  { description: '2020', month1: '25', month2: '21', month3: '2,10,000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },
  { description: '2020', month1: '25', month2: '21', month3: '2,10,000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },
]