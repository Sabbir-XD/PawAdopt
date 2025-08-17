import React from "react";
import Banner from "../Banner/Banner";
import PetsCategory from "../PetsCategory/PetsCategory";
import AdoptionCTA from "../AdoptionCTA/AdoptionCTA";
import AboutUs from "../AboutUs/AboutUs";
// import SuccessStories from "../SuccessStories/SuccessStories";
import AdoptionProcess from "../AdoptionProcess/AdoptionProcess";
// import AboutHowTo from "../AboutHowTo/AboutHowTo";

const Home = () => {
  return (
    <div>
      <Banner />
      <PetsCategory />
      <AdoptionCTA />
      {/* <AboutHowTo /> */}
      {/* <SuccessStories /> */}
      <AboutUs />
      <AdoptionProcess />
    </div>
  );
};

export default Home;
