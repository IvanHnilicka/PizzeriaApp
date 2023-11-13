import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, switchMap, throwError } from 'rxjs';
import { IDatosUsuario } from 'src/app/Modelos/IDatosUsuario';
import { PizzeriaAPIService } from 'src/app/Servicios/PizzeriaAPI/pizzeria-api.service';

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.css']
})
export class MenuPrincipalComponent implements OnInit {
  constructor(private ApiService: PizzeriaAPIService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.cargarDatosUsuario();
    
    let token = localStorage.getItem('token')?.toString();
    if(!token){
      this.toastr.error("Inicia sesion para continuar", "Acceso denegado");
      this.router.navigateByUrl('login');
      return;
    }    
  }

  usuario : IDatosUsuario = {
    numEmpleado: 0,
    nombre: '',
    correo: '',
    telefono: '',
    admin: false
  };

  async cargarDatosUsuario(){
    // Obtiene los el numero del empleado loggeado
    this.ApiService.getNumEmpleadoLoggeado().pipe(
      switchMap((numEmpleado: number) => {
        // Retorna los datos del empleado loggeado
        return this.ApiService.getDatosEmpleadoByNum(numEmpleado);
      }),
      // Vuelve a la pagina de login si hay un error
      catchError((error) => {
        this.toastr.error(error.error, 'Error');
        this.router.navigateByUrl('login');
        localStorage.removeItem('token');
        return throwError(() => new Error(error.error));
      })
    ).subscribe((datos: any) => {
      this.usuario = datos;
    });
  }

  logOut(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('login');
  }
}
