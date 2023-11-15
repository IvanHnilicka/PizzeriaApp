import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
  constructor(private ApiService: PizzeriaAPIService, private toastr: ToastrService, private router: Router) { }
  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if(token){
      this.router.navigateByUrl('menu');
    }
  }
  
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
    
    const boton = document.getElementById('login-btn');
    const spinner = document.getElementById('login-spinner');
    const passInput = document.getElementById('password-input');
    passInput?.blur();
    boton?.classList.add('hidden');
    spinner?.classList.remove('hidden');
    
    this.ApiService.loginAPI(loginData).pipe(
      catchError((error: any) => {
        if(typeof error.error === "string"){
          this.toastr.error(error.error, 'Error');
        }else{
          this.toastr.error('Ha ocurrido un error');
        }
        
        boton?.classList.remove('hidden');
        spinner?.classList.add('hidden');

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
