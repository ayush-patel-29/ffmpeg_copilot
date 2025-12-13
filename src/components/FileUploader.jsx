import React from 'react';

export const FileUploader = () => {
  const [file, setFile] = React.useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile?.name || null);
  };

  return (
    <div className="file-uploader">
      <h2>Upload Video</h2>
      <input 
        type="file" 
        onChange={handleFileSelect}
        accept="video/*"
      />
      {file && <p>Selected: {file}</p>}
    </div>
  );
};
