import { Injectable } from '@angular/core';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class ProcessTransactionService {
  [x: string]: any;
  inverstorList: any;
  schemeSelection : any;
  constructor() { }
  selectionList() {
    this.schemeSelection = [{
      select: 'Invest in existing scheme',
      value : 1
    }, {
      select: 'Select a new scheme',
      value : 2
    }]
  }
  getIINList() {
    this.inverstorList = [
      {
        iin: '5011102595'
      },
      {
        iin: '2011103545'
      }
    ]
    return this.inverstorList
  }
  getDefaultLoginDetials() {

  }
  getEuinList() {

  }
  getDateByArray = function(arr,flag){
    var dArr = [],datesArr=[];
    var t=(flag==true)? moment().add('days',7) : moment().add('days',30);
    console.log("setting t as step date",t)
    for(var i = 0;i<arr.length;i++){
      datesArr.push(moment(t).set('date',arr[i]))
    }
    console.log("step date array",datesArr)
    datesArr=datesArr.filter(function(dt){
      return (moment(dt).isSameOrBefore(t))
    })
    console.log("step date array filtered isSameOrBefore of step date",datesArr)
    for(var i = 0;i<arr.length;i++){
      datesArr.push(moment(t).set('date',arr[i]).add(1,'months'))
    }
    console.log("after step datesArr adition of next month",datesArr)
    datesArr.forEach(_dt => {
      dArr.push({
        date:_dt.toDate(),
        dateToDisplay:this.formatApiDates(_dt),
        tomm:moment(_dt).add('days',1).toDate()
      })
    });
    console.log("dArr",dArr);
    return dArr;
  }
  formatApiDates = function(_date) {
    var d = (_date)? new Date(_date) : new Date(),
      minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
      hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
      ampm = d.getHours() >= 12 ? 'PM' : 'AM',
      months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var date = (d.getDate()<10)?'0'+d.getDate(): d.getDate();
    return date+'-'+months[d.getMonth()]+'-'+d.getFullYear();
  }
}
