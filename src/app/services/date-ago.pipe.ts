import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo'
})
export class DateAgoPipe implements PipeTransform {
  dayArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];
  monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  transform(value: any): any {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(parseInt(value))) / 1000);
      if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
        return 'Just now';
      const intervals = {
        'year': 31536000,
        'month': 2592000,
        'week': 604800,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
        'second': 1
      };
      let counter;
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);

        if (counter > 0) {
          if (counter === 1) {
            let val = this.returnDateFunc(i, value);
            return val ? val : counter + ' ' + i + ' ago'; // if false singular (1 day ago)
          } else {
            let val = this.returnDateFunc(i, value);
            return val ? val : counter + ' ' + i + 's ago'; // if false plural (2 days ago)
          }
        } else {
          let val = this.returnDateFunc(i, value);
          return val ? val : counter + ' ' + i + 's ago'; // if false plural (2 days ago)
        }
      }
    }
  }

  returnDateFunc(i, value) {
    if (i === 'week' || i === 'year' || i === 'month') {
      let date = new Date(parseInt(value));
      let returnVal = date.getDate() + " " + this.monthArray[date.getMonth()] + " " + date.getFullYear();
      return returnVal;
    } else {
      return false;
    }
  }

}
