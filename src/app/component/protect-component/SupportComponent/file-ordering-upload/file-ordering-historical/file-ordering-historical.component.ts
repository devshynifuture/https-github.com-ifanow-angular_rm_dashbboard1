import { SubscriptionInject } from "./../../../AdviserComponent/Subscriptions/subscription-inject.service";
import { OrderHistoricalFileComponent } from "./../../order-historical-file/order-historical-file.component";
import { EventService } from "./../../../../../Data-service/event.service";
import { Component, OnInit } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatTableDataSource, MatDialogRef, MatDialog } from '@angular/material';
import { UpperSliderBackofficeComponent } from "../../common-component/upper-slider-backoffice/upper-slider-backoffice.component";
import { AuthService } from "src/app/auth-service/authService";
import { UtilService } from "src/app/services/util.service";
import { FileOrderingUpperComponent } from "../file-ordering-upper/file-ordering-upper.component";
import { FileOrderingUploadService } from "../file-ordering-upload.service";
import { FormBuilder } from "@angular/forms";
import { ReconciliationService } from '../../../AdviserComponent/backOffice/backoffice-aum-reconciliation/reconciliation/reconciliation.service';
import { Subscription } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';
import { CustomFilterDatepickerDialogComponent } from '../custom-filter-datepicker-dialog.component';

@Component({
	selector: "app-file-ordering-historical",
	templateUrl: "./file-ordering-historical.component.html",
	styleUrls: ["./file-ordering-historical.component.scss"],
})
export class FileOrderingHistoricalComponent implements OnInit {
	searchByName: { value: any; type: string };
	tableData = [];
	customDateFilterValue: any;

	constructor(
		private eventService: EventService,
		private subInjectService: SubscriptionInject,
		private fileOrderingUploadService: FileOrderingUploadService,
		private fb: FormBuilder,
		private utilService: UtilService,
		private reconService: ReconciliationService,
		public dialog: MatDialog
	) { }

	rmId = AuthService.getRmId() ? AuthService.getRmId() : 2;

	isLoading = false;
	displayedColumns: string[] = [
		"advisorName",
		"rta",
		"orderedBy",
		"startedOn",
		"totalFiles",
		"queue",
		"ordering",
		"ordered",
		"failed",
		"uploaded",
		"refresh"
	];
	dataSource = new MatTableDataSource(ELEMENT_DATA);
	rmList: any[] = [];
	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = true;
	filterFormValueSubscription: Subscription;
	readonly separatorKeysCodes: number[] = [ENTER, COMMA];
	filterBy = [];
	filterForm = this.fb.group({
		filterByName: [,],
		filterByRmName: [,],
		filterByPeriod: [,],
		filterByRta: [,],
	});
	periodList = [
		{
			name: "Today",
			value: 0,
			type: "period",
		},
		{
			name: "Yesterday",
			value: 1,
			type: "period",
		},
		{
			name: "Yesterday + Today",
			value: 2,
			type: "period",
		},
		{
			name: "Last 7 Days",
			value: 7,
			type: "period",
		},
		{
			name: "Custom Date",
			value: 3,
			type: "period",
		},
	];

	rtaList = [];

	days = 2;
	rtId = 0;

	getRtaList() {
		this.reconService.getRTListValues({})
			.subscribe(res => {
				if (res && res.length !== 0) {
					res.forEach(element => {
						if (element.name !== "MANUAL") {
							if (element.name === 'All') {
								this.rtId = element.id;
							}
							if (element.name !== 'SUNDARAM' && element.name !== 'PRUDENT' && element.name !== 'NJ_NEW' && element.name !== 'NJ') {
								this.rtaList.push({
									name: element.name == 'FRANKLIN_TEMPLETON' ? 'FRANKLIN' : element.name,
									value: element.id,
									type: 'rta'
								});
							}
						}
					});
					this.getRmMasterDetails();
				} else {
					this.eventService.openSnackBar("Error In Fetching RTA List", "Dismiss");
				}
			});
	}

