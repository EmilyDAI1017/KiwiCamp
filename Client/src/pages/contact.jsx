import '../App.css';

export default function Contact() {
    return (
        <div className="main-content bg-gray-100/90 flex flex-col items-center justify-center min-h-screen py-12"
        style={{
            backgroundImage: "url('/src/images/camp_bg2.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100%'
          }}>
            <div className="container p-8 bg-white/80 shadow-lg rounded-lg text-center mt-11">
                <h1 className="text-5xl font-bold text-green-600 mb-4">Contact Us</h1>
                <p className="text-xl text-gray-700 mb-8">We'd love to hear from you! Please fill out the form below to get in touch with us.</p>
                <div className="text-left">
                    <form className="w-full max-w-lg mx-auto">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="name">
                                Name
                            </label>
                            <input
                                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                                type="text"
                                id="name"
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                                type="email"
                                id="email"
                                placeholder="Your Email"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="message">
                                Message
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                                id="message"
                                rows="5"
                                placeholder="Your Message"
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                            >
                                Send Message
                            </button>
                        </div>
                    </form>
                    <div className="mt-8">
                        <h2 className="text-3xl font-bold text-green-600 mb-4">Other Ways to Contact Us</h2>
                        <p className="text-lg text-gray-700 mb-4">
                            <strong>Email:</strong> info@kiwicamp.com
                        </p>
                        <p className="text-lg text-gray-700 mb-4">
                            <strong>Phone:</strong> (09) 456-7890
                        </p>
                        <p className="text-lg text-gray-700 mb-4">
                            <strong>Address:</strong> 123 Kiwi Camp Road, Auckland, New Zealand
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
