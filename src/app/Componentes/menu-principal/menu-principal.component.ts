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
    let token = localStorage.getItem('token')?.toString();
    if(!token){
      this.toastr.error("Inicia sesion para continuar", "Acceso denegado");
      this.router.navigateByUrl('login');
    };

    this.ApiService.getDatosUsuario().subscribe((res: any) => {
      let datos = res.value;
      if(datos){
        let nombres = datos.nombre.split(' ');
        this.nombreUsuario = nombres[0];
        this.isAdmin = datos.admin;
      }

      if(!this.isAdmin){
        this.router.navigateByUrl('pedidos');
      }
    });
  }

  isAdmin: any = false;
  nombreUsuario: any = '';

  logOut(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('login');
  }
}
