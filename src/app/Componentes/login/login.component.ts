import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, switchMap, throwError } from 'rxjs';
import { ILogin } from 'src/app/Modelos/ILogin';
import { PizzeriaAPIService } from 'src/app/Servicios/PizzeriaAPI/pizzeria-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private ApiService: PizzeriaAPIService, private toastr: ToastrService, private router: Router) { }
  
  loginForm: FormGroup = new FormGroup({
    numEmpleado: new FormControl('', [Validators.required, Validators.min(1000), Validators.max(9999)]),
    contraseña: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  mostrarContrasena = false;

  login(){
    let loginData: ILogin = {
      numEmpleado: this.loginForm.controls['numEmpleado'].value,
      contraseña: this.loginForm.controls['contraseña'].value,
    }

    
    this.ApiService.loginAPI(loginData).pipe(
      catchError((error: any) => {
        if(typeof error.error === "string"){
          this.toastr.error(error.error, 'Error');
        }else{
          this.toastr.error('Ha ocurrido un error');
        }
        
        this.loginForm.controls['contraseña'].setValue('');
        localStorage.removeItem('token');
        return throwError(() => new Error(error.error));
      })
    ).subscribe((res: any) => {
      localStorage.setItem('token', res.token);
      this.router.navigateByUrl('menu');
    });
  }
}
