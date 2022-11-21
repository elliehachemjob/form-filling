
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
  answerBooleanValue: any;
  constructor(
    public fb: FormBuilder,
    private location: Location,
    private http: HttpClient
  ) {
    this.id = window.location.pathname.replace('/', '');
    if (!this.id) {
      this.id = '637756e518873f5590f68434';
    }
    this.location.replaceState(`/${this.id}`);

    this.getQuestion(this.id).subscribe(data => {
      this.questionDescription = data.description;
    });
  }

  /*##################### Registration Form #####################*/
  registrationForm = this.fb.group({
    file: [null],
    fullName: this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[_A-z0-9]*((-|\s)*[_A-z0-9])*$')]],
    }),
    mobileNumber: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]+$')]],
  });


  setValueFalse() {
    // @ts-ignore
    this.registrationForm.value.question = false;
    this.answerBooleanValue = false;
    this.firstValueSelected = true;
    if (this.secondValueSelected) {
      this.secondValueSelected = false;
    }
  }

  setValueTrue() {
    // @ts-ignore
    this.registrationForm.value.question = true;
    this.answerBooleanValue = true;

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
    if (this.registrationForm.valid) {
      if (this.answerBooleanValue !== undefined) {
        this.postQuestion(this.id, this.answerBooleanValue, this.registrationForm.value.mobileNumber);
      } else {
        alert("Please fill all the required fields to submit your value");
      }
    } else {
      alert("Please fill all the required fields to submit your value");
    }
  }


  public getQuestion(id: any): Observable<any> {
    const url = `http://localhost:8080/questions/${id}`;
    return this.http.get<any>(url);
  }



  public postQuestion(questionID: any, answer: boolean = false, phoneNumber: any) {


    const PhoneNumberList = `http://localhost:8080/statistics`;

    const QuestionDetails = `http://localhost:8080/questions/${questionID}`;



    this.http.get<any>(PhoneNumberList).subscribe((data) => {

      const result = data.filter((data: any) => data.numbers.toString() === phoneNumber && data.IdNumber === questionID);

      if (result.length === 0) {
        alert("subbmited first time");
        console.log(result, "yo");
        this.http.get<any>(QuestionDetails).subscribe((data) => {
          this.reviewCount = data.reviewCount;
          this.yesValue = data.Yes;
          this.noValue = data.No;
          if (answer) this.yesValue++; else this.noValue++;
          this.http.put<any>(`http://localhost:8080/questions/${questionID}`, {
            "reviewCount": this.reviewCount + 1,
            "Yes": this.yesValue,
            "No": this.noValue,
          }).subscribe();
        });
        this.http.post<any>(`http://localhost:8080/statistics/`, {
          "numbers": phoneNumber,
          "IdNumber": questionID
        }).subscribe();

      }
      else {
        alert("number is already submitted to this question");
      }
    });








  }









}