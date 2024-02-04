'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Carousel } from '@material-tailwind/react';

const dummy = ['https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80',
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80",
  "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80"]

const Page = () => {

  // 모바일 환경인지 검사하는 함수
  const [isMobile, setIsMobile] = useState(false);

  // 모바일 환경인지 검사하는 함수를 useEffect 내에서 실행
  useEffect(() => {
    const checkIfMobile = () => window.innerHeight > window.innerWidth;
    setIsMobile(checkIfMobile());

    // 화면 크기가 변경될 때마다 모바일 여부를 다시 검사
    window.addEventListener('resize', () => setIsMobile(checkIfMobile()));

    // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
    return () => window.removeEventListener('resize', () => setIsMobile(checkIfMobile()));
  }, []);

  useEffect(() => {
    // 모바일 환경 또는 데스크탑 환경에 따른 처리
    console.log(isMobile ? "모바일 환경입니다." : "데스크탑 환경입니다.");
  }, [isMobile]);

  handler();
  return (
    <Carousel className="h-1/2 w-1/2 rounded-xl">
      {(global.imageUrls || dummy).map((imageUrl, index) => (
        <img key={index} src={imageUrl} className="h-full w-full object-cover" />
      ))}
    </Carousel>

  );
};

export default Page;
