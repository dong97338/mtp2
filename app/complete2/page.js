'use client';

import React, {useEffect, useState} from 'react';
import { saveAs } from 'file-saver'
import Image from 'next/image';
import { Carousel } from '@material-tailwind/react';
import { QRCodeSVG } from 'qrcode.react'
import { useRouter } from 'next/navigation'

import { Card, CardHeader, CardBody, CardFooter, Typography, Button } from "@material-tailwind/react";

const handleImageClick = () => {
  alert('클릭 성공');
};
const dummy = 'complete_dummy.jpg';
const Page = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isMobile, setIsMobile] = useState(true);
  let { image } = useRouter().query??{image:''} //ssg 단계에서는 query가 없을 수 있음: https://chat.openai.com/share/688c3d25-4a28-4ad9-a021-ff71ecd9d336
  image = decodeURIComponent(image);

  useEffect(() => {
    setCurrentUrl(window.location.hostname.split('.').slice(-1)[0]);
  }, []);
  useEffect(() => { setIsMobile(window.innerHeight > window.innerWidth) }, []);
  useEffect(() => {
    console.log(isMobile ? "모바일 환경입니다." : "데스크탑 환경입니다.");
  }, [isMobile]);
  return (
    <div className='w-full h-screen p-12'>
      <div className="w-full justify-normal bg-white rounded-2xl divide-x flex flex-row mx-auto">
        <Card className="w-96 border-e-4">
          <CardHeader shadow={false} floated={false} className="h-96">
              <img src={image||dummy} alt="card-image" className="h-full w-full object-cover" />
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
            <a href={image||dummy} download='4cut.png'>
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
          <QRCodeSVG value={`${currentUrl}/complete2?image=${image}`} />
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
