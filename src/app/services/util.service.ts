import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';


@Injectable({
    providedIn: 'root'
})
export class UtilService {

    getFamilyMemberData: any;

    constructor() {
    }

    static convertObjectToArray(inputObject: object): object[] {
        const outputArray = [];
        Object.keys(inputObject).map(key => {
            outputArray.push({
                name: inputObject[key],
                value: key,
                selected: false
            });
        });

        return outputArray;
    }

    static convertObjectToCustomArray(inputObject: object, keyNameForOutput: string, keyValueForOutput: string): object[] {
        const outputArray = [];
        Object.keys(inputObject).map(key => {
            const object = {selected: false};
            object[keyNameForOutput] = inputObject[key];
            object[keyValueForOutput] = key;

            outputArray.push(object);
        });

        return outputArray;
    }

    static isDialogClose(data) {
        return data && data.state && data.state === 'close';
    }

    static getStartOfTheDay(date: Date) {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    }

    static getEndOfDay(date: Date) {
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        date.setMilliseconds(999);
        return date;

    }

    static convertDateObjectToDateString(datePipe: DatePipe, date: Date) {
        return datePipe.transform(date, 'yyyy-MM-dd');
    }

    static checkStatusId(element) {
        element.forEach(obj => {
            if (obj.maturityDate < new Date()) {
                obj.statusId = 'MATURED';
            } else {
                obj.statusId = 'LIVE';
            }
        });
        console.log('Status >>>>>>', element);
    }

    totalCalculator(data: number[]) {
        return data.reduce((accumulator, currentValue) => {
            accumulator = accumulator + currentValue;
            return accumulator;
        }, 0);
    }

    formatNumbers(data) {
        return (parseInt(data)).toLocaleString('en-IN');
    }

    formatter(data) {
        return Math.round(data);
    }

    calculateAgeFromCurrentDate(data) {
        data.forEach(element => {
            const bdate = new Date(element.dateOfBirth);
            const timeDiff = Math.abs(Date.now() - bdate.getTime());
            const age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
            element.age = age;
        });
        this.getFamilyMemberData = data;
        console.log('family Member with age', this.getFamilyMemberData);
        return this.getFamilyMemberData;
    }

    //Allows only numbers
    keyPress(event: any) {
        const pattern = /[0-9\+\-\. ]/;

        const inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    //Allow Only text NOT number and special character
    onlyText(event: any) {
        const pattern = /[0-9\+\-\. ]/;

        const inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && pattern.test(inputChar)) {
            event.preventDefault();
        }
        var k = event.keyCode;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || (k >= 48 && k <= 57));
    }

    // allows text and number NOT special character
    alphaNumric(event: any) {
        var k = event.keyCode;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || (k >= 48 && k <= 57));
    }

    //used for dateFormat allows numbers and / character
    dateFormat(event: any) {
        let res: string;
        if (this.alphaNumric(event)) {
            res = event.target.value;

            if (((event.keyCode == 47) || (event.keyCode >= 48 && event.keyCode <= 57))) {
                if (event.target.value.length && event.target.value.length !== null) {
                    // console.log(event.target.value);
                    if (event.target.value.length === 2 || event.target.value === 4) {
                        res += '/';
                        return res;
                    }
                }
            } else {
                return res;
            }
        } else {
            return '';
        }
    }
}

export class ValidatorType {

    // static NUMBER_ONLY = new RegExp(/^\d{1,6}(\.\d{1,2})?$/);
    static NUMBER_ONLY = new RegExp(/^\d+(\.\d{0,4})?$/);
    static PERSON_NAME = new RegExp(/^[a-zA-Z]*[a-zA-Z]+[a-zA-Z ]*$/);
    // static PERSON_NAME = new RegExp(/^[a-zA-Z0-9]*[ a-zA-Z]+[a-zA-Z0-9]*$/);/*With Number*/
    static NUMBER_KEY_ONLY = new RegExp(/[^0-9.]+/g);
    static TEXT_ONLY = new RegExp(/^[a-zA-Z ]/gi);
    static TEXT_WITH_SPACE = new RegExp(/^[a-zA-Z ]/gi);

    static ALPHA_NUMBERIC = new RegExp(/^[a-zA-Z0-9]*$/gi);
    static ALPHA_NUMERIC_WITH_SPACE = new RegExp(/^[a-zA-Z0-9 ]*$/gi);
    static EMAIL_ONLY = new RegExp(/\b[\w.!#$%&’*+\/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)*\b/);
    // static EMAIL_ONLY = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}
