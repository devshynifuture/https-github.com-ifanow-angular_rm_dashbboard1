import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { element } from 'protractor';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-add-income-source',
  templateUrl: './add-income-source.component.html',
  styleUrls: ['./add-income-source.component.scss']
})
export class AddIncomeSourceComponent implements OnInit {
  incomeSourceDataSelectedFamily = [];
  stepOneData: any;
  selectedFamilyIncome = [];
  countIncomeType: number = 0;
  constructor(private eventService:EventService) { }
  @Output() IncomeSourceDetailsData = new EventEmitter();
  @Output() previousStep = new EventEmitter();
  @Input() set selectedFamilyList(data) {
    if (data.flag == "addIncome") {
      data.data.forEach(element => {
        const obj = [
          { name: "Salaried", checked: false, incomeTypeId: 1 },
          { name: "Business", checked: false, incomeTypeId: 2 },
          { name: 'Profession', checked: false, incomeTypeId: 3 },
          { name: "Rental", checked: false, incomeTypeId: 4 },
          { name: "Others", checked: false, incomeTypeId: 5 }
        ]
        if (element.selected) {
          element['incomeTypeList'] = obj
        }
      });
      this.stepOneData = data.data
    }
    else {
      this.stepOneData = data.data;
      this.stepOneData.forEach(element => {
        if (element.selected) {
          if (element.incomeTypeList == undefined) {
            const obj = [
              { name: "Salaried", checked: false, incomeTypeList: 1 },
              { name: "Business", checked: false, incomeTypeList: 2 },
              { name: 'Profession', checked: false, incomeTypeList: 3 },
              { name: "Rental", checked: false, incomeTypeList: 4 },
              { name: "Others", checked: false, incomeTypeList: 5 }
            ]
            element['incomeTypeList'] = obj
          }
          element.incomeTypeList.forEach(checkedData => {
            if (checkedData.checked) {
              this.countIncomeType++;
            }
          })
        }
      })
    }
  }
  ngOnInit() {
  }
  nextStep() {
    if(this.countIncomeType==0)
    {
      this.eventService.openSnackBar("Please select income mode","dismiss")
      return;
    }
    const obj =
    {
      data: this.stepOneData,
      stpeNo: 3
    }
    this.IncomeSourceDetailsData.emit(obj)
  }
  cancel() {
    const obj =
    {
      data: this.stepOneData,
      stpeNo: 1,
      flag: 'incomeSource'
    }
    this.previousStep.emit(obj);
  }
  select(data) {
    (data.checked) ? this.unselectIncomeType(data) : this.selectIncomeType(data);
  }
  selectIncomeType(data) {
    data.checked = true;
    this.countIncomeType++;
  }
  unselectIncomeType(data) {
    data.checked = false;
    this.countIncomeType--;
  }
}
