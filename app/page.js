'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";
import { CameraIcon, BookOpenIcon, UserIcon, PaintBrushIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import Webcam from "react-webcam";

export default function StepperWithContent() {
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);
  const [step, setStep] = useState([-1, -1, -1]);	// [장르, 스타일, 성별]
  const [webcamLoaded, setWebcamLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [queuestataus, setQueueStatus] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const webcamRef = useRef(null);

  const capture = useCallback(() => setImgSrc(webcamRef.current.getScreenshot({ width: 640, height: 480 })), [webcamRef]);
  const router = useRouter();

  const url = endpoint => `${process.env.NODE_ENV == 'development' ? 'http://216.153.62.1:8080' : ''}/api/${endpoint}`;
  const handleNext = () => !isLastStep && setActiveStep(cur => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep(cur => cur - 1);
  const generateImages = async () => {
    router.push('/loading')
    const formData = new FormData();
    formData.append('files', new File([await fetch(imgSrc).then(ret => ret.blob())], "image.jpg", { type: "image/jpeg" }));
    ['genre', 'style', 'gender'].forEach((key, i) => formData.append(key, step[i]));
    const taskId = +(await fetch(url('generateImages/1'), { method: 'POST', body: formData }).then(ret => ret.json())).taskId
    console.log(`taskId: ${taskId}`);
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(url(`checkStatus/${taskId}`));
        const data = await response.json();
        if (+data.status == 0) {
          const imageUrls = data.imagePaths.map(imagePath => url(`image/${imagePath.replaceAll('/', '+')}`));
          console.log(imageUrls);
          global.imageUrls = imageUrls;
          clearInterval(intervalId);
          router.push('/complete');
        }
        if (+data.status == 1) {
          console.log('if status:1');
          setIsLoading(true);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Status check error:', error);
        clearInterval(intervalId); // 오류 발생 시 인터벌 정지
      }
    }, 1000);
  };

  return (
    <div className="w-full px-24 py-4">
      <Stepper activeStep={activeStep} isLastStep={setIsLastStep} isFirstStep={setIsFirstStep}>
        {[[CameraIcon, "사진"], [BookOpenIcon, "장르"], [PaintBrushIcon, "스타일"], [UserIcon, "성별"]].map(([Icon, str], i) =>
          <Step key={i} onClick={() => setActiveStep(i)}>
            <Icon className="h-5 w-5" />
            <div className="absolute -bottom-[4.5rem] w-max text-center">
              <Typography variant="h6" color={activeStep === i ? "blue-gray" : "gray"}>
                Step {i + 1}
              </Typography>
              <Typography color={activeStep === i ? "blue-gray" : "gray"} className="font-normal">
                {str}
              </Typography>
            </div>
          </Step>
        )}
      </Stepper>
      <div className="mt-24">
        {activeStep == 0 &&
          <div className="mx-auto w-fit [&_*]:rounded-lg"> {/*https://stackoverflow.com/a/72683383*/}
            <div className="aspect-[4/3] overflow-hidden border-dashed border-4 border-gray-400"> {/*overflow-hidden이 640, 축소비율 조건 만족*/}
              {!imgSrc && !webcamLoaded &&
                <div className='grid animate-pulse h-full bg-gray-300'>
                  <VideoCameraIcon className="h-24 w-24 m-auto text-gray-500" strokeWidth={2} />
                </div>
              }
              {imgSrc ? <img src={imgSrc} /> : <Webcam ref={webcamRef} height={480} width={640} screenshotFormat="image/jpeg" onUserMedia={() => setWebcamLoaded(true)} />}
            </div>
            <Button className="mt-4 float-right" onClick={imgSrc ? () => (setImgSrc(null), setWebcamLoaded(false)) : capture}>
              {imgSrc ? "다시 찍기" : "Capture"}
            </Button>
          </div>
        }
        {[["로맨스", "판타지", "느와르", "일상"], ["디즈니", "지브리", "손그림", "랜덤"], ["남자", "여자"]].map((li, i1) =>
          activeStep == i1 + 1 &&
          <div className="flex justify-center space-x-4">
            {li.map((str, i2) =>
              <Button key={`${i1}${i2}`} onClick={() => setStep({ ...step, [i1]: i2 })} color={step[i1] == i2 ? "blue" : "gray"}>
                {str}
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="mt-32 flex justify-between">
        <Button onClick={handlePrev} disabled={isFirstStep}>
          Prev
        </Button>
        <Button onClick={() => isLastStep ? generateImages() : handleNext()} disabled={step?.[activeStep - 1] == -1 || !imgSrc}>
          {isLastStep ? '동화 만들기' : 'Next'}
        </Button>
      </div>
    </div>
  );
}