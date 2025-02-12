import { useState } from 'react';
import Slider from './Slider';
import TopTrends from './TopTrends';
import HomeAppliances from './HomeAppliances';
import MensFashion from './MensFashion';
import WomensFashion from './WomensFashion';

function HomePage() {

  const [exchangeRate] = useState(83.12); // Current approximate rate

  return (
    <div>
      <Slider />
      <TopTrends exchangeRate={exchangeRate} />
      <HomeAppliances exchangeRate={exchangeRate} />
      <MensFashion exchangeRate={exchangeRate} />
      <WomensFashion exchangeRate={exchangeRate} />
    </div>
  );
}

export default HomePage; 