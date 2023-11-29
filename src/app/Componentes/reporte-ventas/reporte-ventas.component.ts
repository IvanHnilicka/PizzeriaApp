import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VentaProducto } from 'src/app/Modelos/IVenta-Producto';
import { PizzeriaAPIService } from 'src/app/Servicios/PizzeriaAPI/pizzeria-api.service';

@Component({
  selector: 'app-reporte-ventas',
  templateUrl: './reporte-ventas.component.html',
  styleUrls: ['./reporte-ventas.component.css']
})
export class ReporteVentasComponent implements OnInit {
  constructor(private ApiService: PizzeriaAPIService, private router: Router, private toastr: ToastrService) { }

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
          this.ventas = this.getVentas();
        }
  
        if(!this.isAdmin){
          this.router.navigateByUrl('pedidos');
          this.toastr.error('No cuentas con permisos de administrador', 'Error');
        }
      });
    }
  }

  isAdmin = false;
  mes: number = (new Date().getMonth() + 1) % 12;
  sortMethod: string = 'nombre';
  ventas: VentaProducto[] = [];

  getVentas(): any{
    this.ventas = [];

    this.ApiService.getVentasMes(this.mes).subscribe({
      next: (res: any) => {
        this.ventas = res;
        this.sort();
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error(error.message, 'Ha ocurrido un error');
      }
    })
  }


  // Ordena el arreglo segun la opcion escogida
  sort(){
    if(this.sortMethod === 'cantidad'){
      this.ventas.sort((a: VentaProducto, b: VentaProducto) => {
        return b.cantidadVendida - a.cantidadVendida;
      });
    }
    else if(this.sortMethod === 'ganancias'){
      this.ventas.sort((a: VentaProducto, b: VentaProducto) => {
        return b.ganancias - a.ganancias;
      });
    }
    else{
      this.ventas.sort((a: VentaProducto, b: VentaProducto) => {
        return a.producto > b.producto ? 1 : -1;
      });
    }
  }

  getCantidadTotal(): number{
    let cantidadTotal = 0;
    this.ventas.forEach(v => {
      cantidadTotal += v.cantidadVendida;
    });

    return cantidadTotal;
  }

  getTotalGanancias(): number{
    let totalGanancias = 0;
    this.ventas.forEach(v => {
      totalGanancias += v.ganancias;
    });

    return totalGanancias;
  }
}
