import '../App.css';
import { Button } from "@material-tailwind/react";
import { useState } from 'react';

export default function Home() {
    const [showMore, setShowMore] = useState(false);

    const handleLearnMore = () => {
        setShowMore(!showMore);
    };

    return (
        <div className="main-content bg-gray flex flex-col items-center justify-center min-h-screen"
        style={{
            backgroundImage: "url('/src/images/camp_bg2.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}>
            
            <div className="container mx-auto p-8 text-center border-emerald-200">
                <h1 className="text-5xl font-bold text-green-700 mb-4 ">Welcome to Kiwi Camp</h1>
                <p className="text-xl text-gray-700 mb-8">Our mission is to provide a platform for youth camping management.</p>
                <Button 
                    color="green" 
                    size="lg" 
                    ripple="light"
                    className="mt-4"
                    onClick={handleLearnMore}
                >
                    Learn More
                </Button>
            </div>
            {showMore && (
                <div className="container mx-auto p-8 mt-8 bg-white/70 shadow-lg rounded-lg text-left">
                    <h2 className="text-3xl font-bold text-green-600 mb-4">About Kiwi Camp</h2>
                    <p className="text-lg text-gray-700 mb-4">
                        Kiwi Camp is dedicated to providing a comprehensive platform for youth camping management. We offer tools and resources to help organizers plan, execute, and manage camping events efficiently.
                    </p>
                    <h3 className="text-2xl font-bold text-green-600 mb-4">Features</h3>
                    <ul className="list-disc list-inside text-lg text-gray-700 mb-4">
                        <li>Event scheduling and management</li>
                        <li>Participant registration and tracking</li>
                        <li>Resource allocation and inventory management</li>
                        <li>Communication tools for organizers and participants</li>
                        <li>Comprehensive reporting and analytics</li>
                    </ul>
                    <p className="text-lg text-gray-700">
                        Our platform is designed to make camping events more enjoyable and less stressful for everyone involved. Join Kiwi Camp today and take your camping experience to the next level!
                    </p>
                </div>
            )}
        </div>
    );
}
