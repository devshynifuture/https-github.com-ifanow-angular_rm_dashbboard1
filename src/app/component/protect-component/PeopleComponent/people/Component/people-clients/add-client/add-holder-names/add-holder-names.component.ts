import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-holder-names',
  templateUrl: './add-holder-names.component.html',
  styleUrls: ['./add-holder-names.component.scss']
})
export class AddHolderNamesComponent implements OnInit {

  constructor(private fb: FormBuilder) { }
  holderNamesForm;
  validatorType = ValidatorType;
  @Output() holderList = new EventEmitter;
  ngOnInit() {
    this.holderNamesForm = this.fb.group({
      holderNameList: new FormArray([])
    })
    this.addHolders();
  }
  get getHolderForm() { return this.holderNamesForm.controls };
  get holderNameList() { return this.getHolderForm.holderNameList as FormArray };
  addHolders() {
    if (this.holderNameList.length == 3) {
      return;
    }
    this.holderNameList.push(this.fb.group({
      name: ['']
    }));
    this.holderList.emit(this.holderNameList);
  }
  removeHolders(index) {
    this.holderNamesForm.controls.holderNameList.removeAt(index)
  }
}
