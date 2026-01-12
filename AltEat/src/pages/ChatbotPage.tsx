import Navbar from "../component/Navbar.tsx";
import { useState } from "react";

function ChatbotPage() {
    const [history] = useState([
    "Recipe ideas using chicken, tomato",
    "Healthy breakfast recipe suggestion",
    "Egg substitution in brownie recipes",
    ]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const handleSend = () => {
        if (!input.trim()) return;

        setMessages((prev) => [...prev, input]);
        setInput("");
        };

    return (
        <div
            className="
                min-h-screen
                w-full
                bg-cover
                bg-center
                bg-no-repeat
            "
            style={{
                backgroundImage: "url('/src/assets/chatbot-bg.png')",
            }}
        >
            <Navbar></Navbar>
            <div className="flex min-h-screen">

            {/* Sidebar */}
            <aside
                className={`
                    bg-white
                    border-r
                    transition-all
                    duration-300
                    ${isSidebarOpen ? "w-64" : "w-14"}
                `}
                >
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-3">
                    {isSidebarOpen && (
                    <span className="text-sm font-semibold">History</span>
                    )}

                    {/* Toggle Button */}
                    <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="
                        w-8 h-8
                        flex items-center justify-center
                        rounded-md
                        hover:bg-[#FFCB69]
                        transition
                    "
                    >
                    {isSidebarOpen ? "⟨" : "⟩"}
                    </button>
                </div>
                <div className="p-4 border-t border-gray-300"></div>
                {/* History List */}
                {isSidebarOpen && (
                    <ul className="px-3 space-y-2 text-sm text-gray-600">
                        {history.map((item, index) => (
                        <li
                            key={index}
                            className="
                            rounded-md
                            px-2
                            py-1.5
                            cursor-pointer
                            hover:bg-[#FFCB69]
                            transition-colors
                            duration-200
                            "
                        >
                            {item}
                        </li>
                        ))}
                    </ul>
                    )}
                </aside>


            {/* Chat Area */}
            <main className="flex-1 flex items-center justify-center p-6">
                {/* Chat Card */}
                <div
                className="
                    w-full
                    max-w-3xl
                    h-full
                    max-h-[90vh]
                    bg-white
                    rounded-3xl
                    shadow-xl
                    flex
                    flex-col
                    p-6
                "
                >
                {/* Welcome Card */}
                <div className="bg-gray-50 rounded-2xl p-5 mb-6">
                    <h1 className="font-semibold text-lg mb-1">
                    👋 Hi there! Looking for a food substitute?
                    </h1>
                    <p className="text-sm text-gray-600 mb-4">
                    Just tell me what ingredient you have or don’t have,
                    and I’ll suggest tasty alternatives.
                    </p>

                    <div className="flex flex-wrap gap-2">
                    {[
                        "Substitute for milk",
                        "What can replace soy sauce?",
                        "Replace egg in baking",
                        "What can I use instead of sugar?",
                    ].map((text, i) => (
                        <button
                        key={i}
                        className="
                            px-3 py-1.5
                            bg-yellow-200
                            text-sm
                            rounded-full
                            hover:bg-[#FFCB69]
                        "
                        >
                        {text}
                        </button>
                    ))}
                    </div>
                </div>

                {/* Messages area */}
                <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-2">
                    {messages.map((msg, index) => (
                        <div
                        key={index}
                        className="
                            self-end
                            max-w-[70%]
                            bg-[#FFCB69]
                            px-4
                            py-2
                            rounded-2xl
                            text-sm
                        "
                        >
                        {msg}
                        </div>
                    ))}
                </div>


                {/* Input */}
                <div className="mt-4">
                    <div className="flex items-center border rounded-full px-4 py-2">
                        <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="How can I help you?"
                        className="flex-1 outline-none text-sm"
                        />

                        <button
                        onClick={handleSend}
                        className="
                            ml-2
                            w-8
                            h-8
                            bg-[#FFCB69]
                            rounded-full
                            flex
                            items-center
                            justify-center
                            hover:opacity-80
                        "
                        >
                        ➤
                        </button>
                    </div>
                </div>
                </div>
            </main>
            </div>
        </div>
    );
}

export default ChatbotPage;

