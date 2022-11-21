
import { Component, } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  questionDescription: any;
  reviewCount: any;
  yesValue: any;
  noValue: any;
  constructor(
    public fb: FormBuilder,
    private location: Location,
    private http: HttpClient
  ) {
    // this.location.replaceState("/BackendIdIncrementOnEachPostSubmitted");
    this.id = window.location.pathname.replace('/', '');


    console.log(this.getQuestion(this.id).subscribe(data => {
      this.questionDescription = data.description;
    }), "test");
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
    // this.submitted = true;
    // if (!this.registrationForm.valid) {
    //   alert('Please fill all the required fields to submit your value!');
    //   return false;
    // } else {
    //   console.log(this.registrationForm.value, this.id);

    console.log(this.registrationForm.value, this.id);
    this.postQuestion();
  }


  public getQuestion(id: any = "637758d6bb8b1441f47c9eb0"): Observable<any> {
    const url = `http://localhost:8080/questions/${id}`;

    return this.http.get<any>(url);
  }



  public postQuestion(question: any = "637b52224499a81cfc580112", answer: boolean = false, phoneNumber = "769632385") {


    const PhoneNumberList = `http://localhost:8080/statistics`;

    const QuestionDetails = `http://localhost:8080/questions/${question}`;


    this.http.get<any>(PhoneNumberList).subscribe((data) => {
      let numbers: any = [];
      data.map((data: any) => numbers.push(data.QuestionID));
      let MobileNumberFound = numbers[0].users.filter((data: any) => { return data.Number === phoneNumber; });
      let checkIfAnsweredBefore = MobileNumberFound[0].questionIDAnswered.filter((data: any) => { return data.toString() === question; });
      if (MobileNumberFound.length === 0 && checkIfAnsweredBefore.length === 0) {
        // check this number if it answered this type of id 

        this.http.get<any>(QuestionDetails).subscribe((data) => {
          this.reviewCount = data.reviewCount;
          this.yesValue = data.Yes;
          this.noValue = data.No;
          if (answer) this.yesValue++; else this.noValue++;
          this.http.put<any>(`http://localhost:8080/questions/${question}`, {
            "reviewCount": this.reviewCount + 1,
            "Yes": this.yesValue,
            "No": this.noValue,
          }).subscribe();
        });

      }
      else[
        alert("number is already founded here")
      ];



    });









  }









}