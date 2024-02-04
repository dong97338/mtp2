'use client';

import React from 'react';
import Image from 'next/image';
import { Carousel } from '@material-tailwind/react';

const dummy = ['https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80',
	"https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80",
	"https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80"]

const Page = () => {

	// 모바일 환경인지 검사하는 함수
	const isMobile = () => window.innerHeight> window.innerWidth

	function handler() {
		if (isMobile()) {
			// 모바일 환경일 때의 처리
			console.log("모바일 환경입니다.");
		} else {
			// 데스크탑 환경일 때의 처리
			console.log( "데스크탑 환경입니다.");
		}
	};

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
