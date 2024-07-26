const uploadFile = (req, res) => {
  console.log("aaaaaaaaaa");
  try {
    if (req.file) {
      res
        .status(200)
        .json({ message: "Archivo subido con éxito", file: req.file });
    } else {
      res.status(400).json({ message: "Error al subir el archivo" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  uploadFile,
};
