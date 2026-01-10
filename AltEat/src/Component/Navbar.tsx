import fav from "../assets/fav.png";
import user from "../assets/user.png";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50">
      <div className="h-16 bg-[#FFF3DB] flex justify-between px-8">
        <div className="max-w-40 flex items-center">
          <Link to="/" className="cursor-pointer">
          <img src={logo} />
        </Link>
        </div>
        <div className="flex items-center text-[20px] gap-10">
          <Link to="/aboutus" className="cursor-pointer">
            About Us
          </Link>
          <Link to="/recipesearch" className="cursor-pointer">
            Recipes
          </Link>
          <Link to="/ingredientsearch" className="cursor-pointer">
            Ingredients
          </Link>
          <div className="flex gap-5 items-center">
            <Link to="/chatbot">
              <button className="bg-[#FBB496] h-11 w-33 rounded-[10px] cursor-pointer">
                Chatbot
              </button>
            </Link>
            <Link to="/favorite">
              <img src={fav} className="h-8 cursor-pointer" />
            </Link>
            <Link to="profile">
              <img src={user} className="h-10 cursor-pointer" />
            </Link>
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
