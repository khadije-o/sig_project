import React from "react";
import axios from "axios";

interface Props {
  url: string;
  filename?: string;
  label?: string;
  className?: string; 
}

const DownloadPdfButton: React.FC<Props> = ({
  url,
  filename = "document.pdf",
  label = "Télécharger PDF",
  className = ""
}) => {
  const handleDownloadPDF = async () => {
    try {
      const response = await axios.get(url, {
        // Indique qu’on veut récupérer des données binaires (comme un fichier).
        responseType: "blob",
      });
      // transformer en vrai fichier utilisable PDF, image
      const blob = new Blob([response.data], { type: response.headers["content-type"] || "application/pdf" });
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erreur lors du téléchargement du PDF :", error);
    }
  };

  return (
    <button onClick={handleDownloadPDF} className={className}>
      {label}
    </button>
  );
};

export default DownloadPdfButton;
