import { BehaviorSubject } from 'rxjs';

interface IError<T> {
  title: T;
  description: string;
}

export class MyError<T> implements IError<T> {
  title: T;
  description: string;
}
