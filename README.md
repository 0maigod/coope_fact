# Coope_Fact
Sistema para poder realizar facturas electronicas para las cooperadoras escolares de Argentina.
La autenticación para entrar al sistema la hice utilizando 0auth de google y Mongo Atlas, los passwords para ambos los guardo en un archivo .env con las variables que pongo en el archivo de ejemplo llamado .env_example.

Este repositorio funcionara como una guia paso a paso, para recordar que fue lo que fui haciendo mientras trataba de desarrollar esta aplicacion.

El primer paso fue adherirme al servicio WSASS dentro de mi usuario de AFIP tal como explica este guia:
https://www.afip.gob.ar/ws/WSASS/WSASS_como_adherirse.pdf

###Lo siguiente 
fue generar la clave privada. Como estoy en linux no tuve que instalar openssl y los comandos que use fueron:

```
openssl genrsa -out MiClavePrivada.key 2048
```

(que genera el key pair publico y privado) y a partir de ese archivo:

```
openssl req
  -new
  -key MiClavePrivada.key
  -subj "/C=AR/O=Empresa/CN=Sistema/serialNumber=CUIT nnnnnnnnnnn"
  -out MiPedidoCSR.csr
```

donde hay que reemplazar:
MiClavePrivada.key por nombre del archivo elegido en el primer paso.
Empresa por el nombre de su empresa
Sistema por el nombre de su sistema cliente
nnnnnnnnnnn por la CUIT (sólo los 11 dígitos, sin guiones) de la empresa o del programador
(persona jurídica)
MiPedidoCSR.csr por el nombre del archivo CSR que se va a crear

Luego de este paso tenemos que crear un certificado DN
 - Para eso entramos en el nuevo servicio vinculado (WSASS) y vamos a la opcion nuevo certificado
 - Ahi ponemos nuestro Alias, pegamos el contenido de nuestro archivo csr y clickeamos el boton de Crear
 - Con el texto que se genera, lo copiamos en un archivo de texto plano y le ponemos la extension .pem
 (el archivo pfx no lo cree...)
 Todos estos pasos estan detallados en este manual: https://www.afip.gob.ar/ws/WSASS/WSASS_manual.pdf
 - El archivo pem, junto con el cert y el key los copiamos en la carpeta Afip_res que esta ubicada en node_module/@afipsdk/afip.js
 

