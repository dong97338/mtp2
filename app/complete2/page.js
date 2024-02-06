'use client';

import React from 'react';
import Image from 'next/image';
import { Carousel } from '@material-tailwind/react';

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button
} from "@material-tailwind/react";

const handleImageClick = () => {
  alert('클릭 성공');
};

const handleButtonClick = () => {
  alert('다운로드 성공!');
};
const dummy = 'https://post-phinf.pstatic.net/MjAxNzA5MDhfMjcg/MDAxNTA0ODY5MTc5NzU0.Uw_j-1YqTbbb4hdGj2HYfjJ4t9Suh9bumhTBrVahK64g._1QWU12rxfRmVlVjzRMISKUsBlkI8h06riYYD61sBQ0g.JPEG/translation-alvin-Juano-01.jpg?type=w800_q75';

const Page = () => {
  return (
    <div className="w-3/5 justify-normal bg-white rounded-2xl divide-x flex flex-row">
      <div>
        <Card className="w-96 border-e-4">
          <CardHeader shadow={false} floated={false} className="h-96">
            {(global.imageUrls || [dummy]).map((imageUrl, index) =>
              <img
                key={index}
                src={imageUrl}
                alt="card-image"
                className="h-full w-full object-cover"
              />
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
            <Typography
              variant="small"
              color="gray"
              className="font-normal opacity-75"
            >

            </Typography>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              ripple={false}
              fullWidth={true}
              onClick={handleButtonClick}
              className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
            >
              Download
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="flex flex-col place-items-center justify-center w-96">
        <img
          src="https://t3.ftcdn.net/jpg/06/30/17/02/240_F_630170220_gI9Gq4uLgEwoSX2tsXzSzmhVppmwzcmr.jpg"
          alt="card-image"
          className="w-32 h-32 mt-1"
        />
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
    </div>
  );
};

export default Page;
