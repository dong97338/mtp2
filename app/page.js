'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { CardHeader, CardBody, CardFooter, Stepper, Step, Button, Typography, Card } from "@material-tailwind/react";
import { CameraIcon, UserIcon, PaintBrushIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { useSpring, animated, config } from 'react-spring'; //npm install react-spring@8.0.27: https://stackoverflow.com/a/66802388
import Webcam from "react-webcam";

const db = { story: ['디즈니', '지브리', '해리포터'], gender: ['남자', '여자'] }
const steps = [[CameraIcon, "사진"], [PaintBrushIcon, "스토리"], [UserIcon, "성별"]]
const backgroundImages = ['/transparent.png', '/autumn.jpg', '/dawn.jpg', '/snow.jpg', '/space.jpg']
const cardImages = ['/transparent.png', '/autumn.jpg', '/dawn.jpg', '/snow.jpg', '/space.jpg']

const InteractiveCard = ({ children, className }) => {
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const container = containerRef.current;
  const overlay = overlayRef.current;

  const [{ xys }, api] = useSpring(() => ({}));
  const cfg = { mass: 1, tension: 350, friction: 10 }

  useEffect(() => { api({ xys: [0, 0, 1] }) });

  const handleMouseMove = e => {
    const { left, top, width, height } = container.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    overlay.style.backgroundPosition = `${100 - x * 100}% ${100 - y * 100}%`;
    overlay.style.filter = `brightness(1.2)`;
    api({ xys: [10 * y - 5, -(10 * x - 5), 1.05], config: cfg });
  };

  const handleMouseOut = () => {
    overlay.style.filter = 'opacity(0)';
    api({ xys: [0, 0, 1], config: { mass: 10, tension: 350, friction: 30 } });
  };

  return (
    <animated.div ref={containerRef} className={`container ${className} relative`} onMouseMove={handleMouseMove} onMouseOut={handleMouseOut} style={{
      transform: xys?.interpolate((x, y, s) => `perspective(350px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`), //TypeError: Cannot read properties of undefined (reading 'interpolate')
    }}>
      <div ref={overlayRef} className="overlay absolute w-full h-full duration-100" style={{
        background: 'radial-gradient(circle, rgba(255,255,255,0.5), rgba(255,255,255,0), rgba(0,0,0,0.2))',
        filter: 'brightness(1.1) opacity(0.8)',
        mixBlendMode: 'color-dodge',
        backgroundSize: '150% 150%',
        backgroundPosition: '100%',
        borderRadius: '20px'
      }} />
      {children}
    </animated.div>
  );
};

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

  const url = endpoint => `/api/${endpoint}`;
  const handleNext = () => !isLastStep && setActiveStep(cur => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep(cur => cur - 1);
  const generateImages = async () => {
    router.push('/loading')
    const formData = new FormData();
    formData.append('files', new File([await fetch(imgSrc).then(res => res.blob())], "image.jpg", { type: "image/jpeg" }));
    formData.append('db', JSON.stringify(db))
    Object.keys(db).forEach((key, i) => formData.append(key, step[i]));
    const taskId = +(await fetch(url('generateImages/1'), { method: 'POST', body: formData }).then(ret => ret.json())).taskId
    global.taskId = taskId;
    console.log(`taskId: ${taskId}`);
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(url(`checkStatus/${taskId}`));
        const data = await response.json();
        if (+data.status == 0) {
          global.imageUrl = url(`image/${data.imagePath.replaceAll('/', '+')}`);
          clearInterval(intervalId);
          router.push(`/${encodeURIComponent(global.imageUrl)}`);
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
                <Icon className="size-5" />
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
                      <VideoCameraIcon className="size-24 m-auto text-gray-500" strokeWidth={2} />
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
              activeStep == i1 + 1 &&
              <div className="flex justify-center p-4">
                {li.map((str, i2) =>
                  <InteractiveCard className="mx-auto mt-6 w-96">
                    <Card className="backdrop-blur-md glass shadow-2xl">
                      <CardHeader color="blue-gray" className="relative h-56">
                        <img src={cardImages[i2 + 1]} alt="card-image" />
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
                  </InteractiveCard>
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