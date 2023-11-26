import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Componentes/login/login.component';
import { RegistroComponent } from './Componentes/registro/registro.component';
import { MenuPrincipalComponent } from './Componentes/menu-principal/menu-principal.component';
import { MenuPedidosComponent } from './Componentes/menu-pedidos/menu-pedidos.component';
import { UsuariosComponent } from './Componentes/usuarios/usuarios.component';
import { CrearUsuarioComponent } from './Componentes/crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from './Componentes/editar-usuario/editar-usuario.component';
import { ReporteVentasComponent } from './Componentes/reporte-ventas/reporte-ventas.component';
import { ProductosComponent } from './Componentes/productos/productos.component';
import { AgregarProductoComponent } from './Componentes/agregar-producto/agregar-producto.component';
import { EditarProductoComponent } from './Componentes/editar-producto/editar-producto.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'menu', component: MenuPrincipalComponent },
  { path: 'pedidos', component: MenuPedidosComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'agregar_usuario', component: CrearUsuarioComponent },
  { path: 'editar_usuario/:numEmpleado', component: EditarUsuarioComponent },
  { path: 'ventas', component: ReporteVentasComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'agregar_producto', component: AgregarProductoComponent },
  { path: 'editar_producto/:idProducto', component: EditarProductoComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
