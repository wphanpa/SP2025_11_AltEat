import { useState } from "react";
// import './App.css'
import Navbar from "./Component/Navbar.tsx";
import send from "./assets/send.png";
import circle from "./assets/circle.png";
import recipe from "./assets/recipe.png";
import context from "./assets/context.png";
import subs from "./assets/subs.png";

function App() {
  // const [count, setCount] = useState(0)
  const options = [
    {
      tool: "Recipe Suggestion & Lookup",
      img: recipe,
    },
    {
      tool: "Ingredient with Context",
      img: context,
    },
    {
      tool: "Ingredient Substitution",
      img: subs,
    },
  ];

  return (
    <>
      <div className="-z-10">
        <img
          src={circle}
          className="w-[750px] h-[750px] absolute -left-70 top-18"
        />
        <img
          src={circle}
          className="w-[350px] h-[350px] absolute -right-30 top-135"
        />
      </div>

      <div className="z-10 bg-linear-to-b from-[#FACE9B] via-[#FFBD9E] via-60% to-[#E6896D]">
        <div className="relative">
          <Navbar />

          <div className=" w-[70%] flex flex-col m-auto">
            <div className="flex flex-col items-center mt-20 gap-8">
              <h1 className="text-[64px]">Welcome to AltEat</h1>
              <p className="text-[20px]">
                Get started by choosing what you’d like to do today.
              </p>
              <form className="flex flex-col items-center gap-1">
                <input
                  type="text"
                  name="query"
                  placeholder="How can I help you?"
                  className="px-8 py-5 h-[50px] w-[820px] bg-white rounded-[20px] text-[16px] outline-[1.5px] shadow-[0_8px_4px_rgba(0,0,0,0.25)]"
                />{" "}
                <br />
                <button type="submit">
                  <div className="flex justify-center items-center  h-[50px] w-[130px] gap-3 bg-[#FFE6DD] rounded-[30px] outline-[1.5px]">
                    <p className="text-[20px]">Send</p>
                    <img src={send} className="w-[26px]" />
                  </div>
                </button>
              </form>
            </div>

            <div className="mt-[120px] flex flex-col items-center gap-[70px] mb-[200px]">
              <h2 className="text-[32px]">Need something else?</h2>
              <div className="flex justify-between w-full">
                {options.map((option) => (
                  <div className="flex flex-col bg-[#FFE6DD] cursor-pointer rounded-[10px]">
                    <div>
                      <div className="mx-[15px] mt-[15px] bg-white p-[12.5px] text-[20px] text-center outline-[1.5px] outline-[#AA8484] rounded-[15px]">
                        <p>{option.tool}</p>
                      </div>
                      <img src={option.img} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
