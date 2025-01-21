import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  http = inject(HttpClient);
  cars: any = [];

  carsFilter = [
    { active: true, name: 'Все марки' },
    { active: false, name: 'Lamborghini' },
    { active: false, name: 'Ferrari' },
    { active: false, name: 'Porsche' },
    { active: false, name: 'BMW' },
    { active: false, name: 'Mercedes' },
    { active: false, name: 'Chevrolet' },
    { active: false, name: 'Audi' },
    { active: false, name: 'Ford' },
  ];

  orderForm = new FormGroup({
    car: new FormControl(''),
    name: new FormControl(''),
    phone: new FormControl(''),
  });

  ngOnInit() {
    // this.cars = this.baseCars;
    this.getCars('');
  }

  getCars(filter: string) {
    this.http
      .get('https://testologia.ru/cars-data', {
        params: { filter: filter },
      })
      .subscribe((data) => (this.cars = data));
  }

  changeFilter(filter: any, carsContent: HTMLElement) {
    this.carsFilter.forEach((el) => (el.active = false));
    filter.active = true;
    this.getCars(filter.name);
    carsContent.scrollIntoView({ behavior: 'instant' });
  }

  isError(fieldName: string) {
    const control = this.orderForm.get(fieldName);
    return !!(control?.invalid && (control?.dirty || control.touched));
  }

  sendOrder() {
    if (this.orderForm.valid) {
      this.http
        .post('https://testologia.ru/cars-order', this.orderForm.value)
        .subscribe({
          next: (response: any) => {
            alert(response.message);
            this.orderForm.reset();
          },
          error: (response: any) => {
            alert(response.error.message);
          },
        });
    }
  }
}
