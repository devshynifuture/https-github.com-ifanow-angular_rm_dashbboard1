import { Component, OnInit, EventEmitter, QueryList, ViewChildren, Output, Input } from '@angular/core';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { MatDialog, MatInput } from '@angular/material';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { ValidatorType } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { LinkBankComponent } from 'src/app/common/link-bank/link-bank.component';
import { PlanService } from '../../../plan.service';

@Component({
	selector: 'app-travel-insurance',
	templateUrl: './travel-insurance.component.html',
	styleUrls: ['./travel-insurance.component.scss']
})
export class TravelInsuranceComponent implements OnInit {
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
	travelInsuranceForm: any;
	dataForEdit: any;
	flag: string;
	nominees: any[];
	addMoreFlag = false;
	policyList: any;
	id: any;
	showinsuredMemberSum = true;
	showSumAssured = false;
	insuredMemberList: any;
	options: any;
	bankList: any;
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
		logo: '/assets/images/svg/Travel.svg',
		header: 'Add Travel Insurance',
		smallHeading: 'travel insurance',
		insuranceType: 8,
		heading: 'Travel insurance',
		subHeading: 'Select how you’d like to proceed with planning for travel insurance policies.'
	}, {
		value: '8',
		logo: '/assets/images/svg/Motor.svg',
		header: 'Add Motor Insurance',
		smallHeading: 'motor insurance',
		insuranceType: 4,
		heading: 'Motor insurance',
		subHeading: 'Select how you’d like to proceed with planning for motor insurance policies.'
	},{
        value: '9',
        logo: '/assets/images/svg/Fireinsurance.svg',
        header: 'Add Other Insurance',
        smallHeading: 'other insurance',
        insuranceType: 11,
        heading: 'Other insurance',
        subHeading: 'Select how you’d like to proceed with planning for other insurance policies.'
      }]
	showRecommendation: boolean;
	storeData: string;
	insuranceType: number;
	showInsurance: { value: string; header: string; smallHeading: string; insuranceType: number; logo: string; heading: string; subHeading: string; };
	plannerNotes: any;
	ownerIds = [];
	insData: any;
	isRecommended: boolean;
	recommendOrNot: any;
	adviceDetails: any;
	adviceName: any;
	adviceData: any;
	showHeader: any;
	fakeData: any;
	constructor(private planService :PlanService,private dialog: MatDialog, private datePipe: DatePipe, private fb: FormBuilder, private subInjectService: SubscriptionInject, private customerService: CustomerService, private eventService: EventService, private enumService: EnumServiceService) { }
	validatorType = ValidatorType
	@Output() sendOutput = new EventEmitter<any>();
	@ViewChildren(MatInput) inputs: QueryList<MatInput>;
	@Input() set data(data) {
		this.advisorId = AuthService.getAdvisorId();
		this.clientId = AuthService.getClientId();
		this.insData = data;
		this.inputData = data.inputData;
		this.adviceDetails = data.adviceDetails? data.adviceDetails: null;
        this.adviceName = data.adviceNameObj ? data.adviceNameObj.adviceName : null;
        this.adviceData = data.adviceStringObj ? data.adviceStringObj : null;
        this.showHeader = data.flag;
		this.policyList = data.displayList.policyTypes;
		this.policyFeature = data.displayList.policyFeature;
		this.addOns = data.displayList.addOns;
		this.recommendOrNot = data.recommendOrNot;
		this.getdataForm(data)
		// this.setInsuranceDataFormField(data);
		console.log(data);
	}
	get data() {
		return this.inputData;
	}
	changeAdviceName(data){
        this.adviceName = data.adviceName; 
        this.fakeData = this.insData.data ?this.insData.data : this.fakeData;
        if(this.adviceName == 'Port policy'){
            this.insData.data = null   
        }else{
            this.insData.data = this.fakeData;
        }
        this.adviceName == 'Port policy' ? this.insData.data = null : '';
        this.getdataForm(this.insData);
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
	displayControler(con) {
		console.log('value selected', con);
		if (con.owner != null && con.owner) {
			this.travelInsuranceForm.controls.getCoOwnerName = con.owner;
		}
		if (con.nominee != null && con.nominee) {
			this.travelInsuranceForm.controls.getNomineeName = con.nominee;
		}
	}

	onChangeJointOwnership(data) {
		this.callMethod = {
			methodName: "onChangeJointOwnership",
			ParamValue: data
		}
	}
	get insuredMembersForm() {
		return this.travelInsuranceForm.get('InsuredMemberForm') as FormArray;
	}
	get planFeatureForm() {
		return this.travelInsuranceForm.get('planFeatureForm') as FormArray;
	}
	get getCoOwner() {
		return this.travelInsuranceForm.get('getCoOwnerName') as FormArray;
	}


	addNewCoOwner(data) {
		this.getCoOwner.push(this.fb.group({
			name: [data ? data.name : '', [Validators.required]], share: [data ? data.share : ''], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0], clientId: [data ? data.clientId : 0], userType: [data ? data.userType : 0]
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
	saveData(data) {
		this.plannerNotes = data;
	}
	checkRecommendation(value) {
		if (value) {
			this.showRecommendation = true;
		} else {
			this.showRecommendation = false;
		}
	}
	removeCoOwner(item) {
		this.getCoOwner.removeAt(item);
		if (this.travelInsuranceForm.value.getCoOwnerName.length == 1) {
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
		return this.travelInsuranceForm.get('getNomineeName') as FormArray;
	}

	removeNewNominee(item) {
		this.disabledMember(null, null);
		this.getNominee.removeAt(item);
		if (this.travelInsuranceForm.value.getNomineeName.length == 1) {
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
			ttdSumAssured: [data ? data.ttdSumAssured : ''],
			clientId: [data ? data.clientId : ''],
			userType: [data ? data.userType : '']

		}));
		this.resetValue(this.insuredMemberList);
		this.getFamilyData(this.insuredMemberList);
		this.onChangeSetErrorsType(this.travelInsuranceForm.get('planDetails').value, 'planDetails')

	}
	removeTransaction(item) {
		let finalMemberList = this.travelInsuranceForm.get('InsuredMemberForm') as FormArray
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
		let finalFeatureList = this.travelInsuranceForm.get('planFeatureForm') as FormArray
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
			if (this.dataForEdit) {
				this.storeData = this.dataForEdit.suggestion;
				this.isRecommended = this.dataForEdit ? (this.dataForEdit.isRecommend ? true : false) : false
				this.showRecommendation = this.isRecommended;
			}
		}
		this.travelInsuranceForm = this.fb.group({
			// ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required]],
			getCoOwnerName: this.fb.array([this.fb.group({
				name: ['', [Validators.required]],
				share: [0,],
				familyMemberId: null,
				id: 0,
				isClient: 0,
				clientId: 0,
				userType: 0

			})]),
			name: [(this.dataForEdit ? this.dataForEdit.name : null)],
			PlanType: [(this.dataForEdit ? this.dataForEdit.policyTypeId + '' : null), [Validators.required]],
			planDetails: [(this.dataForEdit ? this.dataForEdit.policyFeatureId + '' : null), [Validators.required]],
			// policyNum: [(this.dataForEdit ? this.dataForEdit.policyNumber : null), [Validators.required]],
			insurerName: [(this.dataForEdit ? this.dataForEdit.insurerName : null), [Validators.required]],
			sumAssuredIdv: [(this.dataForEdit) ? this.dataForEdit.sumInsuredIdv : null, [Validators.required]],
			planeName: [(this.dataForEdit ? this.dataForEdit.planName : null), [Validators.required]],
			premium: [(this.dataForEdit ? this.dataForEdit.premiumAmount : null), [Validators.required]],
			// policyStartDate: [this.dataForEdit ? new Date(this.dataForEdit.policyStartDate) : null, [Validators.required]],
			// policyExpiryDate: [this.dataForEdit ? new Date(this.dataForEdit.policyExpiryDate) : null, [Validators.required]],
			geography: [this.dataForEdit ? this.dataForEdit.geographyId + '' : null],
			exclusion: [this.dataForEdit ? this.dataForEdit.exclusion : null],
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
				ttdSumAssured: [''],
				clientId: [''],
				userType: ['']

			})]),
			planFeatureForm: this.fb.array([this.fb.group({
				planfeatures: [''],
			})])
		})
		// ==============owner-nominee Data ========================\\
		/***owner***/
		if (this.travelInsuranceForm.value.getCoOwnerName.length == 1) {
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
			if (this.dataForEdit.nominees && this.dataForEdit.nominees.length > 0) {
				this.getNominee.removeAt(0);
				this.dataForEdit.nominees.forEach(element => {
					this.addNewNominee(element);
				});
			}
		}
		/***nominee***/
		if (this.dataForEdit) {
			if(this.dataForEdit.insuredMembers && this.dataForEdit.insuredMembers.length > 0){
				this.insuredMembersForm.removeAt(0);
				this.dataForEdit.insuredMembers.forEach(element => {
					this.addTransaction(element);
				});
			}
		}

		if (this.dataForEdit) {
			if (this.dataForEdit.policyFeatures && this.dataForEdit.policyFeatures.length > 0) {
				this.planFeatureForm.removeAt(0);
				this.dataForEdit.policyFeatures.forEach(element => {
					this.addNewFeature(element);
				});
			}
		}
		if (this.dataForEdit) {
			if (this.dataForEdit.insuredMembers && this.dataForEdit.insuredMembers.length > 0) {
				this.dataForEdit.insuredMembers.forEach(element => {
					if (element.sumInsured == 0) {
						this.showinsuredMemberSum = false
					}
				});
			}
		}

		if (this.travelInsuranceForm.get('planDetails').value == '1') {
			this.showSumAssured = true;
		} else {
			this.showSumAssured = false;
		}
		this.ownerData = { Fmember: this.nomineesListFM, controleData: this.travelInsuranceForm }

		// this.finalCashFlowData = [];
		// ==============owner-nominee Data ========================\\ 
		// this.DOB = data.dateOfBirth
		// this.ownerData = this.travelInsuranceForm.controls;
		// this.familyMemberId = data.familyMemberId;
	}
	ngOnInit() {
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
	openDialog(eventData): void {
		const dialogRef = this.dialog.open(LinkBankComponent, {
			width: '50%',
			data: { bankList: this.bankList, userInfo: true, ownerList: this.getCoOwner }
		});

		dialogRef.afterClosed().subscribe(result => {
			setTimeout(() => {
				this.bankList = this.enumService.getBank();
			}, 5000);
		});

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
	dateChange(value, form, formValue) {
		if (form == 'policyExpiryDate' && formValue) {
			let startDate = new Date(this.travelInsuranceForm.controls.policyStartDate.value);
			let policyExpiryDate = this.datePipe.transform(this.travelInsuranceForm.controls.policyExpiryDate.value, 'yyyy/MM/dd')
			let comparedDate: any = this.datePipe.transform(this.travelInsuranceForm.controls.policyStartDate.value, 'yyyy/MM/dd');
			// let comparedDate: any = new Date(this.travelInsuranceForm.controls.policyStartDate.value);
			// comparedDate = comparedDate.setFullYear(startDate.getFullYear() + 1);
			// comparedDate = this.datePipe.transform(comparedDate, 'yyyy/MM/dd')
			if (policyExpiryDate < comparedDate) {
				this.travelInsuranceForm.get('policyExpiryDate').setErrors({ max: 'Date of repayment' });
				this.travelInsuranceForm.get('policyExpiryDate').markAsTouched();
			} else {
				this.travelInsuranceForm.get('policyExpiryDate').setErrors();
			}
		} else {
			if (formValue) {
				let policyExpiryDate = this.datePipe.transform(this.travelInsuranceForm.controls.policyExpiryDate.value, 'yyyy/MM/dd')
				let policyStartDate = this.datePipe.transform(this.travelInsuranceForm.controls.policyStartDate.value, 'yyyy/MM/dd')

				if (policyStartDate >= policyExpiryDate) {
					this.travelInsuranceForm.get('policyExpiryDate').setErrors({ max: 'Date of repayment' });
					this.travelInsuranceForm.get('policyExpiryDate').markAsTouched();
				} else {
					this.travelInsuranceForm.get('policyExpiryDate').setErrors();

				}
			}
		}

	}
	findCompanyName(data) {
		const inpValue = this.travelInsuranceForm.get('insurerName').value;
		this.customerService.getCompanyNames(inpValue).subscribe(
			data => {
				console.log(data);
				this.options = data;
				if (data.length > 0) {
					this.options = data;
				} else {
					this.travelInsuranceForm.controls.insurerName.setErrors({ erroInPolicy: true });
					this.travelInsuranceForm.get('insurerName').markAsTouched();
				}
			},
			err => {
				this.travelInsuranceForm.controls.insurerName.setErrors({ erroInPolicy: true });
				this.travelInsuranceForm.get('insurerName').markAsTouched();
			}
		);
	}

	onChangeSetErrorsType(value, formName) {
		if (value == 1) {
			this.showSumAssured = true
			this.showinsuredMemberSum = false
			let list = this.travelInsuranceForm.get('InsuredMemberForm') as FormArray;
			list.controls.forEach(element => {
				element.get('sumAssured').setValue(null);
				if (element.get('sumAssured').value == '' || element.get('sumAssured').value == null) {
					element.get('sumAssured').setErrors(null);
					element.get('sumAssured').setValidators(null);
				}
			});
			if (!this.travelInsuranceForm.controls['sumAssuredIdv'].value) {
				this.travelInsuranceForm.controls['sumAssuredIdv'].setValue(null);
				this.travelInsuranceForm.get('sumAssuredIdv').setValidators([Validators.required]);
				this.travelInsuranceForm.get('sumAssuredIdv').updateValueAndValidity();
				this.travelInsuranceForm.controls['sumAssuredIdv'].setErrors({ 'required': true });
			}
		} else {
			this.showSumAssured = false
			this.showinsuredMemberSum = true
			this.travelInsuranceForm.controls['sumAssuredIdv'].setValue(null);
			this.travelInsuranceForm.controls['sumAssuredIdv'].setErrors(null);
			this.travelInsuranceForm.controls['sumAssuredIdv'].setValidators(null);
		}
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
	saveTravelInsurance() {
		this.getClientId();
		let memberList = [];
		let suggestNewData;
		let finalMemberList = this.travelInsuranceForm.get('InsuredMemberForm') as FormArray
		finalMemberList.controls.forEach(element => {
			let obj =
			{
				familyMemberId: element.get('userType').value == 2 ? element.get('clientId').value : element.get('familyMemberId').value,
				sumInsured: element.get('sumAssured').value,
				relationshipId: element.get('relationshipId').value,
				insuredOrNominee: 1,
				id: (element.get('id').value) ? element.get('id').value : null,
				ttdSumAssured: element.get('id').value
			}
			memberList.push(obj)
		})
		let featureList = [];
		let finalplanFeatureList = this.travelInsuranceForm.get('planFeatureForm') as FormArray
		finalplanFeatureList.controls.forEach(element => {
			if (element.get('planfeatures').value) {
				let obj =
				{
					policyFeatureId: element.get('planfeatures').value,
				}
				featureList.push(obj)
			}
		})
		if (this.travelInsuranceForm.invalid) {
			if (this.travelInsuranceForm.get('planDetails').value == '1') {
				this.travelInsuranceForm.controls['sumAssuredIdv'].setErrors({ 'required': true });
			}
			this.travelInsuranceForm.markAllAsTouched();
		} else {
			this.barButtonOptions.active = true;
			const obj = {
				"clientId": this.clientId,
				"advisorId": this.advisorId,
				'policyHolderId': (this.travelInsuranceForm.value.getCoOwnerName[0].userType == 2) ? this.travelInsuranceForm.value.getCoOwnerName[0].clientId : this.travelInsuranceForm.value.getCoOwnerName[0].familyMemberId,
				"policyTypeId": this.travelInsuranceForm.get('PlanType').value,
				"policyFeatureId": this.travelInsuranceForm.get('planDetails').value,
				"insurerName": this.travelInsuranceForm.get('insurerName').value,
				// "policyNumber": this.travelInsuranceForm.get('policyNum').value,
				"planName": this.travelInsuranceForm.get('planeName').value,
				"premiumAmount": this.travelInsuranceForm.get('premium').value,
				// "policyStartDate": this.datePipe.transform(this.travelInsuranceForm.get('policyStartDate').value, 'yyyy-MM-dd'),
				// "policyExpiryDate": this.datePipe.transform(this.travelInsuranceForm.get('policyExpiryDate').value, 'yyyy-MM-dd'),
				"geographyId": this.travelInsuranceForm.get('geography').value,
				"exclusion": this.travelInsuranceForm.get('exclusion').value,
				"tpaName": this.travelInsuranceForm.get('tpaName').value,
				"advisorName": this.travelInsuranceForm.get('advisorName').value,
				"serviceBranch": this.travelInsuranceForm.get('serviceBranch').value,
				"insuranceSubTypeId": this.insuranceType,
				'sumInsuredIdv': this.travelInsuranceForm.get('sumAssuredIdv').value,
				'linkedBankAccount': this.travelInsuranceForm.get('bankAccount').value,
				"policyFeatures": featureList,
				"id": (this.id) ? this.id : null,
				'realOrFictitious': 2,
				'suggestion': this.plannerNotes,
                'isRecommend': this.showRecommendation ? 1 : 0,
				insuredMembers: memberList,
				nominees: this.travelInsuranceForm.value.getNomineeName,
			}

			if (obj.nominees.length > 0) {
				obj.nominees.forEach((element, index) => {
					if (element.name == '') {
						this.removeNewNominee(index);
					}
				});
				obj.nominees = this.travelInsuranceForm.value.getNomineeName;
				obj.nominees.forEach(element => {
					if (element.sharePercentage) {
						element.sumInsured = element.sharePercentage;
					}
					element.insuredOrNominee = 2
				});
			} else {
				obj.nominees = [];
			}
			if (obj.insuredMembers.length > 0) {
				obj.insuredMembers.forEach(element => {
					if (element.sumInsured == '') {
						element.sumInsured = null
					}
				});
			}
			if (obj && obj.hasOwnProperty('insuredMembers') && obj.insuredMembers.length > 0) {
				obj.insuredMembers.forEach(ele => {
					this.ownerIds.push({
						'ownerId': ele.familyMemberId == this.clientId ? 0 : ele.familyMemberId
					})
				});
			} else {
				this.ownerIds.push({
					'ownerId': obj.policyHolderId == this.clientId ? 0 : obj.policyHolderId
				})
			}
			console.log(obj);



			if (this.dataForEdit) {
				this.planService.editGenralInsurancePlan(obj).subscribe(
					data => {
						this.barButtonOptions.active = false;
						console.log(data);
						this.eventService.openSnackBar("Updated successfully!", 'Dismiss');
						const insuranceData =
						{
							insuranceTypeId: this.inputData.insuranceTypeId,
							insuranceSubTypeId: this.insuranceType,
							id: data ? data : null
						}
						this.close(insuranceData, true)
					}
				);
			} else {
				this.planService.addGenralInsurancePlan(obj).subscribe(
					data => {
						console.log(data);
						if (this.inputData.flag == 'ExistingSuggestNew') {
							const obj = {
								"id": this.inputData.id,
								"insuranceIds": JSON.stringify([data])
							}
							this.planService.updateCurrentPolicyGeneralInsurance(obj).subscribe(
								data => {
									this.barButtonOptions.active = false;
									console.log(data);
									const insuranceData =
									{
										insuranceTypeId: suggestNewData ? suggestNewData : this.inputData.insuranceTypeId,
										insuranceSubTypeId: this.insuranceType,
										id: data ? data : null
									};
									this.eventService.openSnackBar('Added successfully!', 'Dismiss');
									this.close(insuranceData, true);
								},
								err => {
									this.eventService.openSnackBar(err, 'Dismiss');
								}
							);
						} else {
							let obj = {
								"planningList":
									JSON.stringify({
										"advisorId": this.advisorId,
										"clientId": this.clientId,
										"insuranceType": this.insuranceType,
										"owners": this.ownerIds
									}),
								"needAnalysis": JSON.stringify([data])
							}
							this.planService.addGeneralInsurance(obj).subscribe(
								data => {
									this.barButtonOptions.active = false;
									suggestNewData = data;
									//   this.barButtonOptions.active = false;
									//   this.subInjectService.changeNewRightSliderState({ state: 'close' ,refreshRequired: true});
									console.log(data);
									const insuranceData =
									{
										insuranceTypeId: suggestNewData ? suggestNewData : this.inputData.insuranceTypeId,
										insuranceSubTypeId: this.insuranceType,
										id: data ? data : null
									};
									this.eventService.openSnackBar('Added successfully!', 'Dismiss');
									this.close(insuranceData, true);
								},
								err => {
									this.eventService.openSnackBar(err, 'Dismiss');
								}
							);
						}
					}, err => {
						this.close('', true);
					}
				);
			}
		}
	}
	close(data, flag) {
		if (data.id) {
			this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: flag });
			this.sendOutput.emit(data);
		} else {
			if (data.flag == 'SuggestNew') {
				this.sendOutput.emit(false);
			} else {
				this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: flag });
			}
		}
	}


}
