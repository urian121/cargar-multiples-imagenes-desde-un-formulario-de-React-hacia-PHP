import { useState, useEffect } from "react";
import axios from "axios";
import ImagenesGuardadas from "./ListaImagenes";
import Titulo from "./Titulo";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubirImagen = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const URL_API =
    "http://localhost/como-subir-imagenes-desde-un-formulario-con-react/Backend-php/";

  /**
   * La función handleSubirImagen captura el primer archivo seleccionado por el usuario desde un campo de entrada de archivos y lo establece como el archivo seleccionado en el estado del componente.
   */
  const handleSubirImagen = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      try {
        const response = await axios.post(URL_API, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        // console.log(response.data);
        // console.log(response.data.nombre_archivo);

        setSelectedFile(null);
        setImagenes([...imagenes, response.data.nombre_archivo]);
        toast.success("Imagen subida correctamente");
      } catch (error) {
        if (error.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          console.log(
            "Error en la respuesta del servidor:",
            error.response.data
          );
        } else if (error.request) {
          // La solicitud fue realizada pero no se recibió respuesta
          console.log("No se recibió respuesta del servidor:", error.request);
        } else {
          // Ocurrió un error durante la configuración de la solicitud
          console.log("Error al configurar la solicitud:", error.message);
        }
      }
    } else {
      console.log("No se ha seleccionado ningún archivo.");
      toast.error("Debe seleccionar una imagen");
    }
  };

  /**
   * Obtiene todas las imagenes guardadas, apenas se ejecute el componente
   */
  useEffect(() => {
    const obtenerImagenes = async () => {
      try {
        const response = await axios.get(URL_API);
        setImagenes(response.data);
      } catch (error) {
        console.error("Error al obtener las imágenes:", error);
      }
    };

    obtenerImagenes();
  }, []);

  return (
    <div className="row justify-content-md-center">
      <div className="col-md-5 border-right">
        <Titulo />
        <ToastContainer />

        <div className="mb-3">
          <label className="form-label">Seleccione una imagen</label>
          <input
            type="file"
            name="avatar"
            className="form-control"
            onChange={handleSubirImagen}
          />
        </div>
        <br />

        {selectedFile ? (
          <>
            <img
              alt="Preview"
              height="100px"
              src={URL.createObjectURL(selectedFile)}
            />
            <br />
            <br />
          </>
        ) : null}

        <button className="btn btn-primary btn_add" onClick={handleUpload}>
          Subir imagen
        </button>
      </div>
      <div className="col-md-7 px-3">
        <ImagenesGuardadas data={imagenes} url_api={URL_API} />
      </div>
    </div>
  );
};

export default SubirImagen;
