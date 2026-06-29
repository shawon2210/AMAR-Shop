interface HeroSlide {
  image: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
}

const slides: HeroSlide[] = [
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCB2MRK87nCDmLoRM2FBNh5JgB9X-lUh2nRsIVMFk4UXD_YLyHu9rzcRVdAkHzQEPzazAHDIAzArDKksCMAXo1jXKiv9-1aN0nGQaF1aMO7Upki9y0DQYv9Tm3IPk0gusTja1Ura7xsx27kIVSIr-C1_SwZ4bLhuNR13HQoJ4tvwVvswhyMA8S1TQ03JnvrNoI_7FDra46NcvXHwuzvrOQM_LbuI-e77MLX-QeolS1ULRVRWaGJFdrMQRCRAr3AcKOgaL7JrBiMQ',
    title: 'Upgrade Your Lifestyle with 50% Off',
    badge: 'MEGA DEALS',
    badgeColor: 'bg-primary',
    subtitle: 'Premium electronics, fashion & more',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc5Yk87AmtdO32wrh2pVuatkuCgkfmgbJ9PJNvc2_9aX000noDLkF6TX7IzeBHBtrHJcF4xffViBuPUYu0e4AyQOC3EIXQL8N5UymsyUu_u1QkHwfMgxoekcgkPKGONmJWLO67ijFzY6JdFzuyq0PpeaRSJPMevssjYI-lbjVosvapMQVAizWsNwMjvvZv36H5q25TXF4gr7YpVB3nWD3Oh7f8vN73gyVP8C8yyKkK2ex8RBqnx1DFlOCh-7FwApd-BUxxaVgYXQ',
    title: 'Organic & Natural — Healthy You',
    badge: 'HEALTH HUB',
    badgeColor: 'bg-tertiary-container',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD42ic0Trx42bTodLsf2VXp4floaNnJiy4gSmMnUH7kcPymzUVsxy9_dqAod4DSOdh74GTDzP5TNrVZ7LPrc2rX5FWyWVsNqRyW9MV7OJFRV_c_32vfZBnu6oB2708Hzh3ruDjvxRQ3CnGV6Cd5407S9-1RLtES-uzi9QA0XwGuU0G2S38LXxKGOg4pRVA6JM6XnwlYLqQaH-C9ji_M_7WoeK4ldA4KnExRkwI0shXBzTsiN4r-5iYhMgzzQ6DJ6sfSnPKu07FnYg',
    title: 'Fashion Week — Traditional Meets Modern',
    badge: 'FASHION',
    badgeColor: 'bg-primary',
  },
];

export function HeroSlider() {
  return (
    <section className="px-container-margin md:mt-md overflow-hidden">
      <div className="relative w-full h-48 md:h-[400px] rounded-xl overflow-hidden shadow-lg">
        <div className="flex animate-slider w-[300%] h-full">
          {slides.map((slide, index) => (
            <div key={index} className="w-full h-full relative shrink-0">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('${slide.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-lg">
                {slide.badge && (
                  <span className={`${slide.badgeColor} text-white text-xs font-bold px-sm py-0.5 w-fit rounded-full mb-2`}>
                    {slide.badge}
                  </span>
                )}
                <h2 className="text-white font-display-lg-mobile text-display-lg-mobile md:text-display-lg max-w-xs md:max-w-md leading-tight">
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className="text-white/80 text-sm mt-1 max-w-xs">{slide.subtitle}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
