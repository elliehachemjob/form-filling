
import { Component, } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent {
  submitted = false;
  id: any;
  imageUrl: any = '../assets/rak-logo.png';
  firstValueSelected: any;
  secondValueSelected: any;
  constructor(
    public fb: FormBuilder,
    private location: Location
  ) {
    this.location.replaceState("/BackendIdIncrementOnEachPostSubmitted");
    this.id = window.location.pathname.replace('/', '');
  }

  /*##################### Registration Form #####################*/
  registrationForm = this.fb.group({
    file: [null],
    fullName: this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[_A-z0-9]*((-|\s)*[_A-z0-9])*$')]],
    }),
    mobileNumber: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]+$')]],
    question: null,
  });


  setValueFalse() {
    // @ts-ignore
    this.registrationForm.value.question = false;
    this.firstValueSelected = true;
    if (this.secondValueSelected) {
      this.secondValueSelected = false;
    }
  }

  setValueTrue() {
    // @ts-ignore
    this.registrationForm.value.question = true;
    this.secondValueSelected = true;
    if (this.firstValueSelected) {
      this.firstValueSelected = false;
    }
  }

  // Getter method to access formcontrols
  get myForm() {
    return this.registrationForm.controls;
  }

  // Submit Registration Form
  // @ts-ignore
  onSubmit() {
    this.submitted = true;
    if (!this.registrationForm.valid) {
      alert('Please fill all the required fields to submit your value!');
      return false;
    } else {
      console.log(this.registrationForm.value, this.id);
    }
  }




}