import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthLayoutComponent } from './app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './app-layout/main-layout/main-layout.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
@NgModule({
  imports: [CommonModule],
  declarations: [AuthLayoutComponent, MainLayoutComponent, HeaderComponent, SidebarComponent],
})
export class LayoutModule {}
