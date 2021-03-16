import { NgModule } from '@angular/core';
import { SpinnerComponent } from '../components/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

import { CommonModule } from '@angular/common';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';

@NgModule({
  declarations: [SpinnerComponent, BottomSheetComponent],
  imports: [CommonModule, MatProgressSpinnerModule, MatBottomSheetModule],
  exports: [SpinnerComponent, BottomSheetComponent],
})
export class SharedModule {}
