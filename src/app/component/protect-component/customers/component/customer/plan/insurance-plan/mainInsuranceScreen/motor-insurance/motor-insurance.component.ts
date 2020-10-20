import { Component, OnInit, ViewChildren, QueryList, Input, Output, EventEmitter } from '@angular/core';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { ValidatorType } from 'src/app/services/util.service';
import { MatDialog, MatInput } from '@angular/material';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { LinkBankComponent } from 'src/app/common/link-bank/link-bank.component';
import { PlanService } from '../../../plan.service';

@Component({
	selector: 'app-motor-insurance',
	templateUrl: './motor-insurance.component.html',
	styleUrls: ['./motor-insurance.component.scss']
})
export class MotorInsuranceComponent implements OnInit {
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
	motorInsuranceForm: any;
	displayList: any;
	nomineesList: any[] = [];
	policyList: any;
	addOns: any;
	dataForEdit: any;
	options: void;
	policyData: any;
	insuranceSubTypeId: any;
	insuranceTypeId: any;
	id: any;
	bankList: any;
	bankAccountDetails: { accountList: any; controleData: any; };
	accountList: any;
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

	validatorType = ValidatorType;
	showRecommendation: boolean;
	insuranceType: number;
	storeData: string;
	showInsurance: { value: string; header: string; smallHeading: string; insuranceType: number; logo: string; heading: string; subHeading: string; };
	plannerNotes: any;

	constructor(private planService :PlanService,private dialog: MatDialog, private enumService: EnumServiceService, private datePipe: DatePipe, private fb: FormBuilder, private subInjectService: SubscriptionInject, private customerService: CustomerService, private eventService: EventService) {
	}

	@ViewChildren(MatInput) inputs: QueryList<MatInput>;
    @Output() sendOutput = new EventEmitter<any>();

	@Input() set data(data) {
		this.advisorId = AuthService.getAdvisorId();
		this.clientId = AuthService.getClientId();
		this.inputData = data.inputData;
		this.policyList = data.displayList.policyTypes;
		this.addOns = data.displayList.addOns;
		this.getFamilyMemberList();
		this.getdataForm(data);
		// this.setInsuranceDataFormField(data);
		console.log(data);
	}

	get data() {
		return this.inputData;
	}

	getFormDataNominee(data) {
		console.log(data);
		this.nomineesList = data.controls;
	}

