import styles from './Footer.module.css'

export default function Footer() {
    return <div>
            <div className={styles.topHorizontalSeparator}></div>
            <div className={styles.feedbackBoxes}>
                <div className={styles.donateBox}>
                    <div className={styles.coffeeCups}>
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                            <input type="hidden" name="cmd" value="_donations" />
                            <input type="hidden" name="business" value="8Q32E3Q42WS3S" />
                            <input type="hidden" name="currency_code" value="USD" />    
                            <button name="submit" className={styles.donateSubmitButton} title="Buy me a Coffee pls" alt="Buy me a Coffee"> 
                                <img src="/coffee_cup.png" className={styles.smallCoffeeCup}/>
                            </button>
                        </form>
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                            <input type="hidden" name="cmd" value="_donations" />
                            <input type="hidden" name="business" value="8Q32E3Q42WS3S" />
                            <input type="hidden" name="currency_code" value="USD" />
                            <button name="submit" className={styles.donateSubmitButton} title="Buy me a Coffee pls" alt="Buy me a Coffee"> 
                                <img src="/coffee_cup.png" className={styles.medCoffeeCup}/>
                            </button>
                        </form>
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                            <input type="hidden" name="cmd" value="_donations" />
                            <input type="hidden" name="business" value="8Q32E3Q42WS3S" />
                            <input type="hidden" name="currency_code" value="USD" />
                            <button name="submit" className={styles.donateSubmitButton} title="Buy me a Coffee pls" alt="Buy me a Coffee"> 
                                <img src="/coffee_cup.png" className={styles.largeCoffeeCup}/>
                            </button>
                        </form>
                </div>
                    <p className={styles.footerMoneyPlea}> If you like this content, please consider supporting my work by clicking on a coffee cup.</p>
                </div>
                <div className={styles.emailSubscribeBox}>
                    <p className={styles.emailSubscribeHeader}>Have 'Em Delivered</p>
                    <div className={styles.emailSubscribeContent}>
                        <input className={styles.emailInput} type="text" placeholder="you@example.com" />
                        <button className={styles.emailSubscribeButton}>Subscribe</button>
                        <p className={styles.emailSubscribeText}><strong>Subscribe</strong> to receive sweet new content right in your inbox, plus info on giveaways.</p>
                    </div>
                </div>
            </div>
    </div>
}