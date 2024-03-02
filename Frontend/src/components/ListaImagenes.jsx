function ListaImagenes({ data, url_api }) {
  return (
    <>
      <h2>
        Lista de Imágenes <hr />
      </h2>
      <div className="d-flex flex-wrap">
        {data.map((imagen, index) => (
          <div key={index} className="mr-2 mb-2">
            <img
              className="rounded"
              src={`${url_api}/imgs/${imagen}`}
              alt="Imagen"
              style={{
                width: "150px",
                marginRight: "30px",
                background: "#f4f4f4",
                marginBottom: "30px",
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default ListaImagenes;
