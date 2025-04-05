import GlobalNews from "./GlobalNews";
import Hero from "./Hero";
import LatestNews from "./LatestNews";

import SportTechNews from "./SportTechNews";



const Home = () => {
  return (
      <>
        <div className="font-barlow">
          <Hero />
        </div>
        
        <div className="font-barlow">
          <LatestNews />
        </div>
  
        <div className="">
          <GlobalNews />
        </div>
        <div className="">
          <SportTechNews />
        </div>
      </>
  );
};

export default Home;
