import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { INuevoUsuario } from 'src/app/Modelos/INuevo-Usuario';
import { INuevoEmpleado } from 'src/app/Modelos/inuevo-empleado';
import { PizzeriaAPIService } from 'src/app/Servicios/PizzeriaAPI/pizzeria-api.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit {
  constructor(private ApiService: PizzeriaAPIService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    // Valida que haya un usuario loggeado
    let token = localStorage.getItem('token')?.toString();
    if(!token){
      this.toastr.error("Inicia sesion para continuar", "Acceso denegado");
      this.router.navigateByUrl('login');
    }else{
      // Valida que el usuario tenga permisos de administrador
      this.ApiService.getDatosUsuarioLoggeado().subscribe((res: any) => {
        let datos = res.value;
        if(datos){
          this.isAdmin = datos.admin;
        }
  
        if(!this.isAdmin){
          this.toastr.error('No cuentas con permisos de administrador', 'Acceso denegado');
          this.router.navigateByUrl('pedidos');
        }
      });
    }
  }

  crearUsuarioForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
    contraseña: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,}$/)]),
    confirmacion: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,}$/)]),
    administrador: new FormControl(false),
  })

  isAdmin: boolean = false;
  mostrarContrasena: boolean = false;
  mostrarConfirmacion: boolean = false;

  nuevoUsuario: INuevoUsuario = {
    Nombre: '',
    Correo: '',
    Telefono: '',
    Contraseña: '',
    Admin: false,
  }

  agregarUsuario(){
    if(this.crearUsuarioForm.controls['contraseña'].value != this.crearUsuarioForm.controls['confirmacion'].value){
      this.toastr.error('Contraseñas no coinciden', 'Error');
      return;
    }

    let nombre: string = this.crearUsuarioForm.controls['nombre'].value;
    if(nombre.trim().length === 0){
      this.toastr.error('Ingrese un nombre valido', 'Error');
      return;
    }
    
    this.nuevoUsuario.Nombre = this.crearUsuarioForm.controls['nombre'].value;
    this.nuevoUsuario.Correo = this.crearUsuarioForm.controls['correo'].value;
    this.nuevoUsuario.Telefono = this.crearUsuarioForm.controls['telefono'].value.toString();
    this.nuevoUsuario.Contraseña = this.crearUsuarioForm.controls['contraseña'].value;
    this.nuevoUsuario.Admin = this.crearUsuarioForm.controls['administrador'].value;

    this.ApiService.crearUsuario(this.nuevoUsuario).subscribe({
      next: (response: any) => {
        let nuevoEmpleado: INuevoEmpleado = {
          NumEmpleado: response.id,
          Nombre: this.crearUsuarioForm.controls['nombre'].value,
          Correo: this.crearUsuarioForm.controls['correo'].value,
          Telefono: this.crearUsuarioForm.controls['telefono'].value.toString(),
          Admin: this.crearUsuarioForm.controls['administrador'].value,
        }

        this.ApiService.crearEmpleado(nuevoEmpleado).subscribe({
          next: () => {
            this.toastr.success(`Usuario ${nuevoEmpleado.NumEmpleado} creado`);
            this.router.navigateByUrl('/usuarios');
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error(error.message, 'Ha ocurrido un error');
        console.log(error);
      }
    });
  }
}
