import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  selectedRole: 'individual' | 'club' = 'individual';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.resetForm();
  }

  get coreMembers() {
    return this.signupForm.get('coreMembers') as FormArray;
  }

  addCoreMember() {
    const memberGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      role: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@pce\\.edu\\.in$')]]
    });
    this.coreMembers.push(memberGroup);
  }

  removeCoreMember(index: number) {
    this.coreMembers.removeAt(index);
  }

  branchOptions = [
    { value: 'CSE', label: 'Computer Science Engineering' },
    { value: 'CT', label: 'Computer Technology' },
    { value: 'ECE', label: 'Electronics & Communication' },
    { value: 'EEE', label: 'Electrical & Electronics' },
    { value: 'MECH', label: 'Mechanical Engineering' },
    { value: 'CIVIL', label: 'Civil Engineering' }
  ];

  genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  batchOptions = [
    { value: '2020-2024', label: '2020-2024' },
    { value: '2021-2025', label: '2021-2025' },
    { value: '2022-2026', label: '2022-2026' },
    { value: '2023-2027', label: '2023-2027' }
  ];

  selectRole(role: 'individual' | 'club') {
    this.selectedRole = role;
    this.resetForm();
  }

  resetForm() {
    const commonFields = {
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@pce\\.edu\\.in$')]],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      ])],
      confirmPassword: ['', [Validators.required]]
    };

    if (this.selectedRole === 'individual') {
      this.signupForm = this.fb.group({
        ...commonFields,
        fullName: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z\\s]*$')]],
        studentId: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
        branch: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        batch: ['', [Validators.required]],
        birthday: ['', [Validators.required]],
        bio: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
        profilePicture: ['', [Validators.required]]
      }, {
        validators: this.passwordMatchValidator
      });
    } else {
      this.signupForm = this.fb.group({
        ...commonFields,
        clubName: ['', [Validators.required, Validators.minLength(3)]],
        description: ['', [Validators.required, Validators.minLength(20)]],
        category: ['', [Validators.required]],
        clubId: ['', [Validators.required, Validators.pattern('^[A-Z0-9]{6}$')]],
        coreMembers: this.fb.array([
          this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            role: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@pce\\.edu\\.in$')]]
          })
        ])
      }, {
        validators: this.passwordMatchValidator
      });
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    return null;
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();

      if (this.signupForm.get('email')?.errors?.['pattern']) {
        this.errorMessage = 'Please use your college email address (@pce.edu.in)';
      } else if (this.signupForm.get('password')?.errors?.['pattern']) {
        this.errorMessage = 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character';
      } else if (this.signupForm.get('confirmPassword')?.errors?.['passwordMismatch']) {
        this.errorMessage = 'Passwords do not match.';
      } else {
        this.errorMessage = 'Please fix the errors in the form before submitting.';
      }
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formData = this.signupForm.value;

    if (this.selectedRole === 'individual') {
      delete formData.coreMembers;
      delete formData.clubName;
      delete formData.category;
      delete formData.clubId;
      delete formData.description;
    } else {
      delete formData.fullName;
      delete formData.studentId;
      delete formData.branch;
      delete formData.gender;
      delete formData.batch;
      delete formData.birthday;
      delete formData.bio;
      delete formData.profilePicture;
    }

    this.authService.signup(formData).subscribe({
      next: () => {
        this.authService.login(formData.email, formData.password).subscribe({
          next: () => this.router.navigate(['/dashboard']),
          error: (error) => {
            this.isSubmitting = false;
            this.errorMessage = 'Login after signup failed. Please try logging in manually.';
          }
        });
      },
      error: (error: any) => {
        this.isSubmitting = false;
        if (error.code === 'auth/email-already-in-use') {
          this.errorMessage = 'This email is already registered. Try logging in.';
        } else {
          this.errorMessage = 'An error occurred during registration. Please try again.';
        }
      }
    });
  }
}
