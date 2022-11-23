
import { Component, } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeStamp } from 'console';

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
  answerValue: any;
  answersNeeded: any;
  selected: any;
  correctAnswerID: any;
  isAnswerCorrect: any;
  answeredBefore: any;
  constructor(
    public fb: FormBuilder,
    private location: Location,
    private http: HttpClient
  ) {
    this.id = window.location.pathname.replace('/', '');
    if (!this.id) {
      this.getQuestion(this.id, true).subscribe(data => {
        this.id = data[0]._id.toString();
        this.questionDescription = data[0].question;
        this.location.replaceState(`/${this.id}`);
      });
    }
    this.location.replaceState(`/${this.id}`);

    this.getQuestion(this.id).subscribe(data => {
      this.questionDescription = data.question;
    });
    if (this.questionDescription === undefined) {
      this.getQuestion(this.id, true).subscribe(data => {
        this.questionDescription = data[0].question;
      });
    };

    this.getAnswers().subscribe((answers) => {
      this.answersNeeded = answers.filter((answer: any) => answer.questionID === this.id);
      let correctAnswer = this.answersNeeded.filter((answer: any) => answer.correctFlag === 0);
      this.correctAnswerID = correctAnswer[0]._id;

    });

  }
  /*##################### Registration Form #####################*/
  registrationForm = this.fb.group({
    file: [null],
    fullName: this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[_A-z0-9]*((-|\s)*[_A-z0-9])*$')]],
    }),
    mobileNumber: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]+$')]],
  }) as any;
  setValue(index: any, answerId: any) {
    // @ts-ignore
    this.answerValue = answerId;
    this.selected = true;
    let elem1 = document.querySelectorAll("[custom-control-label-active]");
    elem1.forEach((data) => {
      data.classList.remove("custom-control-label-active");
    });
    elem1[index].classList.add('custom-control-label-active');
  }

  // Getter method to access formcontrols
  get myForm() {
    return this.registrationForm.controls;
  }
  // Submit Registration Form
  // @ts-ignore
  onSubmit() {
    this.submitted = true;

    this.getUserAnswers().subscribe((answers) => {

      let value = answers.filter((answer: any) => answer.phone.toString() === this.registrationForm.value.mobileNumber && answer.questionID === this.id);

      if (value.length > 0) {
        alert("The user have already answered before");
      } else {
        if (this.registrationForm.valid) {
          if (this.answerValue !== undefined) {
            // this.postQuestion(this.id, this.answerValue, this.registrationForm.value.mobileNumber);
            this.postQuestion();
          } else {
            alert("Please fill all the required fields to submit your value  ");
          }
        } else {
          alert("Please fill all the required fields to submit your value ");
        }

      }
    });


  }
  public getQuestion(id: any, error: boolean = false): Observable<any> {
    if (error) {
      const url = `http://localhost:8080/questions`;
      return this.http.get<any>(url);
    }
    else {
      const url = `http://localhost:8080/questions/${id}`;
      return this.http.get<any>(url);
    }
  }

  public getAnswers() {
    const url = `http://localhost:8080/answers`;
    return this.http.get<any>(url);
  }


  checkIfAnswerCorrect() {
    if (this.answerValue === this.correctAnswerID) {
      this.isAnswerCorrect = true;
    } else {
      this.isAnswerCorrect = false;
    }

  }

  getUserAnswers() {
    const url = `http://localhost:8080/user-answers/`;
    return this.http.get<any>(url);
  }


  public postQuestion() {
    this.checkIfAnswerCorrect();
    let answer;
    if (this.isAnswerCorrect) answer = 1; else answer = 0;


    this.http.post<any>(`http://localhost:8080/user-answers/`, {
      "Name": this.registrationForm.value.fullName.fullName,
      "phone": this.registrationForm.value.mobileNumber,
      "questionID": this.id,
      "question": this.questionDescription,
      "answerId": this.answerValue,
      "answer": answer
    }).subscribe();


  }









}