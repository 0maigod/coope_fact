# coope_fact
Sistema para poder realizar facturas electronicas para las cooperadoras escolares de Argentina.

Este repositorio funcionara como una guia paso a paso, para recordar que fue lo que fui haciendo mientras trataba de desarrollar esta aplicacion.

El primer paso fue adherirme al servicio WSASS dentro de mi usuario de AFIP tal como explica este guia:
https://www.afip.gob.ar/ws/WSASS/WSASS_como_adherirse.pdf

Lo siguiente fue generar la clave privada. Como estoy en linux no tuve que instalar openssl y los comandos que use fueron:

openssl genrsa -out MiClavePrivada.key 2048

(que genera el key pair publico y privado) y a partir de ese archivo:

openssl req
  -new
  -key MiClavePrivada.key
  -subj "/C=AR/O=Empresa/CN=Sistema/serialNumber=CUIT nnnnnnnnnnn"
  -out MiPedidoCSR.csr
  
donde hay que reemplazar:
MiClavePrivada.key por nombre del archivo elegido en el primer paso.
Empresa por el nombre de su empresa
Sistema por el nombre de su sistema cliente
nnnnnnnnnnn por la CUIT (sólo los 11 dígitos, sin guiones) de la empresa o del programador
(persona jurídica)
MiPedidoCSR.csr por el nombre del archivo CSR que se va a crear

Luego de este paso tenemos que crear un certificado DN
