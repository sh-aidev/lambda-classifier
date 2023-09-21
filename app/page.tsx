"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Image from 'next/image'

const ENDPOINT =
  "https://j8mb5y9gqc.execute-api.ap-south-1.amazonaws.com/default/infer";

export default function Home() {

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [results, setResults] = useState("");

  const onImageSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files?.length) {
      const file = e.target.files[0];
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
    }else{
      console.log("select a file first")
    }
  }

  const onSubmit = () => {
    if (!selectedImage) return;
    let formdata = new FormData();
    formdata.append("image", selectedImage, selectedImage?.name);

    // setLoading(true);

    fetch(ENDPOINT, {
      method: "POST",
      body: formdata,
      redirect: "follow",
    })
      .then((response) => response.text())
      .then((result) => {
        setResults(result);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
    <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" onChange={onImageSelected} 
      accept="image/png,image/jpg,image/jpeg"
    />
    <button disabled={!selectedImage} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={onSubmit}>Submit</button>
    {imagePreview && <img src={imagePreview}></img>}
    {results && <>{results}</>}

    </main>
  )
}
