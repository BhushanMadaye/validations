import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface IErrorKeys {
  name: string,
  email: string,
  area: string,
  street: string,
  pincode: string,
}

export interface IValidationMessagesKeys {
  name: IErrorTypes,
  email: IErrorTypes,
  area: IErrorTypes,
  street: IErrorTypes,
  pincode: IErrorTypes,
}

export interface IErrorTypes {
  required?: string,
  email?: string,
  maxlength?: string,
  minlength?: string,
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  myForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: this.fb.group({
      area: ['', [Validators.required, Validators.maxLength(15)]],
      street: ['', Validators.maxLength(10)],
      pincode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    })
  })

  /** For displaying messages to user according available errors */
  formErrors: IErrorKeys = {
    name: '',
    email: '',
    area: '',
    street: '',
    pincode: '',
  }

  /** List of validation messages */
  validationMessages: IValidationMessagesKeys = {
    name: {
      required: 'Name required'
    },
    email: {
      required: 'Email required',
      email: 'Email invalid',
    },
    area: {
      required: 'Area required',
      maxlength: 'Length must not be more than 15 characters',
    },
    street: {
      maxlength: 'Length must not be more than 10 characters'
    },
    pincode: {
      required: 'Pincode required',
      minlength: 'Invalid Pincode',
      maxlength: 'Invalid Pincode',
    }
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.myForm.valueChanges.subscribe(() => {
      this.validateControls()
    })
  }

  validateControls(group: FormGroup = this.myForm) {

    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get([key]);
      if (abstractControl instanceof FormGroup) {
        // group.markAllAsTouched();
        this.validateControls(abstractControl)
      } else {
        // abstractControl?.markAsTouched();
        if (abstractControl?.invalid && (abstractControl?.touched || abstractControl?.dirty)) {
          this.formErrors[key as keyof IErrorKeys] = '';
          for (const errorKey in abstractControl?.errors) {
            if (errorKey) {
              this.formErrors[key as keyof IErrorKeys] += this.validationMessages[key as keyof IErrorKeys][errorKey as keyof IErrorTypes]
            }
          }
        } else {
          this.formErrors[key as keyof IErrorKeys] = ''
        }
      }
    })
  }

  submitData() {
    this.myForm.markAllAsTouched()
    this.validateControls();

    if (this.myForm.invalid) return
    console.log(`Data submitted: `)
    console.log(this.myForm.value);

  }

  clearData() {
    this.myForm.reset()
  }
}
