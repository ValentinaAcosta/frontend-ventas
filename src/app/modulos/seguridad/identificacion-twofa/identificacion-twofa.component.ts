import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioValidadoModel } from 'src/app/modelos/usuario.validado.model';
import { SeguridadService } from 'src/app/servicios/seguridad.service';

@Component({
  selector: 'app-verificacion-dosfa',
  templateUrl: './identificacion-twofa.component.html',
  styleUrls: ['./identificacion-twofa.component.css']
})
export class IdentificacionTwofaComponent {

  usuarioId: string="";
  fGroup:FormGroup = new FormGroup({});

  constructor(
    private servicioSeguridad : SeguridadService,
    private fb : FormBuilder,
    private router: Router){

  }

  ngOnInit(){
    let datos = this.servicioSeguridad.ObtenerDatosUsuarioLS();
    if(datos != null){
      this.usuarioId = datos._id!;
      this.ConstruirFormulario();
    }else{
      this.router.navigate(['/seguridad/identificacion-usuario'])
    }
  }

  ConstruirFormulario(){
    this.fGroup = this.fb.group({
      codigo: ['', [Validators.required]]
    });
  }

  ValidarCodigo2fa(){
    if(this.fGroup.invalid){
      alert("Debe ingresar el codigo");
    }else {
    let codigo2fa = this.ObtenerFormGroup["codigo"].value;
    this.servicioSeguridad.ValidarCodigo2FA(this.usuarioId, codigo2fa).subscribe({
      next: (datos:UsuarioValidadoModel) =>{
        console.log(datos);
        this.servicioSeguridad.AlmacenarDatosUsuarioValidado(datos);
        this.router.navigate([""]);
      },
      error: (err) => {
        console.log(err);
      }
    });
    }
  }


  get ObtenerFormGroup(){
    return this.fGroup.controls;
  }

}
