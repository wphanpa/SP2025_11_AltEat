import Navbar from "../component/Navbar.tsx";

function AboutUsPage() {
    return(
        <div className="min-h-screen bg-[#FFEDDD]">
            <Navbar />
            <div className="mt-10 max-w-7xl m-auto w-[60%]">
                {/* Title */}
                <h1 className="text-5xl font-bold text-center mb-12">
                    About Us
                </h1>

                {/* Overview Section */}
                <div className="flex flex-col md:flex-row items-center gap-10">
                    {/* Left: Text */}
                    <div className="md:w-1/2">
                        <h2 className="text-2xl font-semibold mb-4">
                            Overview
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            AltEat is a web application designed to help users discover creative and
                            suitable ingredient substitutions in recipes. The platform supports
                            flexible cooking by recommending alternative ingredients based on
                            availability, dietary preferences, and local context.
                        </p>

                        <p className="text-gray-600 leading-relaxed mt-4">
                            AltEat is developed as a chatbot-based food substitution system integrated
                            with the FoodIngSub Model, a large language model trained on Thai ingredient
                            and recipe datasets from the research project “Utilizing Deep Learning for
                            Recipe Ideation with Local Ingredient Substitutions” (Grant No. FF-026/2568).
                        </p>
                    </div>

                    {/* Right: Image */}
                    <div className="md:w-1/2">
                    <img
                        src="/overview.png"
                        alt="Overview"
                        className="w-full h-auto rounded-xl shadow-md"
                    />
                    </div>
                </div>

                {/* Our Team Section */}
                <div className="mt-16 pb-16">
                    <h2 className="text-2xl font-semibold mb-8">
                        Our Team
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        {/* Member 1 */}
                        <div className="text-center">
                        <img
                            src="/team1.png"
                            alt="Team Member 1"
                            className="w-40 h-40 mx-auto object-cover rounded-full shadow-md"
                        />
                        <p className="mt-4 font-medium">
                            Ms. Pataraporn Penpargkul 
                        </p>
                        </div>

                        {/* Member 2 */}
                        <div className="text-center">
                        <img
                            src="/team2.png"
                            alt="Team Member 2"
                            className="w-40 h-40 mx-auto object-cover rounded-full shadow-md"
                        />
                        <p className="mt-4 font-medium">
                            Mr. Wasuntha Phanpanich
                        </p>
                        </div>

                        {/* Member 3 */}
                        <div className="text-center">
                        <img
                            src="/team3.png"
                            alt="Team Member 3"
                            className="w-40 h-40 mx-auto object-cover rounded-full shadow-md"
                        />
                        <p className="mt-4 font-medium">
                            Ms. Phanthira Phansen  
                        </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AboutUsPage;