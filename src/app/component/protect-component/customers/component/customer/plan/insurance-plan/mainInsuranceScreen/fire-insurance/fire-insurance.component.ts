import { Component, OnInit, QueryList, ViewChildren, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ValidatorType } from 'src/app/services/util.service';
import { MatInput } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { PlanService } from '../../../plan.service';

@Component({
	selector: 'app-fire-insurance',
	templateUrl: './fire-insurance.component.html',
	styleUrls: ['./fire-insurance.component.scss']
})
export class FireInsuranceComponent implements OnInit {
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

	inputData: any;
	ownerName: any;
	nomineesListFM: any = [];
	familyMemberId: any;
	advisorId: any;
	clientId: any;
	insuranceId: any;
	addMoreFlag = false;
	FamilyMember: any;
	ProposerData: any;
	familyMemberLifeData: any;
	nominees: any[];
	flag: string;
	ownerData: any;
	callMethod: any;
	fireInsuranceForm: any;
	displayList: any;
	nomineesList: any[] = [];
	policyList: any;
	addOns: any;
	dataForEdit: any;
	policyFeature: any;
	id: any;
	options: any;
	planFeatureList = [{ name: 'Building', value: '39' }, { name: 'Content - Furniture/Fixture/Fittings', value: '40' }, { name: 'Content - Electrical installations', value: '41' }];
	showRecommendation: boolean;
	showInsurance: any;
	storeData: string;
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
	plannerNotes: any;
	ownerIds =[];
	insData: any;
	constructor(private planService :PlanService,private datePipe: DatePipe, private fb: FormBuilder, private subInjectService: SubscriptionInject, private customerService: CustomerService, private eventService: EventService) { }
	validatorType = ValidatorType
	@ViewChildren(MatInput) inputs: QueryList<MatInput>;
    @Output() sendOutput = new EventEmitter<any>();

	@Input() set data(data) {
		this.advisorId = AuthService.getAdvisorId();
		this.clientId = AuthService.getClientId();
		this.insData = data;
		this.inputData = data.inputData;
		this.policyList = data.displayList.policyTypes;
		this.policyFeature = data.displayList.policyFeature;
		this.addOns = data.displayList.addOns;
		this.getFamilyMemberList();
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

	lisNominee(value) {
		this.ownerData.Fmember = value;
		this.nomineesListFM = Object.assign([], value);
	}
	getFamilyMember(data, index) {
		this.familyMemberLifeData = data;
		console.log('family Member', this.FamilyMember);
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
			this.fireInsuranceForm.controls.getCoOwnerName = con.owner;
		}
		if (con.nominee != null && con.nominee) {
			this.fireInsuranceForm.controls.getNomineeName = con.nominee;
		}
	}

	onChangeJointOwnership(data) {
		this.callMethod = {
			methodName: "onChangeJointOwnership",
			ParamValue: data
		}
	}