	openDialogCustomDateForFilter(): void {
		const dialogRef = this.dialog.open(CustomFilterDatepickerDialogComponent, {
			width: '700px',
			data: ''
		});

		dialogRef.afterClosed().subscribe(res => {
			console.log('The dialog was closed', res);
			this.customDateFilterValue = res;

			if (res) {
				this.filterBy = [];

				this.filterForm.patchValue({ filterByName: undefined });

				this.filterForm.patchValue({ filterByRmName: undefined });

				this.filterForm.patchValue({ filterByRta: undefined });

				this.dataSource.data = ELEMENT_DATA;
				this.fileOrderHistoryListGet({
					fromDate: res.fromDate,
					toDate: res.toDate,
					rmId: this.rmId,
					rtId: this.rtId
				});
			} else {
				this.eventService.openSnackBar("ABORTED!!", "DISMISS");
			}

		});
	}

	getRtName(id) {
		return this.rtaList.find(c => c.value === id).name;
	}

	getRtIdOfName(name) {
		return this.rtaList.find(c => c.name === name).id;
	}

	ngOnInit() {
		this.isLoading = true;
		this.getRtaList();
		let obj = {};

		this.filterFormValueSubscription = this.filterForm.valueChanges
			.pipe(
				debounceTime(500)
			)
			.subscribe(res => {
				if (res) {
					console.log("full filter data", res);
					for (const key in res) {
						if (res.hasOwnProperty(key)) {
							const element = res[key];
							console.log("this is single element::::", element);
							if (element) {
								if (typeof (element) === 'string') {
									obj['advisorName'] = element;
								}
								if (typeof (element) === 'object' && element.type == 'rm') {
									obj['rmId'] = element.id;
								}
								if (typeof (element) === 'object' && element.type == 'period') {
									obj['days'] = element.value;
								}
								if (typeof (element) === 'object' && element.type == 'rta') {
									obj['rtId'] = element.value;
								}
							}
						}
					}

					if (!this.utilService.isEmptyObj(obj)) {
						if (obj['days'] !== 3) {
							this.dataSource.data = ELEMENT_DATA;
							this.fileOrderHistoryListGet(obj);
						}
					}
				}
			});

	}

	defaultSelectionInFilter() {
		const defaultRmName = this.rmList.find((c) => c.id === this.rmId);
		this.filterBy.push({ name: defaultRmName.name, type: 'rm' });
		this.filterForm.get("filterByRmName").setValue(defaultRmName);

		const defaultPeriod = this.periodList.find((c) => c.value === 2);
		this.filterBy.push({ name: defaultPeriod.name, type: 'period' });
		this.filterForm.get("filterByPeriod").setValue(defaultPeriod);

		const defaultRta = this.rtaList.find((c) => c.value === 0);
		this.filterForm.get("filterByRta").setValue(defaultRta);
		this.filterBy.push({ name: defaultRta.name, type: 'rta' });

		this.fileOrderHistoryListGet({
			days: this.filterForm.get("filterByPeriod").value.value,
			rtId: this.filterForm.get("filterByRta").value.value,
			rmId: this.filterForm.get("filterByRmName").value.id,
		});
	}

	refreshFileOrder(element, index) {
		element.isLoading = true;
		let data = {
			arnRiaDetailId: element.arnRiaDetailId,
			rmId: element.rmId,
			rtId: element.rtId,
			startedOn: element.startedOn
		}
		this.fileOrderingUploadService.getFileOrderRefreshPerRowData(data)
			.subscribe(res => {
				if (res) {
					element.advisorName = res.advisorName;
					element.rta = this.getRtName(res.rtId);
					element.orderedBy = res.rmName;
					element.startedOn = res.fileOrderDateTime;
					element.totalFiles = res.totalFiles;
					element.queue = res.inqueue || res.inqueue === 0 ? res.inqueue : "-";
					element.ordering = res.orderingFrequency;
					element.ordered = res.ordered || res.ordered === 0 ? res.ordered : "-";
					element.failed = res.skipped || res.skipped === 0? res.skipped : "-";
					element.uploaded = res.uploaded || res.uploaded === 0 ? res.uploaded : "-";
					element.empty = res.empty ? res.empty : "-";
					element.rtId = res.rtId;
					element.rmId = res.rmId;
					element.arnRiaDetailId = res.arnRiaDetailId;
					element.isLoading = false;
				}
			})
	}

