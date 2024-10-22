<template>
    <div class="landing-page">
      <header class="header">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/b2d85c2509fee5175147a7ccf211aee0578eaeeb9e8874f9f2141229aaa5c879?placeholderIfAbsent=true&apiKey=980d9bd07aac4b738b05d42cf7d3e438" class="background-image" alt="" />
        <div class="contact-info">
          <div class="contact-details">
            <div class="email-container">
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/bc92248466791d4dd34da0cb79c7e53c5956555af5212e86809cb59928e72800?placeholderIfAbsent=true&apiKey=980d9bd07aac4b738b05d42cf7d3e438" class="icon" alt="Email icon" />
              <span class="contact-text">Info@youremail.com</span>
            </div>
            <div class="phone-container">
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/9aa51f778c5227a5a003590f4e6c3f6376e293a47c328bdf865f8c364377ecd0?placeholderIfAbsent=true&apiKey=980d9bd07aac4b738b05d42cf7d3e438" class="icon" alt="Phone icon" />
              <span class="contact-text">(480) 555-0103</span>
            </div>
          </div>
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/439282c8c6a96b2cca6e061dbb259a4db02926e7fff0389e8131a83f0b9201f0?placeholderIfAbsent=true&apiKey=980d9bd07aac4b738b05d42cf7d3e438" class="logo" alt="Company logo" />
        </div>
      </header>
  
      <nav class="main-nav">
        <ul class="nav-links">
          <li><a href="#" class="nav-link active">Home</a></li>
          <li><a href="#" class="nav-link">About</a></li>
          <li><a href="#" class="nav-link">Features</a></li>
        </ul>
        <div class="nav-actions">
          <div class="search-container">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/8a28117f01709fb3fe4d82194e7374e7b390f9e44efe186a8a8e17b0d0544d7e?placeholderIfAbsent=true&apiKey=980d9bd07aac4b738b05d42cf7d3e438" class="search-icon" alt="Search icon" />
          </div>
          <a href="#" class="nav-link">Screenshot</a>
          <a href="#" class="nav-link">Blog</a>
          <a href="#" class="download-button">DESCARGAR</a>
        </div>
      </nav>
  
      <main class="main-content">
        <div class="content-wrapper">
          <section class="hero-section">
            <div class="hero-text">
              <h1 class="hero-title">A Great App Makes<br />Your Life Better</h1>
              <p class="hero-description">
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
              </p>
              <h2 class="cta-title">Download App Now</h2>
              <div class="app-store-buttons">
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/559a6a4a1ef978ada250c16d06b2b9fbb13861559aebe58e38dea324d7267f1a?placeholderIfAbsent=true&apiKey=980d9bd07aac4b738b05d42cf7d3e438" class="store-button" alt="App Store button" />
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/cf8c1ee0774427c9efa98227c1483431ca19398ba25da31a86975a8acdd92317?placeholderIfAbsent=true&apiKey=980d9bd07aac4b738b05d42cf7d3e438" class="store-button" alt="Google Play button" />
              </div>
            </div>
          </section>
          <aside class="hero-image">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/71763ac77e5465fe7d911bcad5321da09e9448924a25aa3e03ea1ace12f487f0?placeholderIfAbsent=true&apiKey=980d9bd07aac4b738b05d42cf7d3e438" class="app-screenshot" alt="App screenshot" />
          </aside>
        </div>
      </main>
    </div>
  </template>
  
  <style scoped>
  .landing-page {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    position: relative;
    min-height: 1024px;
    width: 100%;
    align-items: center;
    padding: 35px 0 83px 80px;
  }
  
  @media (max-width: 991px) {
    .landing-page {
      max-width: 100%;
      padding-left: 20px;
    }
  }
  
  .background-image {
    position: absolute;
    inset: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
  
  .header {
    position: relative;
    display: flex;
    width: 100%;
    max-width: 1164px;
    gap: 20px;
    color: #fff;
    flex-wrap: wrap;
    justify-content: space-between;
    font: 400 16px Josefin Sans, sans-serif;
  }
  
  @media (max-width: 991px) {
    .header {
      max-width: 100%;
    }
  }
  
  .contact-info {
    display: flex;
    gap: 40px 47px;
  }
  
  .contact-details {
    display: flex;
    gap: 40px;
  }
  
  .email-container,
  .phone-container {
    display: flex;
    gap: 18px;
    white-space: nowrap;
  }
  
  @media (max-width: 991px) {
    .email-container,
    .phone-container {
      white-space: initial;
    }
  }
  
  .icon {
    aspect-ratio: 1;
    object-fit: contain;
    object-position: center;
    width: 18px;
    margin: auto 0;
  }
  
  .contact-text {
    flex-basis: auto;
  }
  
  .logo {
    aspect-ratio: 9.01;
    object-fit: contain;
    object-position: center;
    width: 162px;
    max-width: 100%;
    margin: auto 0;
  }
  
  .main-nav {
    position: relative;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.1);
    display: flex;
    margin-top: 15px;
    width: 1170px;
    max-width: 100%;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 5px 0 52px;
  }
  
  @media (max-width: 991px) {
    .main-nav {
      padding-left: 20px;
    }
  }
  
  .nav-links {
    align-self: stretch;
    display: flex;
    gap: 38px;
    color: #232233;
    white-space: nowrap;
    text-transform: uppercase;
    margin: auto 0;
    font: 600 20px Josefin Sans, sans-serif;
    list-style-type: none;
    padding: 0;
  }
  
  @media (max-width: 991px) {
    .nav-links {
      white-space: initial;
    }
  }
  
  .nav-link {
    text-decoration: none;
    color: inherit;
  }
  
  .nav-link.active {
    color: #5956e9;
    line-height: 1.3;
    text-decoration-line: underline;
  }
  
  .nav-actions {
    align-self: stretch;
    display: flex;
    align-items: center;
    gap: 40px 42px;
    flex-wrap: wrap;
    margin: auto 0;
  }
  
  @media (max-width: 991px) {
    .nav-actions {
      max-width: 100%;
    }
  }
  
  .search-container {
    border-radius: 5px;
    background: #fff;
    box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.1);
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 28px 16px;
  }
  
  .search-icon {
    aspect-ratio: 4.93;
    object-fit: contain;
    object-position: center;
    width: 172px;
  }
  
  .download-button {
    border-radius: 5px;
    background: #5956e9;
    align-self: stretch;
    color: #fff;
    white-space: nowrap;
    text-transform: uppercase;
    margin: auto 0;
    padding: 10px 17px;
    font: 600 20px Josefin Sans, sans-serif;
    text-decoration: none;
  }
  
  @media (max-width: 991px) {
    .download-button {
      white-space: initial;
    }
  }
  
  .main-content {
    position: relative;
    align-self: end;
    margin-top: 82px;
    width: 100%;
    max-width: 1255px;
  }
  
  @media (max-width: 991px) {
    .main-content {
      max-width: 100%;
      margin-top: 40px;
    }
  }
  
  .content-wrapper {
    gap: 20px;
    display: flex;
  }
  
  @media (max-width: 991px) {
    .content-wrapper {
      flex-direction: column;
      align-items: stretch;
      gap: 0px;
    }
  }
  
  .hero-section {
    display: flex;
    flex-direction: column;
    line-height: normal;
    width: 50%;
    margin-left: 0px;
  }
  
  @media (max-width: 991px) {
    .hero-section {
      width: 100%;
    }
  }
  
  .hero-text {
    position: relative;
    display: flex;
    flex-direction: column;
    align-self: stretch;
    align-items: start;
    justify-content: center;
    margin: auto 0;
    padding: 52px 0;
    border: 18px solid rgba(117, 114, 255, 1);
  }
  
  @media (max-width: 991px) {
    .hero-text {
      max-width: 100%;
      margin-top: 40px;
    }
  }
  
  .hero-title {
    color: #5956e9;
    text-transform: uppercase;
    font: 700 49px/63px Josefin Sans, sans-serif;
    margin: 0;
  }
  
  @media (max-width: 991px) {
    .hero-title {
      max-width: 100%;
      font-size: 40px;
      line-height: 57px;
    }
  }
  
  .hero-description {
    color: #6c6c72;
    margin: 18px 38px 0 0;
    font: 400 16px/24px Josefin Sans, sans-serif;
  }
  
  @media (max-width: 991px) {
    .hero-description {
      max-width: 100%;
      margin-right: 10px;
    }
  }
  
  .cta-title {
    color: #232233;
    text-transform: uppercase;
    align-self: start;
    margin-top: 54px;
    font: 600 25px Josefin Sans, sans-serif;
  }
  
  @media (max-width: 991px) {
    .cta-title {
      margin-top: 40px;
    }
  }
  
  .app-store-buttons {
    align-self: start;
    display: flex;
    margin-top: 5px;
    gap: 14px;
  }
  
  .store-button {
    aspect-ratio: 3.17;
    object-fit: contain;
    object-position: center;
    width: 149px;
    max-width: 100%;
  }
  
  .hero-image {
    display: flex;
    flex-direction: column;
    line-height: normal;
    width: 50%;
    margin-left: 20px;
  }
  
  @media (max-width: 991px) {
    .hero-image {
      width: 100%;
    }
  }
  
  .app-screenshot {
    aspect-ratio: 0.77;
    object-fit: contain;
    object-position: center;
    width: 100%;
    flex-grow: 1;
  }
  
  @media (max-width: 991px) {
    .app-screenshot {
      max-width: 100%;
      margin-top: 40px;
    }
  }
  </style>