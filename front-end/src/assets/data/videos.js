const thumbnails = import.meta.glob("/src/assets/thumbnail*/**/*.{png,jpg}", {
  eager: true,
});

export const videos = [
  // Wedding
  {
    title: "Dede & Caca",
    thumbnail:
      thumbnails["/src/assets/thumbnailWedding/1.dedeCaca.png"].default,
    category: "Wedding",
    videoUrl: "https://youtube.com/embed/cR_F-brz09I?si=M8c6iNUEviekBELv",
  },
  {
    title: "Tasya & Amin",
    thumbnail:
      thumbnails["/src/assets/thumbnailWedding/2.tasyaAmin.png"].default,
    category: "Wedding",
    videoUrl: "https://youtube.com/embed/cW3G1YvVhKo?si=PGAi972cWErz6tNW",
  },
  {
    title: "Indah & Danny",
    thumbnail:
      thumbnails["/src/assets/thumbnailWedding/3.indahDanny.png"].default,
    category: "Wedding",
    videoUrl: "https://youtube.com/embed/Y2j2R59rNc8?si=sMogp0aDJBVIaV2h",
  },
  {
    title: "Hilda & Indra",
    thumbnail:
      thumbnails["/src/assets/thumbnailWedding/4.hildaIndra.png"].default,
    category: "Wedding",
    videoUrl: "https://youtube.com/embed/Jrb0DQYFvh0?si=TXXpbR135yC-Ew7C",
  },
  {
    title: "Selvie & Dahlan",
    thumbnail:
      thumbnails["/src/assets/thumbnailWedding/5.selvieDahlan.png"].default,
    category: "Wedding",
    videoUrl: "https://youtube.com/embed/TrrvJQyWQ8Q?si=j2fHVktnrxwdXvq2",
  },
  {
    title: "Dela & Ilham",
    thumbnail:
      thumbnails["/src/assets/thumbnailWedding/6.delaIlham.png"].default,
    category: "Wedding",
    videoUrl: "https://youtube.com/embed/JHJ0C25BTcs?si=e1YwsFUHI2B-qGEA",
  },
  {
    title: "Fachmy & Widya",
    thumbnail:
      thumbnails["/src/assets/thumbnailWedding/7.fachmyWidya.png"].default,
    category: "Wedding",
    videoUrl: "https://youtube.com/embed/d5nc_N3RFmQ?si=2ISd416Oi2w9Kjlw",
  },
  {
    title: "Icha & Haris",
    thumbnail:
      thumbnails["/src/assets/thumbnailWedding/8.ichaHaris.png"].default,
    category: "Wedding",
    videoUrl: "https://youtube.com/embed/4FSMtcSgl2M?si=rvxnlqEefH13g-QU",
  },
  {
    title: "Adit & Eliza",
    thumbnail:
      thumbnails["/src/assets/thumbnailWedding/9.aditEliza.png"].default,
    category: "Wedding",
    videoUrl: "https://youtube.com/embed/0aHDCRZd6p8?si=K72FTyEP2DeAAF4q",
  },
  {
    title: "Citra & Roby",
    thumbnail:
      thumbnails["/src/assets/thumbnailWedding/10.citraRoby.png"].default,
    category: "Wedding",
    videoUrl: "https://youtube.com/embed/9clzKIIv8C4?si=oc0QDUOM7f9ZNntK",
  },
  {
    title: "Fitri & Hazami",
    thumbnail:
      thumbnails["/src/assets/thumbnailWedding/11.fitriHazami.png"].default,
    category: "Wedding",
    videoUrl: "https://youtube.com/embed/JDxmYKRLCb0?si=d3tTWWzuESaFGB33",
  },
  {
    title: "Hablina & Annand",
    thumbnail:
      thumbnails["/src/assets/thumbnailWedding/12.hablinaAnnand.png"].default,
    category: "Wedding",
    videoUrl: "https://youtube.com/embed/cBOktlmkHfE?si=bMcop5V29FXNQJ6b",
  },
  //   Prewedding
  {
    title: "Handy & Vidia",
    thumbnail:
      thumbnails["/src/assets/thumbnailPrewedding/1.handyVidia.png"].default,
    category: "Prewedding",
    videoUrl: "https://youtube.com/embed/TkADNZS0WPw?si=zlCVyYnmhhYHsmVH",
  },
  {
    title: "Lia & Hilman",
    thumbnail:
      thumbnails["/src/assets/thumbnailPrewedding/2.liaHilman.png"].default,
    category: "Prewedding",
    videoUrl: "https://youtube.com/embed/3112_LWFt3U?si=1pgpoefvY776ODMB",
  },
  //   Product Adversting
  {
    title: "Iklan Penjualan Rumah | 1",
    thumbnail:
      thumbnails["/src/assets/thumbnailProductAdvertisement/1.png"].default,
    category: "Product Advertisement",
    videoUrl: "https://youtu.com/embed/EyfJXzMpeeE?si=QhLxXrhtfEfEPzuI",
  },
  {
    title: "Iklan Penjualan Rumah | 2",
    thumbnail:
      thumbnails["/src/assets/thumbnailProductAdvertisement/2.png"].default,
    category: "Product Advertisement",
    videoUrl: "https://youtube.com/embed/2glEiz8H9lk?si=WsEcn3pPbfL-sghC",
  },
  {
    title: "Iklan Penjualan Rumah | 3",
    thumbnail:
      thumbnails["/src/assets/thumbnailProductAdvertisement/3.png"].default,
    category: "Product Advertisement",
    videoUrl: "https://youtube.com/embed/UdyBbU43tpo?si=4SkUbr_r6-Z0qQ83",
  },
  {
    title: "Iklan Penjualan Kopi | 1",
    thumbnail:
      thumbnails["/src/assets/thumbnailProductAdvertisement/4.jpg"].default,
    category: "Product Advertisement",
    videoUrl: "https://youtube.com/embed/5mswaGgylak",
  },
  {
    title: "Iklan Penjualan Kopi | 2",
    thumbnail:
      thumbnails["/src/assets/thumbnailProductAdvertisement/5.jpg"].default,
    category: "Product Advertisement",
    videoUrl: "https://youtube.com/embed/RlIGZMERe8g",
  },
];
