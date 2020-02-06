import { ValidatorType } from './../../../../../../../../../services/util.service';
import { CashflowAddComponent } from './../cashflow-add/cashflow-add.component';
import { Component, OnInit, Input } from '@angular/core';
import { UpperTableBox } from '../../cashflow.interface';
import { AuthService } from 'src/app/auth-service/authService';
import { CashFlowsPlanService } from '../../cashflows-plan.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatDialog, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-cashflow-upper-income',
  templateUrl: './cashflow-upper-income.component.html',
  styleUrls: ['./cashflow-upper-income.component.scss']
})
export class CashflowUpperIncomeComponent implements OnInit {
  incomeData: string;

  constructor(public dialog: MatDialog,
    private eventService: EventService,
    private cashflowService: CashFlowsPlanService) { }

  displayedColumns: string[] = ['description', 'month1', 'month2', 'month3', 'month4', 'month5', 'month6', 'month7', 'month8', 'month9', 'month10', 'month11', 'month12', 'total', 'remove'];
  dataSource = null;
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

    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    // api not created
    // this.getCashflowMonthlyIncomeData();
  }

  getCashflowMonthlyIncomeData() {
    this.cashflowService
      .getCashflowMonthlyIncomeValues({ advisorId: this.advisorId, clientId: this.clientId })
      .subscribe(res => {
        console.log(res);
      }, err => {
        console.error(err);
      })
  }

  alterTable(table: UpperTableBox[], field: string, value: string, index: number): UpperTableBox[] {
    table[index][field] = value;
    this.updateTotal(table[index]);
    return table;
  }

  deleteEntryCashFlow(element: UpperTableBox) {
    let whichTable;
    (this.cashflowCategory === 'income') ? whichTable = ELEMENT_DATA : ''

    let el;
    (whichTable !== '') ? el = whichTable.splice(whichTable.indexOf(element), 1) : null;
    console.log("this element deleted:0000 ", el);
    // refreshTableData 
  }

  updateTotal(object: UpperTableBox) {
    let sum = 0;
    for (let i = 1; i <= 12; i++) {
      sum = sum + parseInt(object[`month${i}`]);
    }
    object['total'] = String(sum);
  }

  changeTableTdValue(value: string, field: string, index: number) {
    if (ValidatorType.NUMBER_ONLY.test(value)) {
      switch (this.cashflowCategory) {
        case 'income':
          ELEMENT_DATA = this.alterTable(ELEMENT_DATA, field, value, index);
          break;
        case 'expenses':
          ELEMENT_DATA1 = this.alterTable(ELEMENT_DATA1, field, value, index);
          break;
        case 'liabilities':
          ELEMENT_DATA2 = this.alterTable(ELEMENT_DATA2, field, value, index);
          break;
      }
    } else {
      this.onlyNumbers = '';
      this.eventService.openSnackBar("This Input only takes Numbers", "DISMISS");
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

// for Income
let ELEMENT_DATA: UpperTableBox[] = [
  { description: '2020', month1: '25', month2: '21', month3: '210000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },
  { description: '2020', month1: '25', month2: '21', month3: '210000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },
  { description: '2020', month1: '25', month2: '21', month3: '210000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },
  { description: '2020', month1: '25', month2: '21', month3: '210000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },
  { description: '2020', month1: '25', month2: '21', month3: '210000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },
  { description: '2020', month1: '25', month2: '21', month3: '210000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },
  { description: '2020', month1: '25', month2: '21', month3: '210000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },
];

// for expense
let ELEMENT_DATA1: UpperTableBox[] = [
  { description: 'dkabjvk', month1: '5', month2: '213', month3: '298', month4: '1232', month5: '134', month6: '1265', month7: '15646756', month8: '435', month9: '13563', month10: '44456745', month11: '1434', month12: '14567', total: '12564', remove: '' },
]

// for liabilities
let ELEMENT_DATA2: UpperTableBox[] = [
  { description: 'akldjvasbkd', month1: '534', month2: '3', month3: '28', month4: '12', month5: '4', month6: '8', month7: '1556', month8: '4', month9: '45', month10: '3', month11: '4', month12: '152', total: '123', remove: '' },

]