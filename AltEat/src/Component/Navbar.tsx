import fav from "../assets/fav.png";
import user from "../assets/user.png";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50">
      <div className="h-16 bg-[#FFF3DB] flex justify-end pr-8">
        <div className="flex items-center text-[20px] gap-10">
          <p className="cursor-pointer">About Us</p>
          <p className="cursor-pointer">Recipes</p>
          <p className="cursor-pointer">Ingredients</p>
          <div className="flex gap-5 items-center">
            <button className="bg-[#FBB496] h-11 w-33 rounded-[10px] cursor-pointer">
              Chatbot
            </button>
            <img src={fav} className="h-8 cursor-pointer" />
            <img src={user} className="h-10 cursor-pointer" />
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
