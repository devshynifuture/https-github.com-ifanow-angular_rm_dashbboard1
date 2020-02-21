import { Group } from './../../cashflow.interface';
import { Component, OnInit, Input } from '@angular/core';
import { UpperTableBox } from '../../cashflow.interface';
import { CashflowAddComponent } from '../cashflow-add/cashflow-add.component';
import { ValidatorType } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CashFlowsPlanService } from '../../cashflows-plan.service';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-cashflow-upper-expense',
  templateUrl: './cashflow-upper-expense.component.html',
  styleUrls: ['./cashflow-upper-expense.component.scss']
})
export class CashflowUpperExpenseComponent implements OnInit {
  incomeData: string;

  constructor(public dialog: MatDialog,
    private eventService: EventService,
    private cashflowService: CashFlowsPlanService) { }

  displayedColumns: string[] = ['description', 'month4', 'month5', 'month6', 'month7', 'month8', 'month9', 'month10', 'month11', 'month12', 'month1', 'month2', 'month3', 'total', 'remove'];
  dataSource: MatTableDataSource<UpperTableBox | Group>;
  advisorId = AuthService.getAdvisorId();
  clientId = AuthService.getClientId();

  year: string = '';
  cashflowCategory;
  @Input() data;
  editMode: boolean = false;
  onlyNumbers = '';

  ngOnInit() {
    this.cashflowCategory = this.data.tableInUse;

    this.year = this.data.year;
    this.dataSource = new MatTableDataSource(ELEMENT_DATA1);
    // this.getCashflowMonthlyExpenseTableData();

    // this.refreshTableData();
  }

  // alterTable(table: UpperTableBox[], field: string, value: string, index: number): UpperTableBox[] {
  //   table[index][field] = value;
  //   this.updateTotal(table[index]);
  //   return table;
  // }

  getCashflowMonthlyExpenseTableData() {
    this.cashflowService.getCashflowMonthlyExpensesValues({
      advisorId: AuthService.getUserInfo().advisorId,
      clientId: AuthService.getClientId(),
      year: this.year
    }).subscribe(res => {
      console.log("value of cashflow monthly expense data, ", res);
    }, err => {
      console.error("error in getting cashflow expense data, ", err)
    });
  }

  deleteEntryCashFlow(element: UpperTableBox) {
    let el;
    (ELEMENT_DATA1 !== null) ? el = ELEMENT_DATA1.splice(ELEMENT_DATA1.indexOf(element), 1) : null;
    console.log("this element deleted:0000 ", el);
    // udpate table data
  }

  // updateTotal(object: UpperTableBox) {
  //   let sum = 0;
  //   for (let i = 1; i <= 12; i++) {
  //     sum = sum + parseInt(object[`month${i}`]);
  //   }
  //   object['total'] = String(sum);
  // }

  changeTableTdValue(value: string, field: string, index: number) {
    if (ValidatorType.NUMBER_ONLY.test(value)) {
      ELEMENT_DATA1 = this.cashflowService.alterTable(ELEMENT_DATA1, field, value, index);
    } else {
      this.onlyNumbers = '';
      this.eventService.openSnackBar("This input only takes numbers", "DISMISS");
    }

  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  addCashFlow(data) {
    const dialogRef = this.dialog.open(CashflowAddComponent, {
      width: '750px',
      data: { ...data, tableData: this.data }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  addOneInYear(value: string) {
    return String(parseInt(value) + 1);
  }

}

// for expense
let ELEMENT_DATA1: (UpperTableBox | Group)[] = [
  {
    description: '2020', month1: { value: '234', isAdHocChangesDone: false }, month2: { value: '99', isAdHocChangesDone: false }, month3: { value: '2334', isAdHocChangesDone: false }, month4: { value: '45', isAdHocChangesDone: false }, month5: { value: '43', isAdHocChangesDone: false }, month6: { value: '634', isAdHocChangesDone: false }, month7: { value: '22324', isAdHocChangesDone: false }, month8: { value: '254354', isAdHocChangesDone: false }, month9: { value: '26467', isAdHocChangesDone: false }, month10: { value: '2879696', isAdHocChangesDone: false }, month11: { value: '23745', isAdHocChangesDone: false }, month12: { value: '24574654', isAdHocChangesDone: false }, total: '44534534', remove: ''
  }
]