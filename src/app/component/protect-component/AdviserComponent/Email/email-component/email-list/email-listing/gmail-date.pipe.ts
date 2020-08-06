import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'gmailDate'
})
export class GmailDatePipe implements PipeTransform {
    dayArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];
    monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    transform(value: any): any {
        const nowDateObj = new Date();
        const valueDateObj = new Date(parseInt(value));

        if (valueDateObj.getFullYear() === nowDateObj.getFullYear()) {
            if (valueDateObj.getMonth() === nowDateObj.getMonth()) {
                if (valueDateObj.getDate() === nowDateObj.getDate()) {
                    if (Math.abs(nowDateObj.getHours() - valueDateObj.getHours()) != 0) {
                        return `${Math.abs(nowDateObj.getHours() - valueDateObj.getHours())} ${Math.abs(nowDateObj.getHours() - valueDateObj.getHours()) === 1 ? 'hour' : 'hours'} ago`;
                    }
                    else if (Math.abs(nowDateObj.getMinutes() - valueDateObj.getMinutes()) != 0) {
                        return `${Math.abs(nowDateObj.getMinutes() - valueDateObj.getMinutes())} ${Math.abs(nowDateObj.getMinutes() - valueDateObj.getMinutes()) === 1 ? 'min' : 'mins'} ago`;
                    }
                    else if (Math.abs(nowDateObj.getSeconds() - valueDateObj.getSeconds()) != 0) {
                        return `${Math.abs(nowDateObj.getSeconds() - valueDateObj.getSeconds())} ${Math.abs(nowDateObj.getSeconds() - valueDateObj.getSeconds()) === 1 ? 'sec' : 'secs'} ago`;
                    }
                }
                else {
                    return `${valueDateObj.getDate()} ${this.monthArray[valueDateObj.getMonth()]}`;
                }
            }
        } else {
            return `${valueDateObj.getDate()} ${this.monthArray[valueDateObj.getMonth()]} ${valueDateObj.getFullYear()} `;
        }
    }

}
