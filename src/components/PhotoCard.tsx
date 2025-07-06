import { useState } from 'react';
import { animated, useSpring } from '@react-spring/web';

interface PhotoCardProps {
  frontImage: string;
}

const PhotoCard = ({ frontImage }: PhotoCardProps) => {
  const [zoomed, setZoomed] = useState(false);
  const [props, api] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    config: { mass: 5, tension: 350, friction: 40 },
  }));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX: x, clientY: y, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const rotateX = (y - top - height / 2) / 20;
    const rotateY = (x - left - width / 2) / 20;
    api.start({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    api.start({ rotateX: 0, rotateY: 0 });
  };

  const { scale, boxShadow } = useSpring({
    scale: zoomed ? 1.4 : 1,
    boxShadow: zoomed ? '0px 20px 40px rgba(0,0,0,0.3)' : '0px 10px 20px rgba(0,0,0,0.1)',
    config: { mass: 1, tension: 300, friction: 30 },
  });

  return (
    <animated.div
      className="photocard"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setZoomed(z => !z)}
      style={{
        transform: props.rotateY.to(y => `perspective(600px) rotateY(${y}deg) rotateX(${props.rotateX.get()}deg)`),
        scale,
        boxShadow,
        zIndex: zoomed ? 10 : 1,
      }}
    >
      <animated.div
        className="photocard-inner"
        style={{
          transform: props.rotateY.to(y => `rotateY(${y}deg) rotateX(${props.rotateX.get()}deg)`),
        }}
      >
        <animated.div className="photocard-face photocard-front">
          <img src={frontImage} alt="Front" />
        </animated.div>
      </animated.div>
    </animated.div>
  );
};

export default PhotoCard;
