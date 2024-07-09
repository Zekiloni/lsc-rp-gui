import { AfterViewInit, Component } from '@angular/core';
import { QuizApiService } from '../../core/api/quizApi.service';
import { Question } from '../../core/model/question';
import { ApiError } from '../../core/model/apiError';
import { MessageService } from 'primeng/api';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { QuestionAnswerSubmit } from '../../core/model/questionAnswerSubmit';
import { QuizSubmit } from '../../core/model/quizSubmit';

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
   questions: Question[] | undefined;
   quizForm = this.formBuilder.group({});

   constructor(private quizApiService: QuizApiService,
               private messageService: MessageService,
               private formBuilder: FormBuilder) {
   }

   ngAfterViewInit(): void {
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
         return;
      }

      const quizSubmit: QuizSubmit = {
         answers: [],
      };

      console.log('aa');
      this.questions.forEach(question => {
         quizSubmit.answers.push({ questionId: question.id, answerId: this.quizForm.get(question.id)!.value });
      });

      console.log(quizSubmit);

      this.quizApiService.submitQuiz(quizSubmit)
         .subscribe({
            next: (response) => console.log(response)
         });
   }
}
