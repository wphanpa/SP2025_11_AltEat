import "../index.css";
import fav from "../assets/fav.png";
import user from "../assets/user.png";

function Navbar() {
  return (
    <nav>
      <div className="h-20 bg-[#FFF3DB] flex justify-end pr-8">
        <div className="flex items-center text-[24px] gap-[70px]">
          <p className="cursor-pointer">About Us</p>
          <p className="cursor-pointer">Recipes</p>
          <p className="cursor-pointer">Ingredients</p>
          <div className="flex gap-[30px] items-center">
            <button className="bg-[#FBB496] h-[50px] w-[140px] rounded-[10px] cursor-pointer">
              Chatbot
            </button>
            <img src={fav} className="h-10 cursor-pointer" />
            <img src={user} className="h-12 cursor-pointer" />
            <div className="flex gap-2">
              <p className="cursor-pointer">TH</p>
              <p>/</p>
              <p className="cursor-pointer">EN</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