	getRmMasterDetails() {
		this.fileOrderingUploadService.getRmMasterUserData({}).subscribe((data) => {
			if (data && data.length !== 0) {
				console.log(data);
				data.forEach((element) => {
					element.type = "rm";
				});
				this.rmList = data;
				this.defaultSelectionInFilter();
			} else {
				this.eventService.openSnackBar("No Rm Data Found!", "Dismiss");
			}
		});
	}
	fileOrderHistoryListGet(data) {
		this.isLoading = true;
		this.fileOrderingUploadService
			.getFileOrderHistoryListData(data)
			.subscribe((data) => {
				if (data) {
					console.log("file ordering get value:::", data);
					this.isLoading = false;
					let tableData = [];
					data.forEach((element) => {
						tableData.push({
							advisorName: element.advisorName ? element.advisorName + " | " + element.arnRiaNumber : "-",
							rta: this.getRtName(element.rtId),
							orderedBy: element.rmName ? element.rmName : "-",
							startedOn: element.fileOrderDateTime
								? element.fileOrderDateTime
								: "-",
							totalFiles: element.totalFiles || element.totalFiles ? element.totalFiles : "-",
							queue: element.inqueue || element.inqueue==0? element.inqueue : "-",
							ordering: element.orderingFrequency
								? element.orderingFrequency
								: "-",
							ordered: element.ordered || element.ordered == 0? element.ordered : "-",
							failed: element.skipped || element.skipped == 0? element.skipped : "-",
							uploaded: element.uploaded || element.uploaded == 0? element.uploaded : "-",
							refresh: element.refresh ? element.refresh : "-",
							empty: element.empty ? element.empty : "-",
							rtId: element.rtId,
							rmId: element.rmId,
							days: this.days,
							arnRiaDetailId: element.arnRiaDetailId,
							isLoading: false
						});
					});

					this.dataSource.data = tableData;
					this.tableData = tableData;
				} else {
					this.eventService.openSnackBar("No Data Found", "Dismiss");
					this.dataSource.data = null;
				}
			});
	}

	maniputateEventObjForName(event) {
		let name = event.value;
		if (name !== '') {
			event.value = {
				type: "name",
				name,
			};
			this.add(event, 'name');
		}
	}

	add(event, type): void {
		console.log("add event:::", event);
		let input;
		if (event.hasOwnProperty('input')) {
			input = event.input;
		}
		let value;
		if (typeof (event.value) === 'object' && event.value.hasOwnProperty("name")) {
			value = event.value["name"];
		} else {
			value = event.value;
		}

		// removing same type value from filter
		this.filterBy = this.filterBy.filter(item => {
			return item.type !== type;
		})

		// Add our filterBy
		if ((value || "").trim()) {
			this.filterBy.push({ name: value.trim(), type });
		}

		// Reset the input value
		if (input) {
			input.value = "";
		}
	}

	remove(filterBy): void {

		console.log("removed:::", filterBy);
		const index = this.filterBy.indexOf(filterBy);

		if (filterBy.type === 'name') {
			this.filterForm.patchValue({ filterByName: undefined });
		}
		if (filterBy.type === 'rm') {
			this.filterForm.patchValue({ filterByRmName: undefined });
		}
		if (filterBy.type === 'period') {
			this.filterForm.patchValue({ filterByPeriod: undefined });
		}
		if (filterBy.type === 'rta') {
			this.filterForm.patchValue({ filterByRta: undefined });
		}

		if (index >= 0) {
			this.filterBy.splice(index, 1);

			if (index == 0) {
				console.log("no filter items present:: calling default days 2 rmId 2")
				this.fileOrderHistoryListGet({
					days: 2,
					rmId: this.rmId
				})
			}
		}

	}

