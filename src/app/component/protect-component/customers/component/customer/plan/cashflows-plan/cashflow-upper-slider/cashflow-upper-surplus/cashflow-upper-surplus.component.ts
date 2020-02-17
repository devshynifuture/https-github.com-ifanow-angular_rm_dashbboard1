import { AuthService } from './../../../../../../../../../auth-service/authService';
import { UpperTableBox, Group } from './../../cashflow.interface';
import { EventService } from './../../../../../../../../../Data-service/event.service';
import { ValidatorType } from './../../../../../../../../../services/util.service';
import { CashflowAddComponent } from './../cashflow-add/cashflow-add.component';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CashFlowsPlanService } from '../../cashflows-plan.service';

@Component({
  selector: 'app-cashflow-upper-surplus',
  templateUrl: './cashflow-upper-surplus.component.html',
  styleUrls: ['./cashflow-upper-surplus.component.scss']
})
export class CashflowUpperSurplusComponent implements OnInit {
  onlyNumbers: string;

  constructor(public dialog: MatDialog, private eventService: EventService,
    private cashflowService: CashFlowsPlanService) { }
  @Input() data;
  editMode: boolean = false;

  year: string = '';
  shouldShowIcon: boolean = false;
  cashFlowCategory: string = '';
  displayedColumns: string[] = ['description', 'month4', 'month5', 'month6', 'month7', 'month8', 'month9', 'month10', 'month11', 'month12', 'month1', 'month2', 'month3', 'total', 'remove'];
  dataSource = ELEMENT_DATA3;
  advisorId = AuthService.getAdvisorId();
  clientId = AuthService.getClientId();

  ngOnInit() {
    this.cashFlowCategory = this.data.tableInUse;
    this.year = this.data.financialYear;
    this.getCashflowMonthlySurplusData();
  }

  alterTable(table: (UpperTableBox | Group)[], field: string, value: string, index: number): (UpperTableBox | Group)[] {
    table[index][field] = value;
    this.updateTotal(table[index]);
    return table;
  }

  updateTotal(object: (UpperTableBox | Group)) {
    let sum = 0;
    for (let i = 1; i <= 12; i++) {
      sum = sum + parseInt(object[`month${i}`]);
    }
    object['total'] = String(sum);
  }

  changeTableTdValue(value: string, field: string, index: number) {
    if (field === 'description' && this.editMode) {
      this.cashflowService.alterTable(ELEMENT_DATA3, field, value, index);
    } else if (ValidatorType.NUMBER_ONLY.test(value) && this.editMode) {
      console.log("im here:::::::::::::");
      this.alterTable(ELEMENT_DATA3, field, value, index);
    } else {
      this.onlyNumbers = '';
      this.eventService.openSnackBar("This Input only takes Numbers", "DISMISS");
    }
  }

