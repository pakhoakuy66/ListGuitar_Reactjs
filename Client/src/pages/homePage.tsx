import { Link } from "react-router-dom";
import Guitar from "../IMG/guitar_VT_RM.png";
import Guitar_1 from "../IMG/uku_VT_RM.png";
import { Header } from "./Layout/Head";

export function HomePage() {
    return (
        <div className="bg-[#FAF2E8] h-screen w-screen">
            <Header />
            <main className="flex justify-around mt-10">
                <Link to="/List">
                    <IMGGuitar image={Guitar} />
                </Link>
                <Link to="/List">
                    <IMGGuitar image={Guitar_1} />
                </Link>
            </main>
        </div>
    );
}

function IMGGuitar(props) {
    return (
        <div>
            <img
                src={props.image}
                className="w-[370px] h-[370px] duration-500 hover:w-[390px] hover:h-[390px]"
            />
        </div>
    );
}
