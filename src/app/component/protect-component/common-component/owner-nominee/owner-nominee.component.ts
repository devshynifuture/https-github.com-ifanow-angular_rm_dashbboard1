import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customers/component/customer/customer.service';

@Component({
  selector: 'app-owner-nominee',
  templateUrl: './owner-nominee.component.html',
  styleUrls: ['./owner-nominee.component.scss']
})
export class OwnerNomineeComponent implements OnInit {
  coList:any;
  advisorId:any;
  clientId:any;
  sendData:any = [];
  @Input() coOwner;
  // @Input() formData;
  
  @Input() coNominee;
  @Output() coGroup = new EventEmitter();
  @Input()set formData(formData) {
    // this.ownerData = data.controleData;
    // console.log('1111121212121212121212 OwnerColumnComponent data : ', data);
    // if(data.Fmember.length <= 0){
    // this.getListFamilyMem();
    // }
    this.coList.controls.getCoOwnerName.setValue(formData.controls.getCoOwnerName)
    this.coList.controls.getNomineeName.setValue(formData.controls.getNomineeName)
  }
  constructor(private fb: FormBuilder,private custumService: CustomerService) { }

  ngOnInit() {
    this.coList = this.fb.group({
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['',[Validators.required]],
        share: ['',[Validators.required]],
        familyMemberId: [0],
        id:[0]
      })]),
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [''],
        familyMemberId: [0],
        id:[0]
      })]),
    })
    this.getListFamilyMem();
  }

  getListFamilyMem():any {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    if(this.sendData.length <= 0){
    this.custumService.getListOfFamilyByClient(obj).subscribe(
      data => this.getListOfFamilyByClientRes(data)
    );
    }
  }

  getListOfFamilyByClientRes(data) {
    console.log('family Memebers', data);
    if (data.familyMembersList && data.familyMembersList.length > 0) {
      data.familyMembersList.forEach((singleData) => {
        setTimeout(() => {
          singleData['disable'] = false;
        }, 100);
      });
    }
    this.sendData = data.familyMembersList;
    console.log(this.sendData,"sendData 123");
    this.disabledMember(null);
  }

  disabledMember(value){
    let controlsArr:any = [];
    if(this.getCoOwner){
      for(let e in this.getCoOwner.controls){
        controlsArr.push({type:'owner', index:e, data:this.getCoOwner.controls[e].value});
      }
    }

    if(this.getNominee){
      for(let e in this.getNominee.controls){
        controlsArr.push({type:'nominee', index:e, data:this.getNominee.controls[e].value});
      }
    }

    console.log(controlsArr, "controlsArr 123");
    
    this.sendData.forEach(element => {
      for(let e of controlsArr){
        if(e.data.name != ''){
          if(element.userName == e.data.name){
              if(e.type == 'owner'){
                  this.getCoOwner.controls[e.index].get('familyMemberId').setValue(element.id)
              }
              else{
                this.getNominee.controls[e.index].get('familyMemberId').setValue(element.id)
              }
              element.disable = true;
              return;
            }
            else{
              element.disable = false;
            }
          }
        }
      });
      if(this.getNominee != null){
        if(this.getNominee.value.length == 1 && this.getNominee.value[0].name != ''){
            this.getNominee.controls['0'].get('sharePercentage').setValue('100');
            // this.setOwnerNominee();
            // this.valueChange3.emit(this.ownerNomineeJson);
          }
      }

      let coListForm={
        owner : this.getCoOwner,
        nominee : this.getNominee
      }
      this.coGroup.emit(coListForm);

  }

  showError:boolean = false;
  ownerPer:any;
  NomineePer:any;
  showErrorOwner:boolean =false;
  onChangeJointOwnership(data) {
    if (data == 'owner') {
      this.ownerPer = 0;
      
      for(let e in this.getCoOwner.controls){
        const arrayCon:any = this.getCoOwner.controls[e];
        
            this.ownerPer += arrayCon.value.share;
            
            if(e == "1"){
              if (this.ownerPer > 100 || this.ownerPer < 100) {
                this.showErrorOwner = true;
                  arrayCon.get('share').setErrors({'incorrect': true});
                  // arrayCon.get('share').updateValueAndValidity();
                  console.log('show error Percent cannot be more than 100%', arrayCon)
                }
                else {
                  this.showErrorOwner = false
                  // this.showErrorCoOwner = false;
                  arrayCon.controls['share'].setErrors({'incorrect': false});
                  arrayCon.get('share').updateValueAndValidity();
                }
              } 
              this.getCoOwner.controls[e] = arrayCon;
      }
     
     
    } else {
      this.NomineePer = 0;

      for(let e in this.getNominee.controls){
        const arrayCon:any = this.getNominee.controls[e];
        
            this.NomineePer += arrayCon.value.sharePercentage;
          
              if (this.NomineePer > 100 || this.NomineePer < 100) {
                this.showErrorOwner = true;
                if(e == "1"){
                  arrayCon.controls['sharePercentage'].setErrors({'incorrect': true});
                  // arrayCon.get('sharePercentage').updateValueAndValidity();
                }
                console.log('show error Percent cannot be more than 100%')
              } else {
                this.showErrorOwner = false
                // this.showErrorCoOwner = false;
                arrayCon.controls['sharePercentage'].setErrors({'incorrect': false});
                arrayCon.get('sharePercentage').updateValueAndValidity();
              }
            
      }
    }
    
  }

  /***owner***/ 

  get getCoOwner() {
    return this.coList.get('getCoOwnerName') as FormArray;
  }

  addNewCoOwner(data) {
    this.getCoOwner.push(this.fb.group({
      name: [data ? data.name : '', [Validators.required]], share: [data ? String(data.share) : '', [Validators.required]], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0]
    }));
    if (!data || this.getCoOwner.value.length < 1) {
      for (let e in this.getCoOwner.controls) {
        this.getCoOwner.controls[e].get('share').setValue('');
      }
    }

    let coListForm={
      owner : this.getCoOwner,
      nominee : this.getNominee
    }
    this.coGroup.emit(coListForm);
  }

  removeCoOwner(item) {
    this.getCoOwner.removeAt(item);
    if (this.coList.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    } else {
      for (let e in this.getCoOwner.controls) {
        this.getCoOwner.controls[e].get('share').setValue('');
      }
    }
  }
  /***owner***/ 

  /***nominee***/ 

  get getNominee() {
    return this.coList.get('getNomineeName') as FormArray;
  }

  removeNewNominee(item) {
    this.getNominee.removeAt(item);
    
  }


  
  addNewNominee(data) {
    this.getNominee.push(this.fb.group({
      name: [data ? data.name : ''], sharePercentage: [data ? String(data.sharePercentage) : ''], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0]
    }));
    if (!data || this.getNominee.value.length < 1) {
      for (let e in this.getNominee.controls) {
        this.getNominee.controls[e].get('sharePercentage').setValue('');
      }
    }
    let coListForm={
      owner : this.getCoOwner,
      nominee : this.getNominee
    }
    this.coGroup.emit(coListForm);
  }
  /***nominee***/ 
}
