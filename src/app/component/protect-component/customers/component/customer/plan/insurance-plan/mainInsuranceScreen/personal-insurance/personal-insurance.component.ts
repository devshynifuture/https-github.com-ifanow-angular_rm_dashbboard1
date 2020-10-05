import { Component, OnInit, Output, EventEmitter, QueryList, ViewChildren, Input } from '@angular/core';
import { MatDialog, MatInput } from '@angular/material';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ValidatorType } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { LinkBankComponent } from 'src/app/common/link-bank/link-bank.component';
import { PlanService } from '../../../plan.service';

@Component({
	selector: 'app-personal-insurance',
	templateUrl: './personal-insurance.component.html',
	styleUrls: ['./personal-insurance.component.scss']
})
export class PersonalInsuranceComponent implements OnInit {
	barButtonOptions: MatProgressButtonOptions = {
		active: false,
		text: 'Save',
		buttonColor: 'accent',
		barColor: 'accent',
		raised: true,
		stroked: false,
		mode: 'determinate',
		value: 10,
		disabled: false,
		fullWidth: false,
		// buttonIcon: {
		//   fontIcon: 'favorite'
		// }
	};
	maxDate = new Date();
	minDate = new Date();
	advisorId: any;
	clientId: any;
	inputData: any;
	addOns: any;
	policyFeature: any;
	nomineesList: any[] = [];
	ownerName: any;
	familyMemberId: any;
	ownerData: any;
	nomineesListFM: any = [];
	familyMemberLifeData: any;
	callMethod: any;
	personalAccidentForm: any;
	dataForEdit: any;
	flag: string;
	nominees: any[];
	addMoreFlag = false;
	id: any;
	accountList: any = [];
	bankAccountDetails: any;
	bankList: any;
	insuredMemberList: any;
	options: any;
	@Output() sendOutput = new EventEmitter<any>();
	storeData: string;
	showInsurance: any;
	insuranceType: any;
	insuranceData = [{
		value: '1',
		header: 'Add Health Insurance',
		smallHeading: 'health insurance',
		insuranceType: 5,
		logo: '/assets/images/svg/helth-insurance.svg',
		heading: 'Health insurance',
		subHeading: 'Select how you’d like to proceed with planning for health insurance policies.'
	}, {
		value: '2',
		logo: '/assets/images/svg/Criticalillness.svg',
		header: 'Add Critical Illness',
		smallHeading: 'critical illness',
		insuranceType: 6,
		heading: 'Critical illness',
		subHeading: 'Select how you’d like to proceed with planning for critical insurance policies.'
	}, {
		value: '3',
		logo: '/assets/images/svg/Cancercare.svg',
		header: 'Add Cancer Care',
		smallHeading: 'cancer care',
		insuranceType: 11,
		heading: 'Cancer care',
		subHeading: 'Select how you’d like to proceed with planning for cancer insurance policies.'
	}, {
		value: '4',
		logo: '/assets/images/svg/Personalaccident.svg',
		header: 'Add Personal Accident',
		heading: 'Personal accident',
		smallHeading: 'personal accident',
		insuranceType: 7,
		subHeading: 'Select how you’d like to proceed with planning for personal insurance policies.'
	}, {
		value: '5',
		logo: '/assets/images/svg/Householders.svg',
		header: 'Add Householders',
		smallHeading: 'householders',
		insuranceType: 9,
		heading: 'Householders',
		subHeading: 'Select how you’d like to proceed with planning for householders insurance policies.'
	}, {
		value: '6',
		logo: '/assets/images/svg/Fireinsurance.svg',
		header: 'Add Fire Insurance',
		smallHeading: 'fire insurance',
		insuranceType: 10,
		heading: 'Fire insurance',
		subHeading: 'Select how you’d like to proceed with planning for fire insurance policies.'
	}, {
		value: '7',
		logo: '/assets/images/svg/Fireinsurance.svg',
		header: 'Add Travel Insurance',
		smallHeading: 'travel insurance',
		insuranceType: 8,
		heading: 'Travel insurance',
		subHeading: 'Select how you’d like to proceed with planning for travel insurance policies.'
	}, {
		value: '8',
		logo: '/assets/images/svg/Fireinsurance.svg',
		header: 'Add Motor Insurance',
		smallHeading: 'motor insurance',
		insuranceType: 4,
		heading: 'Motor insurance',
		subHeading: 'Select how you’d like to proceed with planning for motor insurance policies.'
	}]
	showRecommendation: boolean;
	plannerNotes: any;

