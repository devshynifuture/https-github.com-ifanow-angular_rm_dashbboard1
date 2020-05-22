import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { DateAdapter } from 'saturn-datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from '../../../../constants/date-format.constant';
import { default as _rollupMoment } from 'node_modules/moment/src/moment';
import { UtilService } from '../../../../services/util.service';

const moment = _rollupMoment;

@Component({
	selector: 'custom-filter-datepicker-dialog-component',
	templateUrl: './custom-filter-datepicker-dialog.html',
	providers: [
		{
			provide: DateAdapter,
			useClass: MomentDateAdapter,
			deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
		},
		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
	],
})
export class CustomFilterDatepickerDialogComponent {
	constructor(
		public dialogRef: MatDialogRef<CustomFilterDatepickerDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data,
		private fb: FormBuilder,
		private utilService: UtilService
	) { }
	maxDate = new Date();
	minDate = new Date("1 January, 1990");

	customDateForm = this.fb.group({
		fromDate: [moment(), Validators.required],
		toDate: [moment(), Validators.required]
	})

	onNoClick(): void {
		this.dialogRef.close();
	}

	setDateValue() {
		let fromDate = this.customDateForm.get('fromDate').value;
		let fromDateFormatted = fromDate.getFullYear() + '-' + this.utilService.addZeroBeforeNumber((fromDate.getMonth() + 1), 2) + '-' + this.utilService.addZeroBeforeNumber(fromDate.getDate(), 2)
		let toDate = this.customDateForm.get('toDate').value;
		let toDateFormatted = toDate.getFullYear() + '-' + this.utilService.addZeroBeforeNumber((toDate.getMonth() + 1), 2) + '-' + this.utilService.addZeroBeforeNumber(toDate.getDate(), 2)

		let dateValues = {
			fromDate: fromDateFormatted,
			toDate: toDateFormatted
		}
		this.dialogRef.close(dateValues);
	}

}