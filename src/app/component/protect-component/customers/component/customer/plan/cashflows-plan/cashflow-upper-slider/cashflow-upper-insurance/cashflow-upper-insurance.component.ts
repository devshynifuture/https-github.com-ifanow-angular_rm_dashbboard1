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
  displayedColumns: string[] = ['description', 'month4', 'month5', 'month6', 'month7', 'month8', 'month9', 'month10', 'month11', 'month12', 'month1', 'month2', 'month3', 'total', 'remove'];
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
  {
    description: '2020', month1: { value: '234', isAdHocChangesDone: false }, month2: { value: '99', isAdHocChangesDone: false }, month3: { value: '2334', isAdHocChangesDone: false }, month4: { value: '45', isAdHocChangesDone: false }, month5: { value: '43', isAdHocChangesDone: false }, month6: { value: '634', isAdHocChangesDone: false }, month7: { value: '22324', isAdHocChangesDone: false }, month8: { value: '254354', isAdHocChangesDone: false }, month9: { value: '26467', isAdHocChangesDone: false }, month10: { value: '2879696', isAdHocChangesDone: false }, month11: { value: '23745', isAdHocChangesDone: false }, month12: { value: '24574654', isAdHocChangesDone: false }, total: '44534534', remove: ''
  }, {
    description: '2020', month1: { value: '234', isAdHocChangesDone: false }, month2: { value: '99', isAdHocChangesDone: false }, month3: { value: '2334', isAdHocChangesDone: false }, month4: { value: '45', isAdHocChangesDone: false }, month5: { value: '43', isAdHocChangesDone: false }, month6: { value: '634', isAdHocChangesDone: false }, month7: { value: '22324', isAdHocChangesDone: false }, month8: { value: '254354', isAdHocChangesDone: false }, month9: { value: '26467', isAdHocChangesDone: false }, month10: { value: '2879696', isAdHocChangesDone: false }, month11: { value: '23745', isAdHocChangesDone: false }, month12: { value: '24574654', isAdHocChangesDone: false }, total: '44534534', remove: ''
  }, { groupName: 'Non Goal Based' },
  {
    description: '2020', month1: { value: '234', isAdHocChangesDone: false }, month2: { value: '99', isAdHocChangesDone: false }, month3: { value: '2334', isAdHocChangesDone: false }, month4: { value: '45', isAdHocChangesDone: false }, month5: { value: '43', isAdHocChangesDone: false }, month6: { value: '634', isAdHocChangesDone: false }, month7: { value: '22324', isAdHocChangesDone: false }, month8: { value: '254354', isAdHocChangesDone: false }, month9: { value: '26467', isAdHocChangesDone: false }, month10: { value: '2879696', isAdHocChangesDone: false }, month11: { value: '23745', isAdHocChangesDone: false }, month12: { value: '24574654', isAdHocChangesDone: false }, total: '44534534', remove: ''
  }, {
    description: '2020', month1: { value: '234', isAdHocChangesDone: false }, month2: { value: '99', isAdHocChangesDone: false }, month3: { value: '2334', isAdHocChangesDone: false }, month4: { value: '45', isAdHocChangesDone: false }, month5: { value: '43', isAdHocChangesDone: false }, month6: { value: '634', isAdHocChangesDone: false }, month7: { value: '22324', isAdHocChangesDone: false }, month8: { value: '254354', isAdHocChangesDone: false }, month9: { value: '26467', isAdHocChangesDone: false }, month10: { value: '2879696', isAdHocChangesDone: false }, month11: { value: '23745', isAdHocChangesDone: false }, month12: { value: '24574654', isAdHocChangesDone: false }, total: '44534534', remove: ''
  }, {
    description: '2020', month1: { value: '234', isAdHocChangesDone: false }, month2: { value: '99', isAdHocChangesDone: false }, month3: { value: '2334', isAdHocChangesDone: false }, month4: { value: '45', isAdHocChangesDone: false }, month5: { value: '43', isAdHocChangesDone: false }, month6: { value: '634', isAdHocChangesDone: false }, month7: { value: '22324', isAdHocChangesDone: false }, month8: { value: '254354', isAdHocChangesDone: false }, month9: { value: '26467', isAdHocChangesDone: false }, month10: { value: '2879696', isAdHocChangesDone: false }, month11: { value: '23745', isAdHocChangesDone: false }, month12: { value: '24574654', isAdHocChangesDone: false }, total: '44534534', remove: ''
  },
]