	/***owner***/
	get planFeatureForm() {
		return this.fireInsuranceForm.get('planFeatureForm') as FormArray;
	}
	get addOnForm() {
		return this.fireInsuranceForm.get('addOnForm') as FormArray;
	}
	get getCoOwner() {
		return this.fireInsuranceForm.get('getCoOwnerName') as FormArray;
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

	removeCoOwner(item) {
		this.getCoOwner.removeAt(item);
		if (this.fireInsuranceForm.value.getCoOwnerName.length == 1) {
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
		return this.fireInsuranceForm.get('getNomineeName') as FormArray;
	}

	removeNewNominee(item) {
		this.disabledMember(null, null);
		this.getNominee.removeAt(item);
		if (this.fireInsuranceForm.value.getNomineeName.length == 1) {
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
		this.fireInsuranceForm = this.fb.group({
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
			policyNum: [(this.dataForEdit ? this.dataForEdit.policyNumber : null), [Validators.required]],
			premium: [(this.dataForEdit ? this.dataForEdit.premiumAmount : null), [Validators.required]],
			insurerName: [(this.dataForEdit ? this.dataForEdit.insurerName : null), [Validators.required]],
			financierName: [(this.dataForEdit ? this.dataForEdit.hypothetication : null)],
			planeName: [(this.dataForEdit ? this.dataForEdit.planName : null), [Validators.required]],
			policyStartDate: [this.dataForEdit ? new Date(this.dataForEdit.policyStartDate) : null, [Validators.required]],
			policyExpiryDate: [this.dataForEdit ? new Date(this.dataForEdit.policyExpiryDate) : null, [Validators.required]],
			copay: [(this.dataForEdit ? this.dataForEdit.copay : null)],
			copayType: [this.dataForEdit ? this.dataForEdit.copayRupeesOrPercent + '' : null],
			cumulativeBonus: [this.dataForEdit ? this.dataForEdit.cumulativeBonus : null],
			bonusType: [this.dataForEdit ? this.dataForEdit.cumulativeBonusRupeesOrPercent + '' : null],
			additionalCovers: [this.dataForEdit ? (this.dataForEdit.addOns > 0 ? this.dataForEdit.addOns[0].addOnId : null) : null],
			coversAmount: [this.dataForEdit ? (this.dataForEdit.addOns > 0 ? this.dataForEdit.addOns[0].addOnSumInsured : null) : null],
			exclusion: [this.dataForEdit ? this.dataForEdit.exclusion : null],
			inceptionDate: [this.dataForEdit ? new Date(this.dataForEdit.policyInceptionDate) : null],
			tpaName: [this.dataForEdit ? this.dataForEdit.tpaName : null],
			advisorName: [this.dataForEdit ? this.dataForEdit.advisorName : null],
			serviceBranch: [this.dataForEdit ? this.dataForEdit.serviceBranch : null],
			bankAccount: [this.dataForEdit ? this.dataForEdit.linkedBankAccount : null],
			nominees: this.nominees,
			getNomineeName: this.fb.array([this.fb.group({
				name: [''],
				sharePercentage: [0],
				familyMemberId: [0],
				id: [0],
				relationshipId: [0]
			})]),
			planFeatureForm: this.fb.array([this.fb.group({
				planfeatures: ['', [Validators.required]],
				sumInsured: ['', [Validators.required]]
			})]),
			addOnForm: this.fb.array([this.fb.group({
				additionalCovers: [''],
				sumAddOns: null
			})])

		})
		// ==============owner-nominee Data ========================\\
		/***owner***/
		if (this.fireInsuranceForm.value.getCoOwnerName.length == 1) {
			this.getCoOwner.controls['0'].get('share').setValue('100');
		}

		// if (this.dataForEdit && this.dataForEdit.ownerList) {
		//   this.getCoOwner.removeAt(0);
		//   this.dataForEdit.ownerList.forEach(element => {
		//     this.addNewCoOwner(element);
		//   });
		// }

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
			if (this.dataForEdit.addOns.length > 0) {
				this.addOnForm.removeAt(0);
				this.dataForEdit.addOns.forEach(element => {
					this.addNewAddOns(element);
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
		this.ownerData = { Fmember: this.nomineesListFM, controleData: this.fireInsuranceForm }

		// this.finalCashFlowData = [];
		// ==============owner-nominee Data ========================\\ 
		// this.DOB = data.dateOfBirth
		// this.ownerData = this.fireInsuranceForm.controls;
		// this.familyMemberId = data.familyMemberId;
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
        this.minDate.setFullYear(this.minDate.getFullYear() - 100);
	}
	selectPlanType(value) {
		if (value == '13') {
			this.planFeatureList = [{ name: 'Building', value: '39' }];
		} else if (value == '14') {
			this.planFeatureList = [{ name: 'Content - Furniture/Fixture/Fittings', value: '40' }, { name: 'Content - Electrical installations', value: '41' }];
		} else {
			this.planFeatureList = [{ name: 'Building', value: '39' }, { name: 'Content - Furniture/Fixture/Fittings', value: '40' }, { name: 'Content - Electrical installations', value: '41' }];

		}
	}
	dateChange(value, form, formValue) {
		if (form == 'policyExpiryDate' && formValue) {
			let startDate = new Date(this.fireInsuranceForm.controls.policyStartDate.value);
			let policyExpiryDate = this.datePipe.transform(this.fireInsuranceForm.controls.policyExpiryDate.value, 'yyyy/MM/dd')
			let comparedDate: any = startDate;
			comparedDate = comparedDate.setFullYear(startDate.getFullYear() + 1);
			comparedDate = new Date(comparedDate);
			comparedDate = comparedDate.setDate(comparedDate.getDate() - 1);
			comparedDate = this.datePipe.transform(comparedDate, 'yyyy/MM/dd')
			if (policyExpiryDate < comparedDate) {
				this.fireInsuranceForm.get('policyExpiryDate').setErrors({ max: 'Date of repayment' });
				this.fireInsuranceForm.get('policyExpiryDate').markAsTouched();
			} else {
				this.fireInsuranceForm.get('policyExpiryDate').setErrors();
			}
		} else {
			if (formValue) {
				let policyExpiryDate = this.datePipe.transform(this.fireInsuranceForm.controls.policyExpiryDate.value, 'yyyy/MM/dd')
				let policyStartDate = this.datePipe.transform(this.fireInsuranceForm.controls.policyStartDate.value, 'yyyy/MM/dd')

				if (policyStartDate >= policyExpiryDate) {
					this.fireInsuranceForm.get('policyExpiryDate').setErrors({ max: 'Date of repayment' });
					this.fireInsuranceForm.get('policyExpiryDate').markAsTouched();
				} else {
					this.fireInsuranceForm.get('policyExpiryDate').setErrors();

				}
			}
		}

	}
	addNewAddOns(data) {
		this.addOnForm.push(this.fb.group({
			additionalCovers: [data ? data.addOnId + '' : ''],
			sumAddOns: [data ? data.addOnSumInsured : '']
		}));
	}
	removeNewAddOns(item) {
		let finalFeatureList = this.fireInsuranceForm.get('addOnForm') as FormArray
		if (finalFeatureList.length > 1) {
			this.addOnForm.removeAt(item);

		}
	}

	/***owner***/
	addNewFeature(data) {
		this.planFeatureForm.push(this.fb.group({
			planfeatures: [data ? data.policyFeatureId + '' : '', [Validators.required]],
			sumInsured: [data ? data.featureSumInsured : '', [Validators.required]]
		}));
	}
	removeNewFeature(item) {
		let finalFeatureList = this.fireInsuranceForm.get('planFeatureForm') as FormArray
		if (finalFeatureList.length > 1) {
			this.planFeatureForm.removeAt(item);

		}
	}
	openOptionField() {
		(this.addMoreFlag) ? this.addMoreFlag = false : this.addMoreFlag = true;
	}
	getFamilyMemberList() {
		const obj = {
			advisorId: this.advisorId,
			clientId: this.clientId,
		};
		this.customerService.getListOfFamilyByClient(obj).subscribe(
			data => this.getFamilyMemberListRes(data)
		);
	}
	getFamilyMemberListRes(data) {
		console.log(data);
		this.FamilyMember = data.familyMembersList;
		this.ProposerData = Object.assign([], data.familyMembersList);
		console.log('Proposer data', this.ProposerData);
	}
	preventDefault(e) {
		e.preventDefault();
	}
	findCompanyName(data) {
		const inpValue = this.fireInsuranceForm.get('insurerName').value;
		this.customerService.getCompanyNames(inpValue).subscribe(
			data => {
				console.log(data);
				this.options = data;
				if(data.length>0){
					this.options = data;
				  }else{
					this.fireInsuranceForm.controls.insurerName.setErrors({ erroInPolicy: true });
					this.fireInsuranceForm.get('insurerName').markAsTouched();
				  }
			},
			err=>{
				this.fireInsuranceForm.controls.insurerName.setErrors({ erroInPolicy: true });
				this.fireInsuranceForm.get('insurerName').markAsTouched();
			}
		);
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
	saveFireInsurance() {
		this.getClientId();
		let featureList = [];
		let suggestNewData;
		let finalplanFeatureList = this.fireInsuranceForm.get('planFeatureForm') as FormArray
		finalplanFeatureList.controls.forEach(element => {
			if (element.get('planfeatures').value && element.get('sumInsured').value) {
				let obj =
				{
					policyFeatureId: element.get('planfeatures').value,
					featureSumInsured: element.get('sumInsured').value,
				}
				featureList.push(obj)
			}
		})
		let addOns = [];
		let addOnList = this.fireInsuranceForm.get('addOnForm') as FormArray
		addOnList.controls.forEach(element => {
			if (element.get('additionalCovers').value && element.get('sumAddOns').value) {
				let obj =
				{
					addOnId: element.get('additionalCovers').value,
					addOnSumInsured: element.get('sumAddOns').value,
				}
				addOns.push(obj)
			}
		})
		if (this.fireInsuranceForm.invalid) {
			this.fireInsuranceForm.markAllAsTouched();
		} else {
			this.barButtonOptions.active = true;
			const obj = {
				"clientId": this.clientId,
				"advisorId": this.advisorId,
				"policyHolderId": (this.fireInsuranceForm.value.getCoOwnerName[0].userType == 2) ? this.fireInsuranceForm.value.getCoOwnerName[0].clientId : this.fireInsuranceForm.value.getCoOwnerName[0].familyMemberId,
				"insurerName": this.fireInsuranceForm.get('insurerName').value,
				"policyNumber": this.fireInsuranceForm.get('policyNum').value,
				"policyTypeId": this.fireInsuranceForm.get('PlanType').value,
				"planName": this.fireInsuranceForm.get('planeName').value,
				"premiumAmount": this.fireInsuranceForm.get('premium').value,
				"policyStartDate": this.datePipe.transform(this.fireInsuranceForm.get('policyStartDate').value, 'yyyy-MM-dd'),
				"policyExpiryDate": this.datePipe.transform(this.fireInsuranceForm.get('policyExpiryDate').value, 'yyyy-MM-dd'),
				"exclusion": this.fireInsuranceForm.get('exclusion').value,
				"hypothetication": this.fireInsuranceForm.get('financierName').value,
				"advisorName": this.fireInsuranceForm.get('advisorName').value,
				"serviceBranch": this.fireInsuranceForm.get('serviceBranch').value,
				"insuranceSubTypeId": this.insuranceType,
				"policyFeatures": featureList,
				"id": (this.id) ? this.id : null,
				"addOns": addOns,
				'realOrFictitious':2,
				'suggestion':this.plannerNotes,
				'insuredMembers':[],
				nominees: this.fireInsuranceForm.value.getNomineeName,
			}

			if (obj.nominees.length > 0) {
				obj.nominees.forEach((element, index) => {
					if (element.name == '') {
						this.removeNewNominee(index);
					}
				});
				obj.nominees = this.fireInsuranceForm.value.getNomineeName;
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
							id:data ? data : null
						}
						this.close(insuranceData,true)
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
					},err=>{
						this.close('',true);
					}
				);
			}
		}
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
