import { useState } from 'react'
import useShowToast from './useShowToast';

const UsePreviewimg = () => {
      const [imageUrl,setImageUrl]=useState(null);
      const showToast = useShowToast();

      const handleImageChange = (e) =>{
         const file = e.target.files[0];
         if(file && file.type.startsWith("image/")){
            const reader = new FileReader();
            reader.onloadend=()=>{
                  setImageUrl(reader.result);
            }

            reader.readAsDataURL(file);
         }else {
            showToast("invalid file type","please select an image file","error");
            setImageUrl(null)
         }
         
      };
      // console.log(imageUrl)
  return { handleImageChange, imageUrl }
}

export default UsePreviewimg