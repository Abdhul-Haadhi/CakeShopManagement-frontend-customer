import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { CustomerAuthService } from '../../servises/CustomerAuth/customer-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../servises/cart/cart.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [MatFormField, MatLabel, MatIcon, CommonModule, ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  loginForm: FormGroup;

  otpSent = false;
  enteredOtp = '';
  generatedOtp = '';
  showOtpField = false;
  isButtonDisabled = false;

  countdownSeconds = 300; // 5 minutes = 300 seconds
  timerDisplay = '';
  private timerInterval: any;

  constructor(private fb: FormBuilder,
    private authService: CustomerAuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cartService: CartService,
  ) {
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      otp: ['']
    })
  }

  // sendOtp() {
  //   if (this.loginForm.invalid) {
  //     return;
  //   }

  //   this.authService.sendOtp(this.loginForm.value.phone).subscribe((res: any) => {
  //     this.generatedOtp = res.otp;
  //     this.otpSent = true;
  //   });
  // }

  sendOtp() {

    if (this.loginForm.invalid) {
      return;
    }

    const phone = this.loginForm.value.phone;

    this.authService.sendOtp(phone).subscribe({
      next: (response: any) => {
        console.log("OTP Response:", response);

        if (response.otp) {
          this.generatedOtp = response.otp;
          this.otpSent = true;
          // this.snackBar.open(`Your OTP is: ${response.otp}`, 'Close', { duration: 20000 });
        }

        this.otpSent = true;

        this.loginForm.get('otp')?.setValidators([Validators.required]);
        this.loginForm.get('otp')?.updateValueAndValidity();

        this.showOtpField = true; // show verify input
        this.startCountdown(300);
      },
      error: (error) => {
        console.log(error);

        this.snackBar.open(
          'Failed to generate OTP',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }


  startCountdown(seconds: number) {
    this.isButtonDisabled = true;
    this.countdownSeconds = seconds;
    this.updateTimerDisplay();

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      this.countdownSeconds--;
      this.updateTimerDisplay();

      if (this.countdownSeconds <= 0) {
        clearInterval(this.timerInterval);
        this.isButtonDisabled = false;
        this.timerDisplay = '';
      }
    }, 1000);

  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.countdownSeconds / 60);
    const seconds = this.countdownSeconds % 60;

    this.timerDisplay = `(${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')})`;
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }



  verifyOtp() {
    this.authService.verifyOtp(this.loginForm.value.phone, this.enteredOtp).subscribe({
      next: (response: any) => {
        // localStorage.setItem("customerId", response.customerId);

        this.authService.login(response.customerId, this.loginForm.value.phone);

        const sessionId = localStorage.getItem('cartId');
        if (sessionId) {
          this.cartService.mergeCart(sessionId, response.customerId).subscribe({
            next: () => {
              localStorage.removeItem('cartId');
              this.cartService.createCartSession();
              this.cartService.updateCartCount();
            }
          });
        }

        this.snackBar.open('Login successful', 'Close', { duration: 3000 });

        this.cartService.updateCartCount();

        const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';

        localStorage.removeItem('redirectAfterLogin');
        this.router.navigate([redirectPath]);

      },
      error: (error) => {
        this.snackBar.open('Check your OTP', 'Close', { duration: 3000 });
      }
    });
  }


}
