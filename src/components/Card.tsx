import { type CSSProperties, type MouseEvent, type TouchEvent, useEffect, useRef, useState } from 'react';
import { config, useSpring } from '@react-spring/web';
import { useActiveCard } from '../stores/activeCard/useActiveCard';
import { useOrientation } from '../stores/orientation/useOrientation';
import { adjust, clamp, round } from '../helpers/math.ts';

interface CardProps {
  id: string;
  name: string;
  number: string;
  set: string;
  types: string | string[];
  subtypes?: string | string[];
  supertype?: string;
  rarity?: string;
  img: string;
  back?: string;
  foil?: string;
  mask?: string;
}

const defaultBack = 'https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg';

const Card = ({
  id,
  name,
  number,
  set,
  types,
  subtypes = 'basic',
  supertype = 'pokémon',
  rarity = 'common',
  img,
  back = defaultBack,
  foil,
  mask,
}: CardProps) => {
  const randomSeed = useRef({ x: Math.random(), y: Math.random() });
  const cosmosPosition = {
    x: Math.floor(randomSeed.current.x * 734),
    y: Math.floor(randomSeed.current.y * 1280),
  };

  const { activeCard, setActiveCard } = useActiveCard();
  const orientation = useOrientation();

  const thisCard = useRef<HTMLDivElement>(null);
  const [interacting, setInteracting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [firstPop, setFirstPop] = useState(true);
  const [isVisible, setIsVisible] = useState(document.visibilityState === 'visible');

  const isActive = activeCard === id;

  const [springs, api] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    glareO: 0,
    backgroundX: 50,
    backgroundY: 50,
    translateX: 0,
    translateY: 0,
    scale: 1,
    config: config.slow,
  }));

  const updateSprings = (bg: any, rotate: any, glare: any) => {
    api.start({
      backgroundX: bg.x,
      backgroundY: bg.y,
      rotateX: rotate.x,
      rotateY: rotate.y,
      glareX: glare.x,
      glareY: glare.y,
      glareO: glare.o,
    });
  };

  const interact = (e: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>) => {
    if (!isVisible) return;

    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const absolute = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };

    const percent = {
      x: clamp(round((100 / rect.width) * absolute.x)),
      y: clamp(round((100 / rect.height) * absolute.y)),
    };

    const center = {
      x: percent.x - 50,
      y: percent.y - 50,
    };

    updateSprings(
      {
        x: adjust(percent.x, 0, 100, 37, 63),
        y: adjust(percent.y, 0, 100, 33, 67),
      },
      {
        x: round(-center.x / 3.5),
        y: round(center.y / 2),
      },
      {
        x: round(percent.x),
        y: round(percent.y),
        o: 1,
      }
    );
    setInteracting(true);
  };

  const interactEnd = () => {
    api.start({
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      glareY: 50,
      glareO: 0,
      backgroundX: 50,
      backgroundY: 50,
    });
    setInteracting(false);
  };

  const activate = () => {
    if (activeCard === id) {
      setActiveCard(undefined);
    } else {
      setActiveCard(id);
    }
  };

  useEffect(() => {
    const onVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
      interactEnd();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  const rarityClass = rarity.toLowerCase();
  const supertypeClass = supertype.toLowerCase();
  const numberClass = number.toLowerCase();
  const trainerGallery = number.match(/^[tg]g/i) || id === 'swshp-SWSH076' || id === 'swshp-SWSH077';

  const typeClass = Array.isArray(types) ? types.join(' ').toLowerCase() : types.toLowerCase();

  const subtypeClass = Array.isArray(subtypes) ? subtypes.join(' ').toLowerCase() : subtypes.toLowerCase();

  const frontImg = img.startsWith('http') ? img : `https://images.pokemontcg.io/${img}`;

  const styleVars = {
    '--pointer-x': `${springs.glareX.get()}%`,
    '--pointer-y': `${springs.glareY.get()}%`,
    '--rotate-x': `${springs.rotateX.get()}deg`,
    '--rotate-y': `${springs.rotateY.get()}deg`,
    '--background-x': `${springs.backgroundX.get()}%`,
    '--background-y': `${springs.backgroundY.get()}%`,
    '--card-scale': springs.scale.get(),
    '--translate-x': `${springs.translateX.get()}px`,
    '--translate-y': `${springs.translateY.get()}px`,
    '--card-opacity': `${springs.glareO.get()}`,
    ...(foil && { '--foil': `url(${foil})` }),
    ...(mask && { '--mask': `url(${mask})` }),
  } as CSSProperties;

  return (
    <div
      ref={thisCard}
      className={`card ${typeClass} ${interacting ? 'interacting' : ''} ${
        isActive ? 'active' : ''
      } ${loading ? 'loading' : ''} ${mask ? 'masked' : ''}`}
      data-number={numberClass}
      data-set={set}
      data-subtypes={subtypeClass}
      data-supertype={supertypeClass}
      data-rarity={rarityClass}
      data-trainer-gallery={trainerGallery}
      style={styleVars}
    >
      <div className="card__translater">
        <button
          className="card__rotator"
          onClick={activate}
          onPointerMove={interact}
          onMouseOut={interactEnd}
          onBlur={interactEnd}
          aria-label={`Expand the Pokemon Card; ${name}`}
        >
          <img className="card__back" src={back} alt="Pokemon card back" loading="lazy" width={660} height={921} />
          <div className="card__front">
            <img
              src={frontImg}
              alt={`Front design of the ${name} card`}
              onLoad={() => setLoading(false)}
              loading="lazy"
              width={660}
              height={921}
            />
            <div className="card__shine" />
            <div className="card__glare" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Card;