	constructor(private planService :PlanService,private dialog: MatDialog, private enumService: EnumServiceService, private datePipe: DatePipe, private fb: FormBuilder, private subInjectService: SubscriptionInject, private customerService: CustomerService, private eventService: EventService) { }
	validatorType = ValidatorType
	@ViewChildren(MatInput) inputs: QueryList<MatInput>;
	@Input() set data(data) {
		this.advisorId = AuthService.getAdvisorId();
		this.clientId = AuthService.getClientId();
		this.inputData = data.inputData;
		this.policyFeature = data.displayList.policyFeature;
		this.addOns = data.displayList.addOns;
		this.getdataForm(data)
		// this.setInsuranceDataFormField(data);
		console.log(data);
	}
	get data() {
		return this.inputData;
	}
	getFormDataNominee(data) {
		console.log(data)
		this.nomineesList = data.controls
	}
	display(value) {
		console.log('value selected', value)
		this.ownerName = value.userName;
		this.familyMemberId = value.familyMemberId
	}
	saveData(data) {
		this.plannerNotes = data;
	}
    checkRecommendation(value) {
        if (!value) {
            this.showRecommendation = true;
        } else {
            this.showRecommendation = false
        }
    }
	lisNominee(value) {
		this.ownerData.Fmember = value;
		this.nomineesListFM = Object.assign([], value);
		this.insuredMemberList = Object.assign([], value);
		this.insuredMemberList.forEach(item => item.isDisabled = false);
	}
	getFamilyMember(data, index) {
		this.familyMemberLifeData = data;
	}


	disabledMember(value, type) {
		this.callMethod = {
			methodName: "disabledMember",
			ParamValue: value,
			disControl: type
		}
	}

	displayControler(con) {
		console.log('value selected', con);
		if (con.owner != null && con.owner) {
			this.personalAccidentForm.controls.getCoOwnerName = con.owner;
		}
		if (con.nominee != null && con.nominee) {
			this.personalAccidentForm.controls.getNomineeName = con.nominee;
		}
	}

	onChangeJointOwnership(data) {
		this.callMethod = {
			methodName: "onChangeJointOwnership",
			ParamValue: data
		}
	}
	get insuredMembersForm() {
		return this.personalAccidentForm.get('InsuredMemberForm') as FormArray;
	}
	get planFeatureForm() {
		return this.personalAccidentForm.get('planFeatureForm') as FormArray;
	}
	get getCoOwner() {
		return this.personalAccidentForm.get('getCoOwnerName') as FormArray;
	}


	addNewCoOwner(data) {
		this.getCoOwner.push(this.fb.group({
			name: [data ? data.name : '', [Validators.required]], share: [data ? data.share : '',], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0], clientId: [data ? data.clientId : 0], userType: [data ? data.userType : 0]
		}));
		if (data) {
			setTimeout(() => {
				this.disabledMember(null, null);
			}, 1300);
		}

