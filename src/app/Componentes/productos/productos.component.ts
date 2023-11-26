import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IProducto } from 'src/app/Modelos/IProducto';
import { PizzeriaAPIService } from 'src/app/Servicios/PizzeriaAPI/pizzeria-api.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  constructor(private ApiService: PizzeriaAPIService, private router: Router, private toastr: ToastrService){ }

  ngOnInit(): void {
    let token = localStorage.getItem('token')?.toString();
    if(!token){
      this.toastr.error("Inicia sesion para continuar", "Acceso denegado");
      this.router.navigateByUrl('login');
    }else{
      this.ApiService.getDatosUsuarioLoggeado().subscribe((res: any) => {
        let datos = res.value;
        if(datos){
          this.isAdmin = datos.admin;
        }
  
        if(!this.isAdmin){
          this.router.navigateByUrl('pedidos');
          this.toastr.error('No cuentas con permisos de administrador', 'Error');
        }
      });
    }

    this.ApiService.getProductos().subscribe({
      next: (res: any) => {
        this.productos = res;
      },
      error: (error:HttpErrorResponse) => {
        this.toastr.error(error.message, 'Ha ocurrido un error');
      }
    })
  }

  isAdmin: boolean = false;
  showModal: boolean = false;
  productos: IProducto[] = [];
  productoPorEliminar: string = '';


  editarProducto(productoId: number){
    this.router.navigateByUrl(`/editar_producto/${productoId}`);
  }

  deleteProducto(){
    this.ApiService.deleteProducto(this.productoPorEliminar).subscribe({
      next: () => {
        this.showModal = false;
        this.toastr.success(`El producto "${this.productoPorEliminar}" ha sido eliminado exitosamente`);
        this.router.navigateByUrl('/', { replaceUrl: true }).then(() => this.router.navigateByUrl('/productos'));
      },
      error: (error: any) => {
        console.log(error);
        this.toastr.error(error.message, 'Ha ocurrido un error');
      }
    })
  }
}
