import { NgFor, NgIf } from '@angular/common';
import { ApplicationConfig, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService } from '../../servises/payment/payment.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations()
  ]
};


@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [MatDialogContent, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, ReactiveFormsModule, MatIconModule, MatTooltipModule, NgIf, MatOptionModule, NgFor],
  templateUrl: './payment-dialog.component.html',
  styleUrl: './payment-dialog.component.scss'
})
export class PaymentDialogComponent implements OnInit {

  paymentForm: FormGroup;

  months: string[] = [];
  years: number[] = [];

  constructor(
    private dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      cardHolderName: ['', Validators.required],
      expiryMonth: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])$')]],
      expiryYear: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]]
    });

  }

  ngOnInit(): void {
    this.months = Array.from({ length: 12 }, (_, i) =>
      (i + 1).toString().padStart(2, '0')
    );

    const currentYear = new Date().getFullYear();

    this.years = Array.from({ length: 15 }, (_, i) => currentYear + i);


    this.paymentForm.get('expiryYear')?.valueChanges.subscribe(() => {
      const selectedMonth = this.paymentForm.get('expiryMonth')?.value;

      if (selectedMonth && this.isMonthDisabled(selectedMonth)) {
        this.paymentForm.get('expiryMonth')?.setValue('');
      }
    });

  }

  getCurrentMonth(): number {
    return new Date().getMonth() + 1;
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  isMonthDisabled(month: string): boolean {
    const selectedYear = Number(this.paymentForm.get('expiryYear')?.value);

    if (!selectedYear) {
      return false;
    }

    if (selectedYear === this.getCurrentYear()) {
      return Number(month) < this.getCurrentMonth();
    }

    return false;
  }

  processPayment() {
    if (this.paymentForm.invalid) {
      return;
    }

    const paymentData = {
      ...this.paymentForm.value,
      amount: this.data.totalAmount,
    };

    this.paymentService.processPayment(paymentData).subscribe({
      next: (response: any) => {
        this.snackBar.open('Payment Successful', 'Close', { duration: 3000 });

        this.dialogRef.close(response);
      },
      error: () => {
        this.snackBar.open('Payment Failed', 'Close', { duration: 3000 });
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