	display(value) {
		console.log('value selected', value);
		this.ownerName = value.userName;
		this.familyMemberId = value.familyMemberId;
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
			methodName: 'disabledMember',
			ParamValue: value,
			disControl: type
		};
	}

	displayControler(con) {
		console.log('value selected', con);
		if (con.owner != null && con.owner) {
			this.motorInsuranceForm.controls.getCoOwnerName = con.owner;
		}
		if (con.nominee != null && con.nominee) {
			this.motorInsuranceForm.controls.getNomineeName = con.nominee;
		}
	}

	onChangeJointOwnership(data) {
		this.callMethod = {
			methodName: 'onChangeJointOwnership',
			ParamValue: data
		};
	}

	/***owner***/

	get addOnForm() {
		return this.motorInsuranceForm.get('addOnForm') as FormArray;
	}

	get getCoOwner() {
		return this.motorInsuranceForm.get('getCoOwnerName') as FormArray;
	}

	addNewCoOwner(data) {
		this.getCoOwner.push(this.fb.group({
			name: [data ? data.name : '', [Validators.required]],
			share: [data ? data.share : ''],
			familyMemberId: [data ? data.familyMemberId : 0],
			id: [data ? data.id : 0],
			isClient: [data ? data.isClient : 0],
			clientId: [data ? data.clientId : 0],
			userType: [data ? data.userType : 0]
		}));
		if (data) {
			setTimeout(() => {
				this.disabledMember(null, null);
			}, 1300);
		}

		if (this.getCoOwner.value.length > 1 && !data) {
			const share = 100 / this.getCoOwner.value.length;
			for (const e in this.getCoOwner.controls) {
				if (!Number.isInteger(share) && e == '0') {
					this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
				} else {
					this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
				}
			}
		}

	}

	removeCoOwner(item) {
		this.getCoOwner.removeAt(item);
		if (this.motorInsuranceForm.value.getCoOwnerName.length == 1) {
			this.getCoOwner.controls['0'].get('share').setValue('100');
		} else {
			const share = 100 / this.getCoOwner.value.length;
			for (const e in this.getCoOwner.controls) {
				if (!Number.isInteger(share) && e == '0') {
					this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
				} else {
					this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
				}
			}
		}
		this.disabledMember(null, null);
	}

	/***owner***/

	/***nominee***/

	get getNominee() {
		return this.motorInsuranceForm.get('getNomineeName') as FormArray;
	}

	removeNewNominee(item) {
		this.disabledMember(null, null);
		this.getNominee.removeAt(item);
		if (this.motorInsuranceForm.value.getNomineeName.length == 1) {
			this.getNominee.controls['0'].get('sharePercentage').setValue('100');
		} else {
			const share = 100 / this.getNominee.value.length;
			for (const e in this.getNominee.controls) {
				if (!Number.isInteger(share) && e == '0') {
					this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
				} else {
					this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
				}
			}
		}
	}


	addNewNominee(data) {
		this.getNominee.push(this.fb.group({
			name: [data ? data.name : ''],
			sharePercentage: [data ? data.sumInsured : 0],
			familyMemberId: [data ? data.familyMemberId : 0],
			id: [data ? data.id : 0],
			isClient: [data ? data.isClient : 0],
			relationshipId: [data ? data.relationshipId : 0]
		}));
		if (!data || this.getNominee.value.length < 1) {
			for (const e in this.getNominee.controls) {
				this.getNominee.controls[e].get('sharePercentage').setValue(0);
			}
		}

		if (this.getNominee.value.length > 1 && !data) {
			const share = 100 / this.getNominee.value.length;
			for (const e in this.getNominee.controls) {
				if (!Number.isInteger(share) && e == '0') {
					this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
				} else {
					this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
				}
			}
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
	getdataForm(data) {
		this.dataForEdit = data.data;
		if (data.data == null) {
			data = {};
			this.dataForEdit = data.data;
			this.flag = 'Add';
		} else {
			this.dataForEdit = data.data;
			this.id = this.dataForEdit.id;
			this.flag = 'Edit';
		}
		this.motorInsuranceForm = this.fb.group({
			// ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required]],
			getCoOwnerName: this.fb.array([this.fb.group({
				name: ['', [Validators.required]],
				share: [0,],
				familyMemberId: null,
				id: 0,
				isClient: 0,
				userType: 0,
				clientId: 0
			})]),
			name: [(this.dataForEdit ? this.dataForEdit.name : null)],
			// additionalCovers: [this.dataForEdit ? this.dataForEdit.addOns[0].addOnId : null],
			policyNum: [(this.dataForEdit ? this.dataForEdit.policyNumber : null), [Validators.required]],
			PlanType: [(this.dataForEdit ? this.dataForEdit.policyTypeId + '' : null), [Validators.required]],
			insurerName: [(this.dataForEdit ? this.dataForEdit.insurerName : null), [Validators.required]],
			policyName: [(this.dataForEdit ? this.dataForEdit.policyName : null), [Validators.required]],
			policyStartDate: [this.dataForEdit ? new Date(this.dataForEdit.policyStartDate) : null, [Validators.required]],
			policyExpiryDate: [this.dataForEdit ? new Date(this.dataForEdit.policyExpiryDate) : null, [Validators.required]],
			declaredValue: [(this.dataForEdit ? this.dataForEdit.sumInsuredIdv : null), [Validators.required]],
			premium: [(this.dataForEdit ? this.dataForEdit.premiumAmount : null), [Validators.required]],
			vehicleType: [(this.dataForEdit ? this.dataForEdit.vehicleTypeId + '' : null), [Validators.required]],
			registrationNumber: [(this.dataForEdit ? this.dataForEdit.vehicleRegNo : null)],
			registrationDate: [(this.dataForEdit) ? ((this.dataForEdit.vehicleRegistrationDate) ? new Date(this.dataForEdit.vehicleRegistrationDate) : null) : null],
			modelName: [(this.dataForEdit ? this.dataForEdit.vehicleModel : null)],
			engineNumber: [(this.dataForEdit ? this.dataForEdit.engineNo : null)],
			chassisNumber: [(this.dataForEdit ? this.dataForEdit.chasisNo : null)],
			fuelType: [this.dataForEdit ? this.dataForEdit.fuelTypeId + '' : null],
			cgGvw: [(this.dataForEdit ? this.dataForEdit.ccGvw : null)],
			claimBonus: [(this.dataForEdit ? this.dataForEdit.noClaimBonus : null)],
			discount: [(this.dataForEdit ? this.dataForEdit.specialDiscount : null)],
			exclusion: [this.dataForEdit ? this.dataForEdit.exclusion : null],
			financierName: [this.dataForEdit ? this.dataForEdit.hypothetication : null],
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

			addOnForm: this.fb.array([this.fb.group({
				additionalCovers: [''],
				addOnSumInsured: null
			})])
		});
		// ==============owner-nominee Data ========================\\
		/***owner***/
		if (this.motorInsuranceForm.value.getCoOwnerName.length == 1) {
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
			};
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

		this.ownerData = { Fmember: this.nomineesListFM, controleData: this.motorInsuranceForm };
		this.bankAccountDetails = { accountList: this.accountList, controleData: this.motorInsuranceForm };

		// this.finalCashFlowData = [];
		// ==============owner-nominee Data ========================\\
		// this.DOB = data.dateOfBirth
		// this.ownerData = this.motorInsuranceForm.controls;
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
        this.bankList = this.enumService.getBank();
        this.minDate.setFullYear(this.minDate.getFullYear() - 100);
	}

	dateChange(value, form, formValue) {
		if (form == 'policyExpiryDate' && formValue) {
			const startDate = new Date(this.motorInsuranceForm.controls.policyStartDate.value);
			const policyExpiryDate = this.datePipe.transform(this.motorInsuranceForm.controls.policyExpiryDate.value, 'yyyy/MM/dd');
			let comparedDate: any = startDate;
			comparedDate = comparedDate.setFullYear(startDate.getFullYear() + 1);
			comparedDate = new Date(comparedDate);
			comparedDate = comparedDate.setDate(comparedDate.getDate() - 1);
			comparedDate = this.datePipe.transform(comparedDate, 'yyyy/MM/dd');
			if (policyExpiryDate < comparedDate) {
				this.motorInsuranceForm.get('policyExpiryDate').setErrors({ max: 'Date of repayment' });
				this.motorInsuranceForm.get('policyExpiryDate').markAsTouched();
			} else {
				this.motorInsuranceForm.get('policyExpiryDate').setErrors();
			}
		} else {
			if (formValue) {
				const policyExpiryDate = this.datePipe.transform(this.motorInsuranceForm.controls.policyExpiryDate.value, 'yyyy/MM/dd');
				const policyStartDate = this.datePipe.transform(this.motorInsuranceForm.controls.policyStartDate.value, 'yyyy/MM/dd');

				if (policyStartDate >= policyExpiryDate) {
					this.motorInsuranceForm.get('policyExpiryDate').setErrors({ max: 'Date of repayment' });
					this.motorInsuranceForm.get('policyExpiryDate').markAsTouched();
				} else {
					this.motorInsuranceForm.get('policyExpiryDate').setErrors();

				}
			}
		}

	}

	onChange(value, event) {
		if (parseInt(event.target.value) > 100) {
			event.target.value = '100';
			this.motorInsuranceForm.get(value).setValue(event.target.value);

		}
	}

	// bankAccountList(value) {
	//   this.bankList = value;
	// }

	selectPolicy(policy) {
		this.policyData = policy;
		this.insuranceTypeId = policy.insuranceTypeId;
		this.insuranceSubTypeId = policy.insuranceSubTypeId;
	}

	addNewAddOns(data) {
		this.addOnForm.push(this.fb.group({
			additionalCovers: [data ? data.addOnId + '' : ''],
			addOnSumInsured: null
		}));
	}

	removeNewAddOns(item) {
		const finalFeatureList = this.motorInsuranceForm.get('addOnForm') as FormArray;
		if (finalFeatureList.length > 1) {
			this.addOnForm.removeAt(item);

		}
	}

	/***owner***/

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
		const inpValue = this.motorInsuranceForm.get('insurerName').value;
		this.customerService.getCompanyNames(inpValue).subscribe(
			data => {
				console.log(data);
				this.options = data;
				if(data.length>0){
					this.options = data;
				  }else{
					this.motorInsuranceForm.controls.insurerName.setErrors({ erroInPolicy: true });
					this.motorInsuranceForm.get('insurerName').markAsTouched();
				  }
			},
			err=>{
				this.motorInsuranceForm.controls.insurerName.setErrors({ erroInPolicy: true });
				this.motorInsuranceForm.get('insurerName').markAsTouched();
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
	saveMotorInsurance() {
		this.getClientId();
		let addOns = [];
		const addOnList = this.motorInsuranceForm.get('addOnForm') as FormArray;
		addOnList.controls.forEach(element => {
			if (element.get('additionalCovers').value) {
				const obj = {
					addOnId: element.get('additionalCovers').value,
					addOnSumInsured: null
				};
				addOns.push(obj);
			} else {
				addOns = [];
			}

		});
		this.motorInsuranceForm.get('registrationDate').setErrors(null);
		if (this.motorInsuranceForm.invalid) {
			this.motorInsuranceForm.markAllAsTouched();
		} else {
			this.barButtonOptions.active = true;
			const obj = {
				clientId: this.clientId,
				advisorId: this.advisorId,
				policyHolderId: (this.motorInsuranceForm.value.getCoOwnerName[0].userType == 2) ? this.motorInsuranceForm.value.getCoOwnerName[0].clientId : this.motorInsuranceForm.value.getCoOwnerName[0].familyMemberId,
				policyTypeId: this.motorInsuranceForm.get('PlanType').value,
				policyNumber: this.motorInsuranceForm.get('policyNum').value,
				insurerName: this.motorInsuranceForm.get('insurerName').value,
				policyName: this.motorInsuranceForm.get('policyName').value,
				policyStartDate: this.datePipe.transform(this.motorInsuranceForm.get('policyStartDate').value, 'yyyy-MM-dd'),
				policyExpiryDate: this.datePipe.transform(this.motorInsuranceForm.get('policyExpiryDate').value, 'yyyy-MM-dd'),
				ccGvw: this.motorInsuranceForm.get('cgGvw').value,
				sumInsuredIdv: this.motorInsuranceForm.get('declaredValue').value,
				premiumAmount: this.motorInsuranceForm.get('premium').value,
				vehicleTypeId: this.motorInsuranceForm.get('vehicleType').value,
				vehicleRegNo: this.motorInsuranceForm.get('registrationNumber').value,
				vehicleRegistrationDate: this.motorInsuranceForm.get('registrationDate').value ? this.datePipe.transform(this.motorInsuranceForm.get('registrationDate').value, 'yyyy-MM-dd') : undefined,
				vehicleModel: this.motorInsuranceForm.get('modelName').value,
				engineNo: this.motorInsuranceForm.get('engineNumber').value,
				chasisNo: this.motorInsuranceForm.get('chassisNumber').value,
				fuelTypeId: this.motorInsuranceForm.get('fuelType').value,
				noClaimBonus: this.motorInsuranceForm.get('claimBonus').value,
				specialDiscount: this.motorInsuranceForm.get('discount').value,
				exclusion: this.motorInsuranceForm.get('exclusion').value,
				hypothetication: this.motorInsuranceForm.get('financierName').value,
				advisorName: this.motorInsuranceForm.get('advisorName').value,
				serviceBranch: this.motorInsuranceForm.get('serviceBranch').value,
				linkedBankAccount: this.motorInsuranceForm.get('bankAccount').value,
				insuranceSubTypeId: this.inputData.insuranceSubTypeId,
				id: (this.id) ? this.id : null,
				realOrFictitious:2,
            	suggestion:this.plannerNotes,
				addOns: addOns,
				nominees: this.motorInsuranceForm.value.getNomineeName,
			};

			if (obj.nominees.length > 0) {
				obj.nominees.forEach((element, index) => {
					if (element.name == '') {
						this.removeNewNominee(index);
					}
				});
				obj.nominees = this.motorInsuranceForm.value.getNomineeName;
				obj.nominees.forEach(element => {
					if (element.sharePercentage) {
						element.sumInsured = element.sharePercentage;
					}
					element.insuredOrNominee = 2;
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
						this.eventService.openSnackBar('Updated successfully!', 'Dismiss');
						const insuranceData = {
							insuranceTypeId: this.inputData.insuranceTypeId,
							insuranceSubTypeId: this.inputData.insuranceSubTypeId,
							id:data ? data : null
						};
						this.close(insuranceData,true);
					}
				);
			} else {
				this.planService.addGenralInsurancePlan(obj).subscribe(
					data => {
						this.barButtonOptions.active = false;
						console.log(data);
						this.eventService.openSnackBar('Added successfully!', 'Dismiss');
						const insuranceData = {
							insuranceTypeId: this.inputData.insuranceTypeId,
							insuranceSubTypeId: this.inputData.insuranceSubTypeId,
							id:data ? data : null
						};
						this.close(insuranceData,true);
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
	close(data,flag) {
		if(data){
		  this.subInjectService.changeNewRightSliderState({ state: 'close', data,refreshRequired:flag });
		  this.sendOutput.emit(true);
		}else{
		  this.subInjectService.changeNewRightSliderState({ state: 'close', data,refreshRequired:flag });
		  this.sendOutput.emit(false);
		}
	  }


}
