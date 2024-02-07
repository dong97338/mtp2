'use client';

import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation' 
import { saveAs } from 'file-saver'
import Image from 'next/image';
import { Carousel } from '@material-tailwind/react';
import { QRCodeSVG } from 'qrcode.react'

import { Card, CardHeader, CardBody, CardFooter, Typography, Button } from "@material-tailwind/react";

const handleImageClick = () => {
  alert('클릭 성공');
};
const dummy = 'complete_dummy.jpg';
const Page = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isMobile, setIsMobile] = useState(true);
  const {taskId}=useRouter().query; //your-page-path?taskId=${taskId}에서 taskId를 가져옴

  const url = endpoint => `${process.env.NODE_ENV == 'development' ? 'http://216.153.57.204:8080' : ''}/api/${endpoint}`;

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);
  useEffect(() => { setIsMobile(window.innerHeight > window.innerWidth) }, []);
  useEffect(() => {
    console.log(isMobile ? "모바일 환경입니다." : "데스크탑 환경입니다.");
  }, [isMobile]);
//처음 로드될 때 서버에서 이미지 다운로드
  useEffect(() => {
    fetch('http://localhost:8080/api/download')
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '4cut.png');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
  }, []);


  return (
    <div className='w-full h-screen p-12'>
      <div className="w-full justify-normal bg-white rounded-2xl divide-x flex flex-row mx-auto">
        <Card className="w-96 border-e-4">
          <CardHeader shadow={false} floated={false} className="h-96">
            {(global.imageUrls || [dummy]).map((imageUrl, index) =>
              <img key={index} src={imageUrl} alt="card-image" className="h-full w-full object-cover" />
            )}
          </CardHeader>
          <CardBody>
            <div className="mb-2 flex items-center justify-between">
              <Typography color="blue-gray" className="font-medium">
                드래곤 타는 이야기
              </Typography>
              <Typography color="blue-gray" className="font-medium">
                KAIROS
              </Typography>
            </div>

          </CardBody>
          <CardFooter className="pt-0">
            <a href={dummy} download='4cut.png'>
              <Button
                ripple={false}
                fullWidth={true}
                className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
              >
                Download
              </Button>
            </a>
          </CardFooter>
        </Card>
        {!isMobile&&
        <div className="flex flex-col place-items-center justify-center w-96">
          <QRCodeSVG value={currentUrl} />
          <p className='text-black text-base mb-10'>QR</p>
          <div>
            <img
              src="https://t4.ftcdn.net/jpg/06/86/38/05/240_F_686380547_Uo1eGf1lznayp1hguQMumt66Rb5oZLhk.jpg"
              alt="card-image"
              onClick={handleImageClick}
              className="w-32 h-32 mt-1"
              style={{ cursor: 'pointer' }}
            />
          </div>
          <p className='text-black text-base'>메인 화면</p>
        </div>
        }
      </div>
    </div>
  );
};

export default Page;
