<?php
// Establecer encabezados CORS para permitir solicitudes desde cualquier origen
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Verificar el método HTTP
$metodo = $_SERVER['REQUEST_METHOD'];
$dirLocal = "imgs";
$extensionesPermitidas = array("jpg", "jpeg", "png", "gif");


switch ($metodo) {
    case 'GET':
        // Obtener lista de archivos en el directorio
        $archivos = scandir($dirLocal);

        // Filtrar solo los archivos de imagen
        $imagenes = array_filter($archivos, function ($archivo) use ($extensionesPermitidas) {
            $extension = strtolower(pathinfo($archivo, PATHINFO_EXTENSION));
            return in_array($extension, $extensionesPermitidas);
        });


        // Convertir el array de imágenes a un array indexado
        $imagenes = array_values($imagenes);

        // Devolver la lista de imágenes como respuesta JSON
        echo json_encode($imagenes);
        break;


    case 'POST':
        // Verificar si se ha enviado un archivo
        if (isset($_FILES['avatar'])) {
            $archivoTemporal = $_FILES['avatar']['tmp_name'];
            $nombreArchivo = $_FILES['avatar']['name'];

            $extension = strtolower(pathinfo($nombreArchivo, PATHINFO_EXTENSION));

            if (in_array($extension, $extensionesPermitidas)) {

                // Generar un nombre único y seguro para el archivo
                $nombreArchivo = substr(md5(uniqid(rand())), 0, 10) . "." . $extension;
                $rutaDestino = $dirLocal . '/' . $nombreArchivo;

                // Mover el archivo a la ubicación deseada
                if (move_uploaded_file($archivoTemporal, $rutaDestino)) {
                    echo json_encode(array('message' => 'Imagen subida correctamente', 'nombre_archivo' => $nombreArchivo));
                } else {
                    echo json_encode(array('error' => 'Error al mover el archivo'));
                }
            } else {
                echo json_encode(array('error' => 'Tipo de archivo no permitido'));
            }
        } else {
            echo json_encode(array('error' => 'No se ha enviado ningún archivo o ha ocurrido un error al cargar el archivo'));
        }
        break;


    default:
        // Método no permitido
        http_response_code(405);
        echo json_encode(array('error' => 'Método no permitido'));
        break;
}
