import { NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService } from '../../servises/payment/payment.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [MatDialogContent, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, NgIf],
  templateUrl: './payment-dialog.component.html',
  styleUrl: './payment-dialog.component.scss'
})
export class PaymentDialogComponent implements OnInit {

  paymentForm: FormGroup;

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