	openHistoricalFileOrderingSlider(data) {
		const fragmentData = {
			flag: "openHistoricalFileOrdering",
			data,
			id: 1,
			state: "open50",
			componentName: OrderHistoricalFileComponent,
		};
		const rightSideDataSub = this.subInjectService
			.changeNewRightSliderState(fragmentData)
			.subscribe((sideBarData) => {
				console.log("this is sidebardata in subs subs : ", sideBarData);
				if (UtilService.isDialogClose(sideBarData)) {
					if (UtilService.isRefreshRequired(sideBarData)) {
						this.dataSource.data = ELEMENT_DATA;
						let days = this.filterForm.get("filterByPeriod").value ? this.filterForm.get("filterByPeriod").value.value : null;
						let rtId = this.filterForm.get("filterByRta").value ? this.filterForm.get("filterByRta").value.value : null;
						let rmId = this.filterForm.get("filterByRmName").value ? this.filterForm.get("filterByRmName").value.value : null;

						if (days && rtId && rmId) {
							this.filterBy = [];
							this.filterForm.patchValue({ filterByName: undefined, filterByRmName: undefined, filterByPeriod: undefined, filterByRta: undefined });

							this.fileOrderHistoryListGet({
								days: this.filterForm.get("filterByPeriod").value.value,
								rtId: this.filterForm.get("filterByRta").value.value,
								rmId: this.filterForm.get("filterByRmName").value.id,
							});
						} else {
							this.filterBy = [];
							this.filterForm.patchValue({ filterByName: undefined, filterByRmName: undefined, filterByPeriod: undefined, filterByRta: undefined });
							this.fileOrderHistoryListGet({
								days: 2,
								rmId: this.rmId,
							});
						}
					}
					console.log("this is sidebardata in subs subs 2: ", sideBarData);
					rightSideDataSub.unsubscribe();
				}
			});
	}

	openUpperFileOrdering(flag, status, data) {
		data.flag = flag;
		data.status = status;
		console.log("hello mf button clicked");
		const fragmentData = {
			flag,
			id: 1,
			data,
			direction: "top",
			componentName: FileOrderingUpperComponent,
			state: "open",
		};
		// this.router.navigate(['/subscription-upper'])
		AuthService.setSubscriptionUpperSliderData(fragmentData);
		const subscription = this.eventService
			.changeUpperSliderState(fragmentData)
			.subscribe((upperSliderData) => {
				if (UtilService.isDialogClose(upperSliderData)) {
					if (UtilService.isRefreshRequired(upperSliderData)) {
						this.dataSource.data = ELEMENT_DATA;
						let days = this.filterForm.get("filterByPeriod").value ? this.filterForm.get("filterByPeriod").value.value : null;
						let rtId = this.filterForm.get("filterByRta").value ? this.filterForm.get("filterByRta").value.value : null;
						let rmId = this.filterForm.get("filterByRmName").value ? this.filterForm.get("filterByRmName").value.value : null;

						if (days && rtId && rmId) {
							this.filterBy = [];
							this.filterForm.patchValue({ filterByName: undefined, filterByRmName: undefined, filterByPeriod: undefined, filterByRta: undefined });
							this.fileOrderHistoryListGet({
								days: this.filterForm.get("filterByPeriod").value.value,
								rtId: this.filterForm.get("filterByRta").value.value,
								rmId: this.filterForm.get("filterByRmName").value.id,
							});
						} else {
							this.filterBy = [];
							this.filterForm.patchValue({ filterByName: undefined, filterByRmName: undefined, filterByPeriod: undefined, filterByRta: undefined });
							this.fileOrderHistoryListGet({
								days: 2,
								rmId: this.rmId,
							});
						}
					}
					// this.getClientSubscriptionList();
					subscription.unsubscribe();
				}
			});
	}
}

export interface PeriodicElement {
	advisorName: string;
	rta: string;
	orderedby: string;
	startedOn: string;
	totalfiles: string;
	queue: string;
	ordering: string;
	ordered: string;
	failed: string;
	uploaded: string;
	refresh: string;
	empty: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
	{
		advisorName: "",
		rta: "",
		orderedby: "",
		startedOn: "",
		totalfiles: "",
		queue: "",
		ordering: "",
		ordered: "",
		failed: "",
		uploaded: "",
		refresh: "",
		empty: "",
	},
	{
		advisorName: "",
		rta: "",
		orderedby: "",
		startedOn: "",
		totalfiles: "",
		queue: "",
		ordering: "",
		ordered: "",
		failed: "",
		uploaded: "",
		refresh: "",
		empty: "",
	},
	{
		advisorName: "",
		rta: "",
		orderedby: "",
		startedOn: "",
		totalfiles: "",
		queue: "",
		ordering: "",
		ordered: "",
		failed: "",
		uploaded: "",
		refresh: "",
		empty: "",
	},
];
