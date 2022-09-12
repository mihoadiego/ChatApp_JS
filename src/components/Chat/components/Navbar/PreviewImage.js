import React, {useState} from 'react';

const PreviewImage = ({file,width,height}) => {

  const [preview, setPreview] = useState(null);

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    setPreview(reader.result);
  };

  return (
    <div style={{maxHeight: '40px', marginBottom:'5px'}}>
      <img src={preview} alt="Preview Avatar" style={{display:'block', margin: 'auto'}}/>
    </div>
  )

}

export default PreviewImage