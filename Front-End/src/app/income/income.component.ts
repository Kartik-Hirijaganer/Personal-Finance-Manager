import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrl: './income.component.css'
})
export class IncomeComponent implements OnInit {
  incomeForm: FormGroup = new FormGroup({
    from: new FormControl<string>(''),
    date: new FormControl<string>(''),
    amount: new FormControl<number>(0)
  });

  ngOnInit() {
    this.incomeForm = new FormGroup({
      'from': new FormControl('', Validators.required),
      'date': new FormControl('', Validators.required),
      'amount': new FormControl(null, Validators.required)
    })
  }

  onSubmit() {
    console.log(this.incomeForm.getRawValue());
    
  }
}
