import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { CustomerAuthService } from '../../servises/CustomerAuth/customer-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule, CommonModule, MatInputModule, MatButtonModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: CustomerAuthService,
    private snackBar: MatSnackBar,
    private router: Router) {
    this.registerForm = this.fb.group({
      customerName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required]
    })
  }

  registerCustomer() {
    if (this.registerForm.invalid) {
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.snackBar.open('Registration successful', 'Close', { duration: 3000 });

        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.snackBar.open(error.error.message || 'Registration failed', 'Close', { duration: 3000 });
      }
    });
  }

}
