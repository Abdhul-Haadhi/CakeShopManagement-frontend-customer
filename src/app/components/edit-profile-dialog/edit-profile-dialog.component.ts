import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerAuthService } from '../../servises/CustomerAuth/customer-auth.service';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatFormField, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './edit-profile-dialog.component.html',
  styleUrl: './edit-profile-dialog.component.scss'
})
export class EditProfileDialogComponent implements OnInit {

  profileForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: CustomerAuthService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EditProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  ngOnInit(): void {
    this.profileForm = this.fb.group({
      customerName: [this.data.customerName, Validators.required],
      email: [this.data.email],
      phone: [this.data.phone, Validators.required],
      address: [this.data.address]
    });
  }

  updateProfile() {
    this.authService.updateCustomer(this.data.customerId, this.profileForm.value).subscribe({
      next: () => {
        this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.snackBar.open('Failed to updat your profile', 'Close', { duration: 3000 });
      }
    });
  }

}
