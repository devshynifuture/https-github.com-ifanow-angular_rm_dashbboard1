// import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
// import { Subject } from 'rxjs';
// import { SatCalendar, SatDatepicker } from 'saturn-datepicker';
// import { takeUntil } from 'rxjs/operators';

// @Component({

//     templateUrl: './set-date-footer.html'

// })
// export class SetDateFooter {
//     private destroyed = new Subject<void>();
//     constructor(
//     private calendar: SatCalendar<Date>,
//     private datePicker: SatDatepicker<Date>,

//     cdr: ChangeDetectorRef
//     ) {
//         calendar.stateChanges
//             .pipe(takeUntil(this.destroyed))
//             .subscribe(() => cdr.markForCheck())


//         }



//     setRange(){
//         this.calendar.activeDate = this.calendar.beginDate;
//         this.calendar.beginDateSelectedChange.emit(this.calendar.beginDate);
//         this.calendar.dateRangesChange.emit({begin: this.calendar.beginDate, end: this.calendar.endDate});
//         this.datePicker.close();
//     }

// }

import { ChangeDetectorRef, Component } from '@angular/core';
// import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SatCalendar, SatCalendarFooter, SatDatepicker } from 'saturn-datepicker';
import { DateAdapter } from 'saturn-datepicker';

@Component({
    selector: 'app-set-date-footer',
    templateUrl: './set-date-footer.html'
})
export class SetDateFooter<Date> implements SatCalendarFooter<Date> {
    public ranges: Array<{ key: string, label: string }> = [
        { key: 'today', label: 'Today' },
        { key: 'thisWeek', label: 'This Week' },
    ];
    private destroyed = new Subject<void>();

    constructor(
        private calendar: SatCalendar<Date>,
        private datePicker: SatDatepicker<Date>,
        private dateAdapter: DateAdapter<Date>,
        cdr: ChangeDetectorRef
    ) {
        calendar.stateChanges
            .pipe(takeUntil(this.destroyed))
            .subscribe(() => cdr.markForCheck())
    }

    setRange() {
        // switch (range) {
        //     case 'today':
        //         this.calendar.beginDate = this.dateAdapter.deserialize(new Date());
        //         this.calendar.endDate = this.dateAdapter.deserialize(new Date());
        //         this.calendar.activeDate = this.calendar.beginDate;
        //         break;
        //     case 'thisWeek':
        //         const today = moment();
        //         this.calendar.beginDate = this.dateAdapter.deserialize(today.weekday(0).toDate());
        //         this.calendar.endDate = this.dateAdapter.deserialize(today.weekday(6).toDate());
        //         break;
        // }
        this.calendar.activeDate = this.calendar.beginDate;
        this.calendar.beginDateSelectedChange.emit(this.calendar.beginDate);
        this.calendar.dateRangesChange.emit({ begin: this.calendar.beginDate, end: this.calendar.endDate });
        this.datePicker.close();


    }

    cancelRange() {
        this.datePicker.close();

    }
}