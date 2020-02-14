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
  dataToMap: any = [];
  isLoading: boolean = false;
  dataToMapCopy: any;

  constructor(public dialog: MatDialog,
    private eventService: EventService,
    private cashflowService: CashFlowsPlanService) { }

  displayedColumns: string[] = ['description', 'month4', 'month5', 'month6', 'month7', 'month8', 'month9', 'month10', 'month11', 'month12', 'month1', 'month2', 'month3', 'total', 'remove'];
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
      incomeIdList: this.incomeIdArray,
      year: parseInt(this.data.year)
    };
    this.isLoading = true;
    this.cashflowService
      .getCashflowMonthlyIncomeValues(requestJSON)
      .subscribe(res => {
        console.log(res);
        const obj = {};
        this.incomeIdArray.forEach(id => {
          res.forEach(item => {
            if (item.incomeId === id) {
              if (item.editedFromCashflow === 0) {
                obj[`month${item.receivingMonth}`] = { value: String(item.bonusOrInflow + item.amount), isAdHocChangesDone: false };
              } else if (item.editedFromCashflow === 1) {
                obj[`month${item.receivingMonth}`] = { value: String(item.cashflowAmount), isAdHocChangesDone: true };
              }
            }
          });

          let total = 0;
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              const element = parseInt(obj[key].value);
              total = total + element;
            }
          }

          // add in dataMap
          this.dataToMap.push({
            ...obj,
            description: 'hello',
            remove: '',
            total: String(total)
          });
        });

        // complete list 
        for (let i = 1; i <= 12; i++) {
          this.dataToMap.map(item => {
            for (const key in item) {
              if (!item.hasOwnProperty(`month${i}`)) {
                item[`month${i}`] = { value: '', isAdHocChangesDone: false };
              }
            }
          });
        }

        console.log("expected outcome::::::::", this.dataToMap);
        this.isLoading = false;
        this.dataToMapCopy = this.dataToMap;
        this.dataSource = new MatTableDataSource(this.dataToMap);
      }, err => {
        console.error(err);
      });

  }

  deleteEntryCashFlow(element: UpperTableBox) {
    let el;
    el = ELEMENT_DATA.splice(ELEMENT_DATA.indexOf(element), 1);

    console.log("this element deleted:0000 ", el);
    // refreshTableData 
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  changeTableTdValue(value: string, field: string, index: number) {
    console.log(value, field, index);
    if (ValidatorType.NUMBER_ONLY.test(value)) {
      const updatedTable = this.cashflowService.alterTable(this.dataToMap, field, value, index);
      console.log("this is updated Table", updatedTable);
      this.dataSource.data = updatedTable;
    } else {
      this.onlyNumbers = '';
      this.eventService.openSnackBar("This Input only takes Numbers", "DISMISS");
    }
  }

  resetAdhocChanges(index, month) {
    this.dataToMap[index][month].isAdHocChangesDone = !this.dataToMap[index][month].isAdHocChangesDone;
    this.dataToMap[index][month].value = this.dataToMapCopy[index][month].value;
    this.dataSource.data = this.dataToMap;
    console.log("this is new table", this.dataToMap);
    console.log("this is old table", this.dataToMapCopy);
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
  {
    description: null, month1: { value: null, isAdHocChangesDone: false }, month2: { value: null, isAdHocChangesDone: false }, month3: { value: null, isAdHocChangesDone: false }, month4: { value: null, isAdHocChangesDone: false }, month5: { value: null, isAdHocChangesDone: false }, month6: { value: null, isAdHocChangesDone: false }, month7: { value: null, isAdHocChangesDone: false }, month8: { value: null, isAdHocChangesDone: false }, month9: { value: null, isAdHocChangesDone: false }, month10: { value: null, isAdHocChangesDone: false }, month11: { value: null, isAdHocChangesDone: false }, month12: { value: null, isAdHocChangesDone: false }, total: null, remove: ''
  },
  { description: null, month1: { value: null, isAdHocChangesDone: false }, month2: { value: null, isAdHocChangesDone: false }, month3: { value: null, isAdHocChangesDone: false }, month4: { value: null, isAdHocChangesDone: false }, month5: { value: null, isAdHocChangesDone: false }, month6: { value: null, isAdHocChangesDone: false }, month7: { value: null, isAdHocChangesDone: false }, month8: { value: null, isAdHocChangesDone: false }, month9: { value: null, isAdHocChangesDone: false }, month10: { value: null, isAdHocChangesDone: false }, month11: { value: null, isAdHocChangesDone: false }, month12: { value: null, isAdHocChangesDone: false }, total: null, remove: '' },
  { description: null, month1: { value: null, isAdHocChangesDone: false }, month2: { value: null, isAdHocChangesDone: false }, month3: { value: null, isAdHocChangesDone: false }, month4: { value: null, isAdHocChangesDone: false }, month5: { value: null, isAdHocChangesDone: false }, month6: { value: null, isAdHocChangesDone: false }, month7: { value: null, isAdHocChangesDone: false }, month8: { value: null, isAdHocChangesDone: false }, month9: { value: null, isAdHocChangesDone: false }, month10: { value: null, isAdHocChangesDone: false }, month11: { value: null, isAdHocChangesDone: false }, month12: { value: null, isAdHocChangesDone: false }, total: null, remove: '' },
];