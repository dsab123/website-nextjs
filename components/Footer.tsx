import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import styles from './Footer.module.css'
import * as EmailValidator from 'email-validator';

export enum SubscriptionStatus {
    NONE = "",
    LOADING = "...",
    NOT_ALLOWED = 'Are you a hacker? Nice',
    BAD_EMAIL = 'Is that email format correct?',
    SERVER_ERROR = 'Oh no, an error! Try again?',
    SUBSCRIBED = "Subscribed!"
}

async function subscribeEmail(emailCandidate: string, pageUri: string, setSubscriptionStatus: Function) {
    setSubscriptionStatus(SubscriptionStatus.LOADING);

    if (!EmailValidator.validate(emailCandidate)) {
        setSubscriptionStatus(SubscriptionStatus.BAD_EMAIL);
        return;
    }

    let response = await fetch('/api/email', {
        method: 'POST',
        headers: {
            'content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: emailCandidate,
            pageUri: pageUri
        })
    });

    switch(response.status) {
        case 200:
            setSubscriptionStatus(SubscriptionStatus.SUBSCRIBED);
        break;
        case 405:
            setSubscriptionStatus(SubscriptionStatus.NOT_ALLOWED);
        break;
        case 500:
            setSubscriptionStatus(SubscriptionStatus.SERVER_ERROR);
        break;
        default:
            setSubscriptionStatus(SubscriptionStatus.SERVER_ERROR);
    }
}

function getSubscriptionStatusPopupClass(status: SubscriptionStatus): string {
    switch(status) {
        case SubscriptionStatus.LOADING:
            return styles.emailSubscribeStatusLoading;

        case SubscriptionStatus.BAD_EMAIL:
            return styles.emailSubscribeStatusInvalid;

        case SubscriptionStatus.NOT_ALLOWED:
        case SubscriptionStatus.SERVER_ERROR:
            return styles.emailSubscribeStatusError;
            
        case SubscriptionStatus.SUBSCRIBED:
            return styles.emailSubscribeStatusSuccess;

        case SubscriptionStatus.NONE:
        default:
            return styles.emailSubscribeStatusNone;
    }
}

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>(SubscriptionStatus.NONE);

    const pageUri = useRouter().asPath;

    useEffect(() => {
        if (subscriptionStatus != SubscriptionStatus.LOADING) {
            const timer = setTimeout(() => {
                setSubscriptionStatus(SubscriptionStatus.NONE);
              }, 3000);
            // return () => clearTimeout(timer);
        }
    }, [subscriptionStatus]);

    return <div>
            <div className={styles.topHorizontalSeparator}></div>
            <div className={styles.feedbackBoxes}>
                <div className={styles.donateBox}>
                    <div className={styles.coffeeCups}>
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                            <input type="hidden" name="cmd" value="_donations" />
                            <input type="hidden" name="business" value="8Q32E3Q42WS3S" />
                            <input type="hidden" name="currency_code" value="USD" />    
                            <button name="submit" className={styles.donateSubmitButton} title="Buy me a Coffee pls" > 
                                <img src="/static/coffee_cup.png" className={styles.smallCoffeeCup}/>
                            </button>
                        </form>
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                            <input type="hidden" name="cmd" value="_donations" />
                            <input type="hidden" name="business" value="8Q32E3Q42WS3S" />
                            <input type="hidden" name="currency_code" value="USD" />
                            <button name="submit" className={styles.donateSubmitButton} title="Buy me a Coffee pls" > 
                                <img src="/static/coffee_cup.png" className={styles.medCoffeeCup}/>
                            </button>
                        </form>
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                            <input type="hidden" name="cmd" value="_donations" />
                            <input type="hidden" name="business" value="8Q32E3Q42WS3S" />
                            <input type="hidden" name="currency_code" value="USD" />
                            <button name="submit" className={styles.donateSubmitButton} title="Buy me a Coffee pls" > 
                                <img src="/static/coffee_cup.png" className={styles.largeCoffeeCup}/>
                            </button>
                        </form>
                </div>
                    <p className={styles.footerMoneyPlea}> If you like this content, please consider supporting my work by clicking on a coffee cup.</p>
                </div>
                <div className={styles.emailSubscribeBox}>
                    <p className={styles.emailSubscribeHeader}>Have 'Em Delivered</p>
                    <div className={styles.emailSubscribeContent}>
                        <div className={`${styles.emailSubscribeStatus} ${getSubscriptionStatusPopupClass(subscriptionStatus)}`}>
                            <p className={styles.emailSubscriptionStatusText}>
                                {subscriptionStatus}</p>
                            <div className={styles.arrowDown}></div>
                        </div>
                        <input className={styles.emailInput} type="text" placeholder="you@example.com" onChange={(e) => setEmail(e.target.value)} />
                        <button className={styles.emailSubscribeButton} onClick={() => subscribeEmail(email, pageUri, setSubscriptionStatus)}>
                            Subscribe
                        </button>
                        <p className={styles.emailSubscribeText}><strong>Subscribe</strong> to receive sweet new content right in your inbox, plus info on giveaways.</p>
                    </div>
                </div>
            </div>

            <div className={styles.bottomHorizontalSeparator}></div>
    
    <div>
        <ul className={styles.contactList}>
            <li className={styles.contactListItem}><a href="https://twitter.com/_danielsabbagh" target="_blank"><img className={styles.socialIcon} src="/static/twitter-circled.png"></img></a></li>
            <li className={styles.contactListItem}><a href="mailto:dsabbaghumd@gmail.com" target="_blank"><img className={styles.socialIcon} src="/static/email.png"></img></a></li>
            <li className={styles.contactListItem}><a href="https://facebook.com/dsab123" target="_blank"><img className={styles.socialIcon} src="/static/facebook-circled.png"></img></a></li>
        </ul>
    </div>

    <p className={styles.emailMadeWithHeart}>~ Made with <span className={styles.heart}>❤️</span> by Emily ~</p>

    </div>
}