import altArts from './alternate-arts.json';
import promos from './promos.json';
import Card from './Card';

interface CardProxyProps {
  id: string;
  name: string;
  number: string;
  set: string;
  types: string[];
  subtypes?: string[];
  supertype?: string;
  rarity?: string;
  isReverse?: boolean;
  img?: string;
  back?: string;
  foil?: string;
  mask?: string;
}

const isDefined = (v?: string): boolean => typeof v !== 'undefined' && v !== null;

const CardProxy = (props: CardProxyProps) => {
  const { id, name, number, set, types, subtypes, supertype, isReverse = false, img, back, foil, mask } = props;
  let { rarity } = props;

  const server = import.meta.env.VITE_CDN;

  const isShiny = isDefined(number) && number!.toLowerCase().startsWith('sv');
  const isGallery = isDefined(number) && /^[tg]g/i.test(number!);
  const isAlternate = isDefined(id) && altArts.includes(id!) && !isShiny && !isGallery;
  const isPromo = isDefined(set) && set === 'swshp';

  if (isReverse && rarity) {
    rarity = `${rarity} Reverse Holo`;
  }

  if (isGallery && rarity) {
    if (rarity.startsWith('Trainer Gallery')) {
      rarity = rarity.replace(/Trainer Gallery\s*/, '');
    }
    if (rarity.includes('Rare Holo V') && subtypes?.includes('VMAX')) {
      rarity = 'Rare Holo VMAX';
    }
    if (rarity.includes('Rare Holo V') && subtypes?.includes('VSTAR')) {
      rarity = 'Rare Holo VSTAR';
    }
  }

  if (isPromo) {
    if (id === 'swshp-SWSH076' || id === 'swshp-SWSH077') {
      rarity = 'Rare Secret';
    } else if (subtypes?.includes('V')) {
      rarity = 'Rare Holo V';
    } else if (subtypes?.includes('V-UNION')) {
      rarity = 'Rare Holo VUNION';
    } else if (subtypes?.includes('VMAX')) {
      rarity = 'Rare Holo VMAX';
    } else if (subtypes?.includes('VSTAR')) {
      rarity = 'Rare Holo VSTAR';
    } else if (subtypes?.includes('Radiant')) {
      rarity = 'Radiant Rare';
    }
  }

  const cardImage = (): string => {
    if (isDefined(img)) return img!;
    if (isDefined(set) && isDefined(number)) {
      return `https://images.pokemontcg.io/${set!.toLowerCase()}/${number}_hires.png`;
    }
    return '';
  };

  const foilMaskImage = (prop?: string, type: 'foils' | 'masks' = 'masks'): string => {
    let etch = 'holo';
    let style = 'reverse';
    const ext = 'webp';

    if (prop === 'false') return '';
    if (prop) return prop;

    if (!rarity || !subtypes || !supertype || !set || !number) return '';

    const fRarity = rarity.toLowerCase();
    const fNumber = number.toLowerCase().replace('swsh', '').padStart(3, '0');
    const fSet = set.toLowerCase().replace(/(tg|gg|sv)/, '');

    if (fRarity === 'rare holo') style = 'swholo';
    if (fRarity === 'rare holo cosmos') style = 'cosmos';
    if (fRarity === 'radiant rare') {
      etch = 'etched';
      style = 'radiantholo';
    }
    if (['rare holo v', 'rare holo vunion', 'basic v'].includes(fRarity)) {
      style = 'sunpillar';
    }
    if (['rare holo vmax', 'rare ultra', 'rare holo vstar'].includes(fRarity)) {
      etch = 'etched';
      style = 'sunpillar';
    }
    if (['amazing rare', 'rare rainbow', 'rare secret'].includes(fRarity)) {
      etch = 'etched';
      style = 'swsecret';
    }

    if (isShiny) {
      etch = 'etched';
      style = 'sunpillar';
      if (fRarity === 'rare shiny v' || (fRarity === 'rare holo v' && fNumber.startsWith('sv'))) {
        rarity = 'Rare Shiny V';
      }
      if (fRarity === 'rare shiny vmax' || (fRarity === 'rare holo vmax' && fNumber.startsWith('sv'))) {
        style = 'swsecret';
        rarity = 'Rare Shiny VMAX';
      }
    }

    if (isGallery) {
      etch = 'holo';
      style = 'rainbow';
      if (fRarity.includes('rare holo v') || fRarity.includes('rare ultra')) {
        etch = 'etched';
        style = 'sunpillar';
      }
      if (fRarity.includes('rare secret')) {
        etch = 'etched';
        style = 'swsecret';
      }
    }

    if (isAlternate) {
      etch = 'etched';
      if (subtypes?.includes('VMAX')) {
        style = 'swsecret';
        rarity = 'Rare Rainbow Alt';
      } else {
        style = 'sunpillar';
      }
    }

    if (isPromo) {
      const promoStyle = promos[id as keyof typeof promos];
      if (promoStyle) {
        style = promoStyle.style.toLowerCase();
        etch = promoStyle.etch.toLowerCase();
        if (style === 'swholo') rarity = 'Rare Holo';
        else if (style === 'cosmos') rarity = 'Rare Holo Cosmos';
      }
    }

    return `${server}/foils/${fSet}/${type}/upscaled/${fNumber}_foil_${etch}_${style}_2x.${ext}`;
  };

  const proxy = {
    id,
    name,
    number,
    set,
    types,
    subtypes,
    supertype,
    rarity,
    img: cardImage(),
    back,
    foil: foilMaskImage(foil, 'foils'),
    mask: foilMaskImage(mask, 'masks'),
  };

  return <Card {...proxy} />;
};

export default CardProxy;
