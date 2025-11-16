import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Secure, Facebook, Send, Twitter } from 'grommet-icons';
import styles from './Footer.module.css';
import * as EmailValidator from 'email-validator';
import dynamic from 'next/dynamic';
const Cups = dynamic(() => import('./Cups/Cups'), {
    ssr: false
});

export enum SubscriptionStatus {
    NONE = '',
    LOADING = '...',
    NOT_ALLOWED = 'Are you a hacker? Nice',
    BAD_EMAIL = 'Is that email format correct?',
    SERVER_ERROR = 'Oh no, an error! Try again?',
    SUBSCRIBED = 'Subscribed!'
}

const footerTexts = [
    "Made with ❤️ by Emily",
    "No AI was involved in the writing of this content"
]

async function subscribeEmail(emailCandidate: string, pageUri: string, setSubscriptionStatus: Function) {
    setSubscriptionStatus(SubscriptionStatus.LOADING);

    if (!EmailValidator.validate(emailCandidate)) {
        setSubscriptionStatus(SubscriptionStatus.BAD_EMAIL);
        return;
    }

    const response = await fetch('/api/subscription', {
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
        }
    }, [subscriptionStatus]);

    const randomIndex = Math.floor(Math.random() * footerTexts.length);
    const footerText = footerTexts[randomIndex];

    return <div>
      <div className={styles.topHorizontalSeparator}></div>
      <div className={styles.feedbackBoxes}>
          <div className={styles.donateBox}>
              <Cups />
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
                  <p className={styles.emailSubscribeText}><strong>Subscribe</strong> to receive these things by email.</p>
              </div>
          </div>
      </div>

      <div className={styles.bottomHorizontalSeparator}></div>

    <div>
      <ul className={styles.contactList}>
        {/* <li className={styles.contactListItem}>
          <a href="https://www.facebook.com/isReadingEssential" target="_blank"><Facebook color="black" size="medium"></Facebook></a>
        </li> */}
        <li className={styles.contactListItem}>
          <a href="https://twitter.com/_danielsabbagh" target="_blank"><Twitter color="black" size="medium"></Twitter></a>
        </li>
        <li className={styles.contactListItem}>
          <a href="mailto:dsabbaghumd@gmail.com" target="_blank"><Send className={styles.socialIcon} color="black" size="medium"></Send></a>
        </li>
          <li className={styles.contactListItem}>
          <a href="/blog/19/privacy-policy" target="_blank"><Secure color="black" size="medium" className={styles.socialIcon}></Secure></a>
        </li>
      </ul>
    </div>

  <p className={styles.footerText}>~ {footerText} ~</p>

  </div>;
}