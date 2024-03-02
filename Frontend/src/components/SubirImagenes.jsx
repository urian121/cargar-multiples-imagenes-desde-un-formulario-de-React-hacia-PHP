import React, { useState, useEffect } from "react";
import axios from "axios";
import ImagenesGuardadas from "./ListaImagenes";
import Titulo from "./Titulo";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubirImagen = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const URL_API =
    "http://localhost/subir-multiples-imagenes-desde-react-a-php/Backend-php/";

  const handleSubirImagen = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("avatars[]", selectedFiles[i]);
      }

      try {
        const response = await axios.post(URL_API, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setSelectedFiles([]);
        //console.log(response.data.nombres_archivos);
        setImagenes([...imagenes, ...response.data.nombres_archivos]);
        toast.success("Imágenes subidas correctamente");
      } catch (error) {
        console.error("Error al subir las imágenes:", error);
        toast.error("Error al subir las imágenes");
      }
    } else {
      toast.error("Debe seleccionar al menos una imagen");
    }
  };

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
          <label className="form-label">Seleccione imágenes</label>
          <input
            type="file"
            name="avatars"
            className="form-control"
            accept="image/png, image/jpeg"
            multiple
            onChange={handleSubirImagen}
          />
        </div>
        <br />

        {selectedFiles.length > 0 && (
          <div className="preview_flex_imgs mb-5">
            <h5>Previsualización de imágenes:</h5>
            {Array.from(selectedFiles).map((file, index) => (
              <div key={index}>
                <img
                  alt={`Preview ${index}`}
                  height="100px"
                  src={URL.createObjectURL(file)}
                />
                <br />
              </div>
            ))}
            <br />
          </div>
        )}

        <button className="btn btn-primary btn_add" onClick={handleUpload}>
          Subir imágenes
        </button>
      </div>
      <div className="col-md-7 px-3">
        <ImagenesGuardadas data={imagenes} url_api={URL_API} />
      </div>
    </div>
  );
};

export default SubirImagen;
