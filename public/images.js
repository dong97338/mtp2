import Image from 'next/image'
const cardImages = {story: ['/지브리.png', '/팀플스토리.png', '/긱사네컷.png'], gender: ['/팀플스토리.png', '/지브리.png']}
export const CardImage = ({i1, i2}) => <Image src={cardImages[i1][i2]} width="480" height="480" priority />
