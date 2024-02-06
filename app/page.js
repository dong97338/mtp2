'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import {
  Stepper, Step, Button, Typography, Card,
  CardHeader,
  CardBody,
  CardFooter
} from "@material-tailwind/react";
import { CameraIcon, BookOpenIcon, UserIcon, PaintBrushIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import Webcam from "react-webcam";

const db = { story: ['디즈니', '지브리', '해리포터'], gender: ['남자', '여자'] }
const steps = [[CameraIcon, "사진"], [PaintBrushIcon, "스토리"], [UserIcon, "성별"]]
const backgroundImages = ['/transparent.png', '/autumn.jpg', '/dawn.jpg', '/snow.jpg', '/space.jpg']

export default function StepperWithContent() {
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);
  const [step, setStep] = useState(new Array(db.count).fill(-1));	// [스토리/장르, 성별]
  const [webcamLoaded, setWebcamLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [queuestataus, setQueueStatus] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(0); // 현재 이미지 인덱스 상태
  const [backgroundOpacity, setBackgroundOpacity] = useState(0);
  const webcamRef = useRef(null);
  const router = useRouter();
  const capture = useCallback(() => setImgSrc(webcamRef.current.getScreenshot({ width: 640, height: 480 })), [webcamRef]);

  const url = endpoint => `${process.env.NODE_ENV == 'development' ? 'http://216.153.57.204:8080' : ''}/api/${endpoint}`;
  const handleNext = () => !isLastStep && setActiveStep(cur => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep(cur => cur - 1);
  const generateImages = async () => {
    router.push('/loading')
    const formData = new FormData();
    formData.append('files', new File([await fetch(imgSrc).then(res => res.blob())], "image.jpg", { type: "image/jpeg" }));
    formData.append('db',JSON.stringify(db))
    Object.keys(db).forEach((key, i) => formData.append(key, step[i]));
    const taskId = +(await fetch(url('generateImages/1'), { method: 'POST', body: formData }).then(ret => ret.json())).taskId
    console.log(`taskId: ${taskId}`);
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(url(`checkStatus/${taskId}`));
        const data = await response.json();
        if (+data.status == 0) {
          global.imageUrls = data.imagePaths.map(imagePath => url(`image/${imagePath.replaceAll('/', '+')}`));
          clearInterval(intervalId);
          router.push('/complete2');
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
    <div className="w-full h-screen p-12" style={{ backgroundImage: `url(${backgroundImages[index]})`, backgroundSize: 'cover', transition: '0.5s ease-out' }}>
      <div className="backdrop-blur-md glass shadow-2xl">

        <div className="w-full px-24 py-4">
          <Stepper activeStep={activeStep} isLastStep={setIsLastStep} isFirstStep={setIsFirstStep}>
            {steps.map(([Icon, str], i) =>
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
            {Object.values(db).map((li, i1) =>
              // step
              activeStep == i1 + 1 &&
              <div className="flex justify-center p-4">
                {li.map((str, i2) =>
                  <Card className="mx-auto mt-6 w-96 ">
                    <CardHeader color="blue-gray" className="relative h-56">
                      <img
                        src={backgroundImages[i2 + 1]}
                        alt="card-image"
                      />
                    </CardHeader>
                    <CardBody>
                      <Typography variant="h5" color="blue-gray" className="mb-2">
                        {str}
                      </Typography>
                      <Typography>
                        The place is close to Barceloneta Beach and bus stop just 2 min by
                        walk and near to &quot;Naviglio&quot; where you can enjoy the main
                        night life in Barcelona.
                      </Typography>
                    </CardBody>
                    <CardFooter className="pt-0">
                      <Button key={`${i1}${i2}`} onClick={() => setStep({ ...step, [i1]: i2 })} onMouseEnter={() => setIndex(i2 + 1)} color={step[i1] == i2 ? "blue" : "gray"}>
                        {str}
                      </Button>
                    </CardFooter>
                  </Card>
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
      </div>
    </div>
  );
}