  getCashflowMonthlySurplusData() {
    this.cashflowService
      .getCashflowYearlySurplusValues({ advisorId: this.advisorId, clientId: this.clientId })
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

  addCashFlow(data) {
    const dialogRef = this.dialog.open(CashflowAddComponent, {
      width: '750px',
      data: { ...data, tableData: this.data }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  showIcons() {
    console.log("this is loaded");
    this.shouldShowIcon = !this.shouldShowIcon;
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  deleteEntryCashFlow(element: (UpperTableBox | Group)) {
    ELEMENT_DATA3.splice(ELEMENT_DATA3.indexOf(element), 1);
  }
}

export let ELEMENT_DATA3: (UpperTableBox | Group)[] = [
  { groupName: 'NET SURPLUS & ROLLING BALANCE' },
  {
    description: '2020', month1: { value: '234', isAdHocChangesDone: false }, month2: { value: '99', isAdHocChangesDone: false }, month3: { value: '2334', isAdHocChangesDone: false }, month4: { value: '45', isAdHocChangesDone: false }, month5: { value: '43', isAdHocChangesDone: false }, month6: { value: '634', isAdHocChangesDone: false }, month7: { value: '22324', isAdHocChangesDone: false }, month8: { value: '254354', isAdHocChangesDone: false }, month9: { value: '26467', isAdHocChangesDone: false }, month10: { value: '2879696', isAdHocChangesDone: false }, month11: { value: '23745', isAdHocChangesDone: false }, month12: { value: '24574654', isAdHocChangesDone: false }, total: '44534534', remove: ''
  },
  {
    description: '2020', month1: { value: '234', isAdHocChangesDone: false }, month2: { value: '99', isAdHocChangesDone: false }, month3: { value: '2334', isAdHocChangesDone: false }, month4: { value: '45', isAdHocChangesDone: false }, month5: { value: '43', isAdHocChangesDone: false }, month6: { value: '634', isAdHocChangesDone: false }, month7: { value: '22324', isAdHocChangesDone: false }, month8: { value: '254354', isAdHocChangesDone: false }, month9: { value: '26467', isAdHocChangesDone: false }, month10: { value: '2879696', isAdHocChangesDone: false }, month11: { value: '23745', isAdHocChangesDone: false }, month12: { value: '24574654', isAdHocChangesDone: false }, total: '44534534', remove: ''
  },
  {
    description: '2020', month1: { value: '234', isAdHocChangesDone: false }, month2: { value: '99', isAdHocChangesDone: false }, month3: { value: '2334', isAdHocChangesDone: false }, month4: { value: '45', isAdHocChangesDone: false }, month5: { value: '43', isAdHocChangesDone: false }, month6: { value: '634', isAdHocChangesDone: false }, month7: { value: '22324', isAdHocChangesDone: false }, month8: { value: '254354', isAdHocChangesDone: false }, month9: { value: '26467', isAdHocChangesDone: false }, month10: { value: '2879696', isAdHocChangesDone: false }, month11: { value: '23745', isAdHocChangesDone: false }, month12: { value: '24574654', isAdHocChangesDone: false }, total: '44534534', remove: ''
  },
  { groupName: 'MONTHLY ALLOCATIONS' },
  {
    description: '2020', month1: { value: '234', isAdHocChangesDone: false }, month2: { value: '99', isAdHocChangesDone: false }, month3: { value: '2334', isAdHocChangesDone: false }, month4: { value: '45', isAdHocChangesDone: false }, month5: { value: '43', isAdHocChangesDone: false }, month6: { value: '634', isAdHocChangesDone: false }, month7: { value: '22324', isAdHocChangesDone: false }, month8: { value: '254354', isAdHocChangesDone: false }, month9: { value: '26467', isAdHocChangesDone: false }, month10: { value: '2879696', isAdHocChangesDone: false }, month11: { value: '23745', isAdHocChangesDone: false }, month12: { value: '24574654', isAdHocChangesDone: false }, total: '44534534', remove: ''
  },
  { groupName: 'LUMPSUM ALLOCATIONS' },
  {
    description: '2020', month1: { value: '234', isAdHocChangesDone: false }, month2: { value: '99', isAdHocChangesDone: false }, month3: { value: '2334', isAdHocChangesDone: false }, month4: { value: '45', isAdHocChangesDone: false }, month5: { value: '43', isAdHocChangesDone: false }, month6: { value: '634', isAdHocChangesDone: false }, month7: { value: '22324', isAdHocChangesDone: false }, month8: { value: '254354', isAdHocChangesDone: false }, month9: { value: '26467', isAdHocChangesDone: false }, month10: { value: '2879696', isAdHocChangesDone: false }, month11: { value: '23745', isAdHocChangesDone: false }, month12: { value: '24574654', isAdHocChangesDone: false }, total: '44534534', remove: ''
  },
  {
    description: '2020', month1: { value: '234', isAdHocChangesDone: false }, month2: { value: '99', isAdHocChangesDone: false }, month3: { value: '2334', isAdHocChangesDone: false }, month4: { value: '45', isAdHocChangesDone: false }, month5: { value: '43', isAdHocChangesDone: false }, month6: { value: '634', isAdHocChangesDone: false }, month7: { value: '22324', isAdHocChangesDone: false }, month8: { value: '254354', isAdHocChangesDone: false }, month9: { value: '26467', isAdHocChangesDone: false }, month10: { value: '2879696', isAdHocChangesDone: false }, month11: { value: '23745', isAdHocChangesDone: false }, month12: { value: '24574654', isAdHocChangesDone: false }, total: '44534534', remove: ''
  }
]
