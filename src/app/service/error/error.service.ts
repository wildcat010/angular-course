import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MyError } from 'src/app/model/error';

export type errorType<T> = { value: T };

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  currentErrorSubject: BehaviorSubject<
    MyError<string | number>
  > = new BehaviorSubject<MyError<string | number>>({
    title: '',
    description: '',
  });
}
