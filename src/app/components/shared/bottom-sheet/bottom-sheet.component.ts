import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/app/service/error/error.service';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class BottomSheetComponent implements OnInit {
  titleError: any;
  descriptionError: string;
  constructor(
    private sheetRef: MatBottomSheet,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.errorService.currentErrorSubject.subscribe((x) => {
      this.titleError = x.title;
      this.descriptionError = x.description;
    });
  }

  setError(error: any) {
    const myError = this.errorService.currentErrorSubject.value;
    console.log('bottom error service 2', myError);
    debugger;
  }

  openBottomSheet() {
    this.sheetRef.open(BottomSheetComponent);
  }
}
