import React from "react";
import Banner from "../Banner/Banner";
import PetsCategory from "../PetsCategory/PetsCategory";
import AdoptionCTA from "../AdoptionCTA/AdoptionCTA";
import AboutUs from "../AboutUs/AboutUs";
import SuccessStories from "../SuccessStories/SuccessStories";
import AdoptionProcess from "../AdoptionProcess/AdoptionProcess";

const Home = () => {
  return (
    <div>
      <Banner />
      <PetsCategory />
      <AdoptionCTA />
      <AboutUs />
      <SuccessStories />
      <AdoptionProcess />
    </div>
  );
};

export default Home;