		if (this.getCoOwner.value.length > 1 && !data) {
			let share = 100 / this.getCoOwner.value.length;
			for (let e in this.getCoOwner.controls) {
				if (!Number.isInteger(share) && e == "0") {
					this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
				}
				else {
					this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
				}
			}
		}

	}

	removeCoOwner(item) {
		this.getCoOwner.removeAt(item);
		if (this.personalAccidentForm.value.getCoOwnerName.length == 1) {
			this.getCoOwner.controls['0'].get('share').setValue('100');
		} else {
			let share = 100 / this.getCoOwner.value.length;
			for (let e in this.getCoOwner.controls) {
				if (!Number.isInteger(share) && e == "0") {
					this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
				}
				else {
					this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
				}
			}
		}
		this.disabledMember(null, null);
	}
	/***owner***/
	/***nominee***/

	get getNominee() {
		return this.personalAccidentForm.get('getNomineeName') as FormArray;
	}

	removeNewNominee(item) {
		this.disabledMember(null, null);
		this.getNominee.removeAt(item);
		if (this.personalAccidentForm.value.getNomineeName.length == 1) {
			this.getNominee.controls['0'].get('sharePercentage').setValue('100');
		} else {
			let share = 100 / this.getNominee.value.length;
			for (let e in this.getNominee.controls) {
				if (!Number.isInteger(share) && e == "0") {
					this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
				}
				else {
					this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
				}
			}
		}
	}



	addNewNominee(data) {
		this.getNominee.push(this.fb.group({
			name: [data ? data.name : ''], sharePercentage: [data ? data.sumInsured : 0], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0], relationshipId: [data ? data.relationshipId : 0]
		}));
		if (!data || this.getNominee.value.length < 1) {
			for (let e in this.getNominee.controls) {
				this.getNominee.controls[e].get('sharePercentage').setValue(0);
			}
		}

		if (this.getNominee.value.length > 1 && !data) {
			let share = 100 / this.getNominee.value.length;
			for (let e in this.getNominee.controls) {
				if (!Number.isInteger(share) && e == "0") {
					this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
				}
				else {
					this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
				}
			}
		}


	}
	addTransaction(data) {
		this.insuredMembersForm.push(this.fb.group({
			insuredMembers: [data ? data.name : '', [Validators.required]],
			sumAssured: [data ? data.sumInsured : '', [Validators.required]],
			id: [data ? data.id : ''],
			relationshipId: [data ? data.relationshipId : ''],
			familyMemberId: [data ? data.familyMemberId : ''],
			ttdSumInsured: [data ? data.ttdSumInsured : '', [Validators.required]],
			clientId: [data ? data.ttdSumInsured : '', [Validators.required]],
			userType: [data ? data.ttdSumInsured : '', [Validators.required]]

		}));
		this.resetValue(this.insuredMemberList);
		this.getFamilyData(this.insuredMemberList);
	}
	removeTransaction(item) {
		let finalMemberList = this.personalAccidentForm.get('InsuredMemberForm') as FormArray
		if (finalMemberList.length > 1) {
			this.insuredMembersForm.removeAt(item);
		}
		this.resetValue(this.insuredMemberList);
		this.getFamilyData(this.insuredMemberList);
	}
	resetValue(data) {
		if (data) {
			data.forEach(item => item.isDisabled = false);
		}
	}
	addNewFeature(data) {
		this.planFeatureForm.push(this.fb.group({
			planfeatures: [data ? data.policyFeatureId + '' : ''],
		}));
	}
	removeNewFeature(item) {
		let finalFeatureList = this.personalAccidentForm.get('planFeatureForm') as FormArray
		if (finalFeatureList.length > 1) {
			this.planFeatureForm.removeAt(item);

		}
	}
	openOptionField() {
		(this.addMoreFlag) ? this.addMoreFlag = false : this.addMoreFlag = true;
	}
	preventDefault(e) {
		e.preventDefault();
	}
	getOwnerData(value, data) {

		data.forEach(element => {
			for (const e in this.getCoOwner.controls) {
				const name = this.getCoOwner.controls[e].get('name');
				if (element.userName == name.value) {
					this.getCoOwner.controls[e].get('name').setValue(element.userName);
					this.getCoOwner.controls[e].get('familyMemberId').setValue(element.id);
					this.getCoOwner.controls[e].get('clientId').setValue(element.clientId);
					this.getCoOwner.controls[e].get('userType').setValue(element.userType);

				}
			}

		});



	}
	getdataForm(data) {
		this.dataForEdit = data.data;
		if (data.data == null) {
			data = {};
			this.dataForEdit = data.data;
			this.flag = "Add";
		}
		else {
			this.dataForEdit = data.data;
			this.id = this.dataForEdit.id;
			this.flag = "Edit";
		}
		this.personalAccidentForm = this.fb.group({
			// ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required]],
			getCoOwnerName: this.fb.array([this.fb.group({
				name: ['', [Validators.required]],
				share: [0,],
				familyMemberId: 0,
				id: 0,
				isClient: 0,
				userType: 0,
				clientId: 0
			})]),
			name: [(this.dataForEdit ? this.dataForEdit.name : null)],
			policyNum: [(this.dataForEdit ? this.dataForEdit.policyNumber : null), [Validators.required]],
			insurerName: [(this.dataForEdit ? this.dataForEdit.insurerName : null), [Validators.required]],
			planeName: [(this.dataForEdit ? this.dataForEdit.planName : null), [Validators.required]],
			premium: [(this.dataForEdit ? this.dataForEdit.premiumAmount : null), [Validators.required]],
			policyStartDate: [this.dataForEdit ? new Date(this.dataForEdit.policyStartDate) : null, [Validators.required]],
			policyExpiryDate: [this.dataForEdit ? new Date(this.dataForEdit.policyExpiryDate) : null, [Validators.required]],
			cumulativeBonus: [this.dataForEdit ? this.dataForEdit.cumulativeBonus : null],
			bonusType: [this.dataForEdit ? this.dataForEdit.cumulativeBonusRupeesOrPercent + '' : '1'],
			planfeatures: [(this.dataForEdit ? this.dataForEdit.policyFeatureId + '' : null)],
			exclusion: [this.dataForEdit ? this.dataForEdit.exclusion : null],
			// inceptionDate: [this.dataForEdit ? new Date(this.dataForEdit.policyInceptionDate) : null],
			inceptionDate: [(this.dataForEdit) ? ((this.dataForEdit.policyInceptionDate) ? new Date(this.dataForEdit.policyInceptionDate) : null) : null],
			tpaName: [this.dataForEdit ? this.dataForEdit.tpaName : null],
			advisorName: [this.dataForEdit ? this.dataForEdit.advisorName : null],
			serviceBranch: [this.dataForEdit ? this.dataForEdit.serviceBranch : null],
			bankAccount: [this.dataForEdit ? parseInt(this.dataForEdit.linkedBankAccount) : null],
			nominees: this.nominees,
			getNomineeName: this.fb.array([this.fb.group({
				name: [''],
				sharePercentage: [0],
				familyMemberId: [0],
				id: [0],
				relationshipId: [0]
			})]),
			InsuredMemberForm: this.fb.array([this.fb.group({
				insuredMembers: ['', [Validators.required]],
				sumAssured: [null, [Validators.required]],
				id: [0],
				familyMemberId: [''],
				relationshipId: [''],
				ttdSumInsured: ['', [Validators.required]],
				clientId: ['', [Validators.required]],
				userType: ['', [Validators.required]]
			})]),
			planFeatureForm: this.fb.array([this.fb.group({
				planfeatures: [''],
			})])
		})
		// ==============owner-nominee Data ========================\\
		/***owner***/
		if (this.personalAccidentForm.value.getCoOwnerName.length == 1) {
			this.getCoOwner.controls['0'].get('share').setValue('100');
		}

		if (this.dataForEdit) {
			this.getCoOwner.removeAt(0);
			const data = {
				name: this.dataForEdit.policyHolderName,
				familyMemberId: this.dataForEdit.policyHolderId
			}
			this.addNewCoOwner(data);
		}

		/***owner***/

		/***nominee***/
		if (this.dataForEdit) {
			if (this.dataForEdit.nominees.length > 0) {
				this.getNominee.removeAt(0);
				this.dataForEdit.nominees.forEach(element => {
					this.addNewNominee(element);
				});
			}
		}
		/***nominee***/
		if (this.dataForEdit) {
			if (this.dataForEdit.insuredMembers.length > 0) {
				this.insuredMembersForm.removeAt(0);
				this.dataForEdit.insuredMembers.forEach(element => {
					this.addTransaction(element);
				});
			}
		}
		if (this.dataForEdit) {
			if (this.dataForEdit.policyFeatures.length > 0) {
				this.planFeatureForm.removeAt(0);
				this.dataForEdit.policyFeatures.forEach(element => {
					this.addNewFeature(element);
				});
			}
		}
		this.bankAccountDetails = { accountList: this.accountList, controleData: this.personalAccidentForm }
		this.ownerData = { Fmember: this.nomineesListFM, controleData: this.personalAccidentForm }

		// this.finalCashFlowData = [];
		// ==============owner-nominee Data ========================\\ 
		// this.DOB = data.dateOfBirth
		// this.ownerData = this.personalAccidentForm.controls;
		// this.familyMemberId = data.familyMemberId;
	}
	// bankAccountList(value) {
	//   this.bankList = value;
	// }
	getFamilyData(data) {
		if (data) {
			data.forEach(element => {
				for (let e in this.insuredMembersForm.controls) {
					let name = this.insuredMembersForm.controls[e].get('insuredMembers')
					if (element.userName == name.value) {
						this.insuredMembersForm.controls[e].get('insuredMembers').setValue(element.userName);
						this.insuredMembersForm.controls[e].get('familyMemberId').setValue(element.familyMemberId);
						this.insuredMembersForm.controls[e].get('relationshipId').setValue(element.relationshipId);
						this.insuredMembersForm.controls[e].get('clientId').setValue(element.clientId);
						this.insuredMembersForm.controls[e].get('userType').setValue(element.userType);
						element.isDisabled = true;
					}
				}

			});
		}
	}
	ngOnInit() {
		this.storeData = '';
		console.log('heder', this.inputData)
		this.insuranceData.forEach(element => {
			if (element.value == this.inputData.value) {
				this.showInsurance = element
				this.insuranceType = element.insuranceType
			}
		});
		this.bankList = this.enumService.getBank();
		this.minDate.setFullYear(this.minDate.getFullYear() - 100);
	}
	changeSign(event, value, formValue) {
		this.personalAccidentForm.get(value).setValue('');
		if (event == '2') {
			if (parseInt(formValue) > 100) {
				this.personalAccidentForm.get(value).setValue('');
			}
		}
	}
	changeTheInput(form1, form2, event) {
		if (form1 == '2') {
			if (parseInt(event.target.value) > 100) {
				this.personalAccidentForm.get(form2).setValue('100');
			}
		} else {
			this.personalAccidentForm.get(form2).setValue(event.target.value);
		}

	}
	dateChange(value, form, formValue) {
		if (form == 'policyExpiryDate' && formValue) {
			let startDate = new Date(this.personalAccidentForm.controls.policyStartDate.value);
			let policyExpiryDate = this.datePipe.transform(this.personalAccidentForm.controls.policyExpiryDate.value, 'yyyy/MM/dd')
			let comparedDate: any = startDate;
			comparedDate = comparedDate.setFullYear(startDate.getFullYear() + 1);
			comparedDate = new Date(comparedDate);
			comparedDate = comparedDate.setDate(comparedDate.getDate() - 1);
			comparedDate = this.datePipe.transform(comparedDate, 'yyyy/MM/dd')
			if (policyExpiryDate < comparedDate) {
				this.personalAccidentForm.get('policyExpiryDate').setErrors({ max: 'Date of repayment' });
				this.personalAccidentForm.get('policyExpiryDate').markAsTouched();
			} else {
				this.personalAccidentForm.get('policyExpiryDate').setErrors();
			}
		} else {
			if (formValue) {
				let policyExpiryDate = this.datePipe.transform(this.personalAccidentForm.controls.policyExpiryDate.value, 'yyyy/MM/dd')
				let policyStartDate = this.datePipe.transform(this.personalAccidentForm.controls.policyStartDate.value, 'yyyy/MM/dd')

				if (policyStartDate >= policyExpiryDate) {
					this.personalAccidentForm.get('policyExpiryDate').setErrors({ max: 'Date of repayment' });
					this.personalAccidentForm.get('policyExpiryDate').markAsTouched();
				} else {
					this.personalAccidentForm.get('policyExpiryDate').setErrors();

				}
			}
		}

	}
	findCompanyName(data) {
		const inpValue = this.personalAccidentForm.get('insurerName').value;
		this.customerService.getCompanyNames(inpValue).subscribe(
			data => {
				console.log(data);
				this.options = data;
			}
		);
	}
	getBank() {
		if (this.enumService.getBank().length > 0) {
			this.bankList = this.enumService.getBank();
		}
		else {
			this.bankList = [];
		}
		console.log(this.bankList, "this.bankList2");
	}
	openDialog(eventData): void {
		const dialogRef = this.dialog.open(LinkBankComponent, {
			width: '50%',
			data: { bankList: this.bankList, userInfo: true, ownerList: this.getCoOwner }
		});

		dialogRef.afterClosed().subscribe(result => {
			setTimeout(() => {
				this.bankList = this.enumService.getBank();
			}, 5000);
		})

	}
	getClientId() {

		this.nomineesListFM.forEach(element => {
			for (const e in this.getCoOwner.controls) {
				const id = this.getCoOwner.controls[e].get('familyMemberId');
				if (element.familyMemberId == id.value) {
					this.getCoOwner.controls[e].get('name').setValue(element.userName);
					this.getCoOwner.controls[e].get('familyMemberId').setValue(element.id);
					this.getCoOwner.controls[e].get('clientId').setValue(element.clientId);
					this.getCoOwner.controls[e].get('userType').setValue(element.userType);

				}
			}

		});



	}
	savePersonalAccident() {
		this.getClientId();
		let memberList = [];
		let finalMemberList = this.personalAccidentForm.get('InsuredMemberForm') as FormArray
		finalMemberList.controls.forEach(element => {
			let obj =
			{
				familyMemberId: element.get('userType').value == 2 ? element.get('clientId').value : element.get('familyMemberId').value,
				sumInsured: element.get('sumAssured').value,
				relationshipId: element.get('relationshipId').value,
				insuredOrNominee: 1,
				id: (element.get('id').value) ? element.get('id').value : null,
				ttdSumInsured: element.get('ttdSumInsured').value
			}
			memberList.push(obj)
		})
		let featureList = [];
		let finalplanFeatureList = this.personalAccidentForm.get('planFeatureForm') as FormArray
		if (finalplanFeatureList.controls.length > 0)
			finalplanFeatureList.controls.forEach(element => {
				if (element.get('planfeatures').value != "") {
					let obj =
					{
						policyFeatureId: element.get('planfeatures').value,
					}
					featureList.push(obj)
				}
			})
		this.personalAccidentForm.get('inceptionDate').setErrors(null);
		if (this.personalAccidentForm.invalid) {
			this.personalAccidentForm.markAllAsTouched();
		} else {
			this.barButtonOptions.active = true;
			const obj = {
				"clientId": this.clientId,
				"advisorId": this.advisorId,
				'policyHolderId': (this.personalAccidentForm.value.getCoOwnerName[0].userType == 2) ? this.personalAccidentForm.value.getCoOwnerName[0].clientId : this.personalAccidentForm.value.getCoOwnerName[0].familyMemberId,
				"policyStartDate": this.datePipe.transform(this.personalAccidentForm.get('policyStartDate').value, 'yyyy-MM-dd'),
				"policyExpiryDate": this.datePipe.transform(this.personalAccidentForm.get('policyExpiryDate').value, 'yyyy-MM-dd'),
				"cumulativeBonus": this.personalAccidentForm.get('cumulativeBonus').value,
				"cumulativeBonusRupeesOrPercent": this.personalAccidentForm.get('bonusType').value,
				"planName": this.personalAccidentForm.get('planeName').value,
				"exclusion": this.personalAccidentForm.get('exclusion').value,
				"premiumAmount": this.personalAccidentForm.get('premium').value,
				"tpaName": this.personalAccidentForm.get('tpaName').value,
				"advisorName": this.personalAccidentForm.get('advisorName').value,
				"serviceBranch": this.personalAccidentForm.get('serviceBranch').value,
				"linkedBankAccount": this.personalAccidentForm.get('bankAccount').value,
				"policyNumber": this.personalAccidentForm.get('policyNum').value,
				"policyInceptionDate": this.datePipe.transform(this.personalAccidentForm.get('inceptionDate').value, 'yyyy-MM-dd'),
				"policyFeatures": featureList,
				"insurerName": this.personalAccidentForm.get('insurerName').value,
				"insuranceSubTypeId": this.inputData.insuranceSubTypeId,
				"id": (this.id) ? this.id : null,
				'realOrFictitious':2,
            	'suggestion':this.plannerNotes,
				insuredMembers: memberList,
				nominees: this.personalAccidentForm.value.getNomineeName,
			}

			if (obj.nominees.length > 0) {
				obj.nominees.forEach((element, index) => {
					if (element.name == '') {
						this.removeNewNominee(index);
					}
				});
				obj.nominees = this.personalAccidentForm.value.getNomineeName;
				obj.nominees.forEach(element => {
					if (element.sharePercentage) {
						element.sumInsured = element.sharePercentage;
					}
					element.insuredOrNominee = 2
				});
			} else {
				obj.nominees = [];
			}
			console.log(obj);



			if (this.dataForEdit) {
				this.customerService.editGeneralInsuranceData(obj).subscribe(
					data => {
						this.barButtonOptions.active = false;
						console.log(data);
						this.eventService.openSnackBar("Updated successfully!", 'Dismiss');
						const insuranceData =
						{
							insuranceTypeId: this.inputData.insuranceTypeId,
							insuranceSubTypeId: this.inputData.insuranceSubTypeId
						}
						this.close(insuranceData)
					}
				);
			} else {
				this.planService.addGenralInsurancePlan(obj).subscribe(
					data => {
						this.barButtonOptions.active = false;
						console.log(data);
						this.eventService.openSnackBar("Added successfully!", 'Dismiss');
						const insuranceData =
						{
							insuranceTypeId: this.inputData.insuranceTypeId,
							insuranceSubTypeId: this.inputData.insuranceSubTypeId
						}
						this.close(insuranceData)
					},err=>{
						this.close('');
					}
				);
			}
		}
	}
	close(data) {
		this.addMoreFlag = false;
		if (this.inputData.id) {
			this.subInjectService.changeNewRightSliderState({ state: 'close', data });
		} else {
			this.sendOutput.emit(true);
		}
	}
}
