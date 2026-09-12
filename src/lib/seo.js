// src/lib/seo.js

const SITE_URL = "https://safelpg.com";

const SITE_NAME = "Safe LPG";

export const defaultMetadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      "LPG Safety & Awareness | Safety Guidelines, Training & Market Updates",
    template: `%s | ${SITE_NAME}`,
  },

  description:
    "A dedicated LPG safety and awareness platform providing safety guidelines, LPG industry updates, training courses, online quizzes, digital certificates, regulatory information, and market news in Bangladesh.",

  keywords: [
    "LPG Safety",
    "LPG Safety Bangladesh",
    "LPG Safety Awareness",
    "LPG Safety Guidelines",
    "LPG Safety Training",
    "LPG Training Bangladesh",
    "LPG Online Training",
    "LPG Safety Course",
    "LPG Quiz",
    "LPG Digital Certificate",
    "LPG Market Update",
    "LPG Industry Bangladesh",
    "LPG News Bangladesh",
    "LPG Incident Report",
    "LPG Consumer Safety",
    "LPG Dealer Safety",
    "LPG Distributor Safety",
    "LPG Industrial Safety",
    "Gas Cylinder Safety",
    "LPG Cylinder Safety",
    "BERC LPG",
    "LOAB",
  ],

  authors: [
    {
      name: SITE_NAME,
    },
  ],

  creator: SITE_NAME,
  publisher: SITE_NAME,

  openGraph: {
    type: "website",
    locale: "en_BD",
    siteName: SITE_NAME,

    title:
      "LPG Safety & Awareness | Safety Guidelines, Training & Market Updates",

    description:
      "Promoting LPG safety awareness through safety guidelines, industry updates, online training, quizzes, digital certificates, and regulatory information.",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "LPG Safety & Awareness | Safety Guidelines, Training & Market Updates",

    description:
      "LPG safety guidelines, training courses, quizzes, digital certificates, industry updates, and market news.",

    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: SITE_URL,
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export function createMetadata({
  title,
  description,
  path = "/",
  image = "/og-image.jpg",
  keywords = [],
}) {
  const url = `${SITE_URL}${path}`;

  return {
    ...defaultMetadata,

    title,

    description,

    keywords: [...defaultMetadata.keywords, ...keywords],

    alternates: {
      canonical: url,
    },

    openGraph: {
      ...defaultMetadata.openGraph,

      title,
      description,
      url,

      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      ...defaultMetadata.twitter,

      title,
      description,

      images: [image],
    },
  };
}
