import styles from './Cups.module.css';
import EspressoCup from './EspressoCup';
// import CampMug from './CampMug';
import PaperCup from './PaperCup';
import TeabagMug from './TeabagMug';
import LargeCoffeeCup from './LargeCoffeeCup';
import Teapot from './Teapot';
import type { JSX } from 'react';


type Cup = {
  id: number,
  type: () => JSX.Element
}

export default function Cups() {
  const allCups: Cup[] = [
    { id: 0, type: EspressoCup },
  //  { id: 1, type: CampMug }, 
    { id: 2, type: PaperCup }, 
    { id: 3, type: TeabagMug }, 
    { id: 4, type: LargeCoffeeCup },
    { id: 5, type: Teapot }
  ];

  const shuffledCups = allCups.sort(() => 0.5 - Math.random());
  const numberOfCupsToShow = 1 + Math.floor(Math.random() * 3);;
  const cups = shuffledCups.slice(0, numberOfCupsToShow);

  return <>
    <div className={styles.coffeeCups}>
      {cups.map((Cup: Cup) => (
        <div className={styles.coffeeCup} key={Cup.id}>
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
            <input type="hidden" name="cmd" value="_donations" />
            <input type="hidden" name="business" value="8Q32E3Q42WS3S" />
            <input type="hidden" name="currency_code" value="USD" />
            <button name="submit" className={styles.donateSubmitButton} title="Buy me a Coffee pls">
              <Cup.type />
            </button>
          </form>
        </div>
      ))}
    </div>
  </>;
}