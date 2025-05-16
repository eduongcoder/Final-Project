import React from 'react';
import TopStories from '../TopStories';
import Footer from '../Footer';
import HotStories from '../HotStories';
import StorySlider from '../StorySlider';
const Home = () => {
    return (
        <div>
            <StorySlider />
            <TopStories />
            <HotStories />
            <Footer />
            {/* Other components can be added here */}
        </div>
    );
};

export default Home;