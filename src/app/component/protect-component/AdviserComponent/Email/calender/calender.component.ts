import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalenderComponent implements OnInit {
  viewDate: Date = new Date();
  numbersOfDays:any;
  lastMonthDays:any;
  nextMonthDays:any;
  updateDate:any;
  month;
  year;
  todayDate;
  addLastMonthDays;
  daysArr = [];
  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.updateDate = new BehaviorSubject(this.viewDate);
    
    this.month= this.viewDate.getMonth();
    this.year = this.viewDate.getFullYear();
    this.todayDate = this.viewDate.getDate();
    this.numbersOfDays = this.daysInMonth(this.month, this.year)
    this.lastMonthDays = this.daysInLastMonth(this.month, this.year)
    this.nextMonthDays = this.daysInNextMonth(this.month, this.year)
    console.log(this.numbersOfDays, this.lastMonthDays, this.nextMonthDays, "this.numbersOfDays");
    let firstDay = (new Date(this.year, this.month)).getDay();
    console.log(firstDay, "firstDay", this.month);
    
    for(let i = 1; i<= this.numbersOfDays; i++ ){
      this.daysArr.push(i);
    }

    if(firstDay == 0){
      this.addLastMonthDays = 6;
    }
    else{
      this.addLastMonthDays = firstDay - 1;
    }

    for(let d = 1; d <= this.addLastMonthDays; d++){
      this.daysArr.unshift(this.lastMonthDays);
      this.lastMonthDays -= 1;
    }

    for(let fd = 1; this.daysArr.length <= 41; fd++){
      this.daysArr.push(fd);
    }

    console.log(this.daysArr, "daysArr 123");

  }

  daysInMonth (month, year) {
    return 32 - new Date(year, month, 32).getDate();
  }

  daysInLastMonth (month, year) {
    return 32 - new Date(year - 1, month - 1, 32).getDate();
  }

  daysInNextMonth (month, year) {
    return 32 - new Date(year + 1, month + 1, 32).getDate();
  }

  
  nextMonth(){
    
    
    this.viewDate.setMonth(this.viewDate.getMonth()+1)
    this.updateDate.next(this.viewDate);
    console.log("hi hello", this.viewDate);
    this.ngOnInit();
    setTimeout(() => {
      this.ref.markForCheck();
    }, 100);
  }
  
  lastMonth(){
    this.viewDate.setMonth(this.viewDate.getMonth()-1)
    this.updateDate.next(this.viewDate);
    this.ngOnInit();
    setTimeout(() => {
      this.ref.markForCheck();
    }, 100);

  }

}
