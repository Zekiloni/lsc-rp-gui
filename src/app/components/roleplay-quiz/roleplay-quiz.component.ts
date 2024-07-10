import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { QuizApiService } from '../../core/api/quizApi.service';
import { Question } from '../../core/model/question';
import { ApiError } from '../../core/model/apiError';
import { MessageService } from 'primeng/api';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { QuestionAnswerSubmit } from '../../core/model/questionAnswerSubmit';
import { QuizSubmit } from '../../core/model/quizSubmit';
import { QuizResult } from '../../core/model/quizResult';

@Component({
   selector: 'app-roleplay-quiz',
   standalone: true,
   imports: [
      ReactiveFormsModule,
      RadioButtonModule,
      ButtonModule,
   ],
   providers: [QuizApiService],
   templateUrl: './roleplay-quiz.component.html',
   styleUrl: './roleplay-quiz.component.scss',
})
export class RoleplayQuizComponent implements AfterViewInit {
   private readonly REGENERATE_QUIZ_MS = 5000;

   @Output() onTestSubmitResponse = new EventEmitter<boolean>();

   questions: Question[] | undefined;

   submitBtnDisabled: boolean = false;

   quizForm = this.formBuilder.group({});

   constructor(private quizApiService: QuizApiService,
               private messageService: MessageService,
               private formBuilder: FormBuilder) {
   }

   ngAfterViewInit() {
      this.generateQuiz();
   }

   private generateQuiz() {
      if (this.questions && this.questions.length > 0) {
         this.questions.forEach((question) => {
            this.quizForm.removeControl(question.id);
         });
      }

      this.quizApiService.retrieveQuiz()
         .subscribe({
            next: (questions) => this.handleFetchQuizQuestions(questions),
            error: (error: ApiError) => this.messageService.add({ severity: 'error', summary: error.message }),
         });
   }

   private handleFetchQuizQuestions(questions: Array<Question>) {
      this.questions = questions;
      questions.forEach(question => {
         this.quizForm.addControl(question.id, this.formBuilder.control('', Validators.required));
      });
   }

   submitQuizForm() {
      if (this.quizForm.invalid || !this.questions) {
         this.messageService.add({
            severity: 'error',
            summary: 'Greška',
            detail: 'Morate odgovoriti na sva pitanja',
         });
         return;
      }

      const quizSubmit: QuizSubmit = {
         answers: [],
      };

      this.questions.forEach(question => {
         quizSubmit.answers.push({ questionId: question.id, answerId: this.quizForm.get(question.id)!.value });
      });

      this.submitBtnDisabled = true;

      this.quizApiService.submitQuiz(quizSubmit)
         .subscribe({
            next: (response) => {
               this.onTestSubmitResponse.emit(!response.failed);

               if (response.failed) {
                  this.messageService.add({
                     severity: 'error',
                     summary: 'Neuspešno',
                     detail: this.getFailedMsg(response),
                  });

                  setTimeout(() => {
                     this.submitBtnDisabled = false;
                     this.generateQuiz();
                  }, this.REGENERATE_QUIZ_MS);
               }
            },
         });
   }

   private getFailedMsg(response: QuizResult) {
      return `Pali ste roleplay quiz sa ${response.wrongAnswers.length} netačnih pitanja, 
      maksimalan broj netačnih pitanja je ${response.maxFailedAnswers}, kviz će biti regenerisan za
      ${this.REGENERATE_QUIZ_MS / 1000} sekundi`;
   }
}
