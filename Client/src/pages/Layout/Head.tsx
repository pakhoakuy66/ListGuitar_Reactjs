import { Link } from "react-router-dom";

import Guitar from "../../IMG/guitar_VT_RM.png";

export function Header() {
    return (
        <header className="flex items-center justify-center h-20 bg-[#da7f58] shadow-xl">
            <Link to="/">
                <h1 className="text-[30px] font-bold duration-300 hover:italic hover:text-[#fff]">
                    Guitars Shop
                </h1>
            </Link>
            <Link to="/">
                <img src={Guitar} className="w-12 animate-bounce" />
            </Link>
        </header>
    );
}
