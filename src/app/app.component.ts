import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  submitted = false;
  id: any;
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
  isUserSubmittedBefore: any;
  isUserRequiredFields: any;
  isUserSuccessSubmitForm: any;
  languageRequested: any = 'en';
  userSelected: any = false;
  lang = ['en', 'ar'];
  answersUrl = `http://localhost:1337/answers/`;
  userAnswersUrl = `http://localhost:1337/user-answers/`;
  questionsUrl = 'http://localhost:1337/questions';
  submittedSuccessfully: boolean = false;

  constructor(
    public fb: FormBuilder,
    private location: Location,
    private http: HttpClient,
    private meta: Meta
  ) {
    this.meta.addTag({ name: 'description', content: 'Ras Al Khaimah' });
    this.languageRequested = window.location.pathname.substring(
      window.location.pathname.lastIndexOf('/') + 1
    );
    if (
      this.languageRequested === this.lang[0] ||
      this.languageRequested === this.lang[1] ||
      this.languageRequested === this.lang[0].toLowerCase() ||
      this.languageRequested === this.lang[1].toLowerCase()
    )
      this.userSelected = true;
    else this.languageRequested = 'en';
    if (this.userSelected)
      this.id = window.location.pathname
        .substring(0, window.location.pathname.lastIndexOf('/'))
        .replace('/', '');
    else this.id = window.location.pathname.replace('/', '');

    if (!this.id) {
      this.getQuestion(this.id, true).subscribe((data) => {
        this.id = data[0]._id.toString();
        if (
          this.languageRequested === this.lang[1] ||
          this.languageRequested === this.lang[1].toLowerCase()
        )
          this.questionDescription = data[0].QuestionAR;
        else this.questionDescription = data[0].QuestionEN;
        this.location.replaceState(`/${this.id}/${this.languageRequested}`);
      });
    } else {
      this.location.replaceState(`/${this.id}/${this.languageRequested}`);
      this.getQuestion(this.id).subscribe(
        (data) => {
          if (
            this.languageRequested === this.lang[1] ||
            this.languageRequested === this.lang[1].toLowerCase()
          )
            this.questionDescription = data.QuestionAR;
          else this.questionDescription = data.QuestionEN;
        },
        (err) => {
          this.getQuestion(this.id, true).subscribe((data) => {
            if (
              this.languageRequested === this.lang[1] ||
              this.languageRequested === this.lang[1].toLowerCase()
            )
              this.questionDescription = data[0].QuestionAR;
            else this.questionDescription = data[0].QuestionEN;
            this.location.replaceState(
              `/${data[0].id}/${this.languageRequested}`
            );
          });
        }
      );
    }
    this.getAnswers().subscribe((answers) => {
      this.answersNeeded = answers.filter(
        (answer: any) => answer.questionID === this.id
      );
      if (this.answersNeeded.length === 0) this.answersNeeded.push(answers[0], answers[1]);

      let correctAnswer = this.answersNeeded.filter(
        (answer: any) => answer.correctFlag === 0
      );
      this.correctAnswerID = correctAnswer[0]._id;
    });
  }
  registrationForm = this.fb.group({
    fullName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(
          '^[آ-یA-z]{2,}( [آ-یA-z]{2,})+([آ-یA-z]|[ ]?)|[_A-z]*((-|s)*[_A-z])$'
        ),
      ],
    ],
    mobileNumber: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(12),
        Validators.pattern('^[0-9]+$'),
      ],
    ],
  }) as any;
  setValue(index: any, answerId: any) {
    const classNameToUse = 'custom-control-label-active';
    this.answerValue = answerId;
    this.selected = true;
    let elem1 = document.querySelectorAll(`[${classNameToUse}]`);
    elem1.forEach((data) => {
      data.classList.remove(classNameToUse);
    });
    elem1[index].classList.add(classNameToUse);
  }
  get myForm() {
    return this.registrationForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    this.getUserAnswers().subscribe((answers) => {
      let value = answers.filter(
        (answer: any) =>
          answer.phone.toString() ===
          this.registrationForm.value.mobileNumber &&
          answer.questionID === this.id
      );
      if (value.length > 0) {
        this.isUserSubmittedBefore = true;
        this.isUserSuccessSubmitForm = false;
      } else {
        if (this.registrationForm.valid) {
          if (this.answerValue !== undefined) {
            this.postQuestion();
            this.submittedSuccessfully = true;
            this.isUserRequiredFields = false;
            this.isUserSubmittedBefore = false;
            this.isUserSuccessSubmitForm = true;
          } else {
            this.isUserRequiredFields = true;
            this.isUserSuccessSubmitForm = false;
          }
        } else {
          this.isUserRequiredFields = true;
          this.isUserSuccessSubmitForm = false;
        }
      }
    });
  }
  public getQuestion(id: any, error: boolean = false) {
    if (error) return this.http.get<any>(this.questionsUrl);
    else return this.http.get<any>(`${this.questionsUrl}${id}`);
  }
  public getAnswers() {
    return this.http.get<any>(this.answersUrl);
  }
  checkIfAnswerCorrect() {
    if (this.answerValue === this.correctAnswerID) this.isAnswerCorrect = true;
    else this.isAnswerCorrect = false;
  }
  getUserAnswers() {
    return this.http.get<any>(this.userAnswersUrl);
  }
  public postQuestion() {
    this.checkIfAnswerCorrect();
    let answer: any;
    if (this.isAnswerCorrect) answer = 1;
    else answer = 0;
    this.http
      .post<any>(this.userAnswersUrl, {
        Name: this.registrationForm.value.fullName,
        phone: this.registrationForm.value.mobileNumber,
        questionID: this.id,
        QuestionEN:
          this.languageRequested.toLowerCase() === this.lang[0].toLowerCase()
            ? this.questionDescription
            : '',
        QuestionAR:
          this.languageRequested.toLowerCase() === this.lang[0].toLowerCase()
            ? ''
            : this.questionDescription,
        answerId: this.answerValue,
        answer: answer,
      })
      .subscribe();
  }
}
