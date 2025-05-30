import React from 'react';
import { Helmet } from 'react-helmet-async';

export const FaqSchema = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Mikä on Talopakettiin?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Talopakettiin on innovatiivinen palvelu, joka auttaa sinua löytämään ja kilpailuttamaan talopaketteja. Yhdistämme teknologian ja rakennusalan osaamisen tarjotaksemme parhaan palvelun talopakettien hankintaan."
        }
      },
      {
        "@type": "Question",
        "name": "Miten Talopakettiin toimii?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Talopakettiin auttaa sinua kilpailuttamaan talopaketteja eri rakennusyrityksiltä. Voit vertailla tarjouksia, nähdä esimerkkitaloja ja saada ammattitaitoista neuvontaa koko prosessin ajan."
        }
      },
      {
        "@type": "Question",
        "name": "Mitä talopaketteja voin kilpailuttaa?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Voit kilpailuttaa erilaisia talopaketteja, kuten omakotitaloja, paritaloja ja pientaloja. Tarjoamme laajan valikoiman eri kokoisia ja tyylisiä talopaketteja eri rakennusyrityksiltä."
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
}; 