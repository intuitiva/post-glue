# Proceso Post-Glue (Notificar a Zauru que Glue terminó):

Este proyecto consiste en configurar CloudWatch para que envíe un evento a esta función lambda que enviará la notificación a Zauru para ver si dio error o fue satisfactorio el Glue Job.

## Deploy con Serverless Framework
1. npm install
2. configurar .env (ejemplo en el siguiente punto)
2. serverless deploy (para dev) o serverless deploy --stage production (para prod)

> Gracias al Serverless Framework, en donde los permisos IAM se definen en el código, no hay que configurar nada para poder subir el código. Solo tenemos que asegurarnos que el .env esté correcto (siguiente punto)

### Variables de entorno a configurar en el archivo .env
```
AWS_S3_ACCESS_KEY=SECRET1
AWS_S3_SECRET_KEY=SECRET2
AWS_AZ_REGION=us-east-1
AWS_S3_BUCKET_DESTINATION=destination_bucket
ZAURU_GET_UUID_URL_PREFIX=https://app.zauru.com/data_import_jobs/
ZAURU_GET_UUID_URL_SUFIX=/get_uuid_based_on_external_id.json
ZAURU_PUT_URL=https://app.zauru.com/data_import_jobs/
ZAURU_HEADER_USER_EMAIL=pruebas@zauru.com
ZAURU_HEADER_USER_TOKEN=SOsdfpSPDSpsosFUFJ
```

### Pruebas desde el Serverless Framework

Se colocó un evento de prueba en el código con el archivo ``event.json`` ese archivo se puede utilizar para probar el evento de la siguiente forma:

```
serverless invoke local --function cloudwatchglues3cleaner --path event.json
```

## Configuración de AWS Cloudwatch para que haga trigger esta función

1. Entrar a CloudWatch
2. Entrar a propiedades del bucket
3. Entrar a eventos y seleccionar "+ Añadir notificación"
4. Seleccionar los eventos PUT y POST
5. En "Enviar a" seleccionar "Función de Lambda"
6. Seleccionar en "Lambda" esta función.

Licencia MIT