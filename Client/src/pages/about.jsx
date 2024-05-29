import '../App.css';

export default function About() {
    return (
        <div className="main-content bg-gray-100 flex flex-col items-center justify-center min-h-screen py-12"
        style={{
            backgroundImage: "url('/src/images/camp_bg2.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100%'

          }}>
            <div className=" mx-auto p-8 bg-white/80 shadow-lg rounded-lg text-center">
                <h1 className="text-5xl font-bold text-green-600 mb-4">Welcome to Kiwi Camp</h1>
                <p className="text-xl text-gray-700 mb-8">About Us</p>
                <div className="text-left">
                    <h2 className="text-3xl font-bold text-green-600 mb-4">Our Mission</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        Kiwi Camp is dedicated to providing a comprehensive platform for youth camping management. We believe in empowering young people through outdoor experiences that foster growth, leadership, and a love for nature.
                    </p>
                    <h2 className="text-3xl font-bold text-green-600 mb-4">Our Story</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        Founded by a group of passionate outdoor enthusiasts, Kiwi Camp was created to address the challenges of organizing and managing youth camping trips. Our platform simplifies the process, allowing organizers to focus on creating memorable experiences for campers.
                    </p>
                    <h2 className="text-3xl font-bold text-green-600 mb-4">Our Team</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        Our team is composed of experienced campers, outdoor educators, and tech experts who are committed to making camping accessible and enjoyable for everyone. We work tirelessly to improve our platform and support our community.
                    </p>
                    <h2 className="text-3xl font-bold text-green-600 mb-4">Get Involved</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        We are always looking for enthusiastic individuals to join our community. Whether you are a camper, organizer, or supporter, there are many ways to get involved and contribute to our mission.
                    </p>
                </div>
            </div>
        </div>
    );
}
