import { CashFlowsPlanService } from './../../cashflows-plan.service';
import { ValidatorType } from './../../../../../../../../../services/util.service';
import { CashflowAddComponent } from './../cashflow-add/cashflow-add.component';
import { Component, OnInit, Input } from '@angular/core';
import { UpperTableBox } from '../../cashflow.interface';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { MatDialog, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-cashflow-upper-income',
  templateUrl: './cashflow-upper-income.component.html',
  styleUrls: ['./cashflow-upper-income.component.scss']
})
export class CashflowUpperIncomeComponent implements OnInit {
  incomeData: string;
  familyMemberList: any;

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
  incomeIdArray = [];
  familyMemberId;

  ngOnInit() {

    console.log(this.data);
    this.cashflowCategory = this.data.tableInUse;

    this.year = this.data.year;

    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    // api not created
    this.getCashflowMonthlyIncomeData();
  }

  getCashflowMonthlyIncomeData() {
    const { detailsForMonthlyDistributionGetList } = this.data;

    detailsForMonthlyDistributionGetList.forEach(item => {
      const { incomeId, familyMemberId } = item;
      this.incomeIdArray.push(incomeId);
      this.familyMemberId = familyMemberId;
    });

    console.log(" income id array", this.incomeIdArray);

    const requestJSON = {
      incomeId: this.incomeIdArray,
      year: parseInt(this.data.year)
    };
    this.cashflowService
      .getCashflowMonthlyIncomeValues(requestJSON)
      .subscribe(res => {
        console.log(res);
      }, err => {
        console.error(err);
      });

    // console.log(this.data.detailsForMonthlyDistributionGetList);
  }

  alterTable(table: UpperTableBox[], field: string, value: string, index: number): UpperTableBox[] {
    table[index][field] = value;
    this.updateTotal(table[index]);
    return table;
  }

  deleteEntryCashFlow(element: UpperTableBox) {
    let el;
    el = ELEMENT_DATA.splice(ELEMENT_DATA.indexOf(element), 1);

    console.log("this element deleted:0000 ", el);
    // refreshTableData 
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
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
      this.alterTable(ELEMENT_DATA, field, value, index);
    } else {
      this.onlyNumbers = '';
      this.eventService.openSnackBar("This Input only takes Numbers", "DISMISS");
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  cashflowAddIncome() {
    this.cashflowService
      .cashFlowAddIncome({ advisorId: this.advisorId, clientId: this.clientId })
      .subscribe(res => {
        console.log(res);
      }, err => {
        console.error(err);
      })
  }

  addCashFlow(data) {
    const dialogRef = this.dialog.open(CashflowAddComponent, {
      width: '750px',
      data: { ...data, familyMemberList: this.familyMemberList, tableData: this.data }
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