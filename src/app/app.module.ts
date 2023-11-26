import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Componentes/login/login.component';
import { RegistroComponent } from './Componentes/registro/registro.component';
import { MenuPrincipalComponent } from './Componentes/menu-principal/menu-principal.component';
import { CustomInterceptor } from './Servicios/Interceptor/custom.interceptor';
import { MenuPedidosComponent } from './Componentes/menu-pedidos/menu-pedidos.component';
import { UsuariosComponent } from './Componentes/usuarios/usuarios.component';
import { HeaderComponent } from './Componentes/header/header.component';
import { CrearUsuarioComponent } from './Componentes/crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from './Componentes/editar-usuario/editar-usuario.component';
import { ReporteVentasComponent } from './Componentes/reporte-ventas/reporte-ventas.component';
import { ProductosComponent } from './Componentes/productos/productos.component';
import { AgregarProductoComponent } from './Componentes/agregar-producto/agregar-producto.component';
import { EditarProductoComponent } from './Componentes/editar-producto/editar-producto.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    MenuPrincipalComponent,
    MenuPedidosComponent,
    UsuariosComponent,
    HeaderComponent,
    CrearUsuarioComponent,
    EditarUsuarioComponent,
    ReporteVentasComponent,
    ProductosComponent,
    AgregarProductoComponent,
    EditarProductoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      resetTimeoutOnDuplicate: false,
      timeOut: 3000,
      positionClass: 'toast-top-center',
      maxOpened: 1,
    }),
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: CustomInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
