import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { INuevoProducto } from 'src/app/Modelos/INuevo-Producto';
import { IProducto } from 'src/app/Modelos/IProducto';
import { PizzeriaAPIService } from 'src/app/Servicios/PizzeriaAPI/pizzeria-api.service';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css']
})
export class EditarProductoComponent implements OnInit {
  constructor(private ApiService: PizzeriaAPIService, private router: Router, private route: ActivatedRoute, private toastr: ToastrService){ }

  ngOnInit(): void {
    // Valida que un usuario este loggeado
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

    // Obtiene el numero de empleado de la ruta y busca los datos del empleado
    this.route.params.subscribe({
      next: (params) => {
        this.idProducto = params['idProducto'];
        this.ApiService.getProductoById(this.idProducto).subscribe({
          next: (res: any) => {
            this.producto = res;
            this.editarProductoForm.controls['nombre'].setValue(this.producto.nombre);
            this.editarProductoForm.controls['precio'].setValue(this.producto.costo);
          },
          error: (error) => {
            this.toastr.error(error.message, 'Ha ocurrido un error');
          }
        })
      },
      error: (error) => {
        this.toastr.error(error.message, 'Ha ocurrido un error');
      }
    });
  }

  
  editarProductoForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    precio: new FormControl('', [Validators.required]),
  });

  isAdmin: boolean = false;
  idProducto = -1;
  producto: IProducto = {
    id: -1,
    nombre: '',
    costo: -1
  }


  editarProducto(){
    let datosProducto: INuevoProducto = {
      Nombre: this.editarProductoForm.controls['nombre'].value,
      Costo: this.editarProductoForm.controls['precio'].value
    }

    this.ApiService.updateProducto(this.idProducto, datosProducto).subscribe({
      next: () => {
        this.toastr.success('Los datos han sido actualizados exitosamente');
        this.router.navigateByUrl('/productos');
      },
      error: (error) => {
        this.toastr.error(error.message, 'Ha ocurrido un error');
      }
    })
  }
}
