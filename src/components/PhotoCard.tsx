import { useState } from 'react';
import { animated, useSpring } from '@react-spring/web';

interface PhotoCardProps {
  frontImage: string;
  backImage: string;
}

const PhotoCard = ({ frontImage, backImage }: PhotoCardProps) => {
  const [flipped, setFlipped] = useState(false);
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

  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  return (
    <animated.div
      className="photocard"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setFlipped(state => !state)}
      style={{
        transform: props.rotateY.to(y => `perspective(600px) rotateY(${y}deg) rotateX(${props.rotateX.get()}deg)`),
      }}
    >
      <animated.div
        className="photocard-inner"
        style={{
          transform: props.rotateY.to(y => `rotateY(${y}deg) rotateX(${props.rotateX.get()}deg)`),
        }}
      >
        <animated.div className="photocard-face photocard-front" style={{ opacity: opacity.to(o => 1 - o), transform }}>
          <img src={frontImage} alt="Front" />
        </animated.div>
        <animated.div
          className="photocard-face photocard-back"
          style={{ opacity, transform: transform.to(t => `${t} rotateY(180deg)`) }}
        >
          <img src={backImage} alt="Back" />
        </animated.div>
      </animated.div>
    </animated.div>
  );
};

export default PhotoCard;
