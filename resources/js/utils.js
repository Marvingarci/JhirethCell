export function filesize(size) {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    ' ' +
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  );
}

export const showOnlyCapitalLetter = (name) => {
  let initials = name.match(/\b\w/g) || [];
  initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  return initials;
}


export const compareFaces = async (image1, s3ImageKey) => {
  const rekognition = new AWS.Rekognition();

  const params = {
    SourceImage: {
      Bytes: image1, 
    },
    TargetImage: {
      S3Object: {
        Bucket: 'jhiretcell',
        Name: 'profiles/'+s3ImageKey+'.jpg',
      },
    },
    SimilarityThreshold: 80,
  };

  console.log("Params being sent to compareFaces:", params);


  try {
    const result = await rekognition.compareFaces(params).promise();
    return result;
  } catch (error) {
    console.error(error);
    if(error.toString().includes('Unable to get object metadata from S3')){
      alert('Este usuario no tiene registrado el FaceID. Contactar a Administrador de sistema')
    }else{
      alert("Revisar permisos de camara en navegador")
    }
    return false
  }
};

export const captureGeolocation = () => {

  let result = { latitude: null, longitude: null, message: null };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        result = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        result.message = 'Geolocation captured successfully.';
      },
      (error) => {
        result.message = 'Error capturing geolocation: ' + error.message;
      }
    );
  } else {
    result.message = 'Geolocation is not supported by this browser.';
  }

  return result
};
