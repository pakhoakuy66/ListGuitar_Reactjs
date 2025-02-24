import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    getAllGuitars,
    getFindGuitarsByName,
    createGuitar,
    updateGuitar,
    deleteGuitar,
    Guitar,
} from "../API/API_Service/Guitar_Service";
import { Header } from "./Layout/Head";
import { CreateGuitarForm } from "./Form/createForm";
import { UpdateGuitarForm } from "./Form/updateForm";
import imgGuitar from "../IMG/guitar_VT_RM.png";

function FormList() {
    return (
        <div className="bg-[#FAF2E8] h-screen w-screen">
            <Header />
            <main className="px-10 pt-8">
                <FormCRUD />
            </main>
        </div>
    );
}

function FormCRUD() {
    const [guitars, setGuitars] = useState<Guitar[]>([]);
    const [search, setSearch] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [images, setImages] = useState<any>(null);
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [selectedGuitar, setSelectedGuitar] = useState<Guitar | null>(null);

    useEffect(() => {
        // Lấy tất cả ảnh trong thư mục src/IMG, bao gồm .jpg, .png, và .svg
        const loadImages = import.meta.glob("../IMG/*.{jpg,png,svg}") as Record<
            string,
            () => Promise<{ default: string }>
        >;

        // Chuyển đổi glob result thành một object chứa đường dẫn ảnh
        const imagesList: any = {};
        for (const path in loadImages) {
            loadImages[path]().then((module) => {
                imagesList[path] = module.default;
            });
        }

        setImages(imagesList);
    }, []);

    // Lấy data
    useEffect(() => {
        async function fetchGuitars() {
            if (search.trim()) return; // Không gọi lại API nếu đang có tìm kiếm

            const response = await getAllGuitars();
            if (response && response.data) {
                setGuitars(response.data);
            }
        }

        fetchGuitars();
    }, [search, guitars]);

    const handleFind = async (e?: React.FormEvent | React.MouseEvent) => {
        if (e) e.preventDefault();

        setErrorMessage(""); // Xóa lỗi cũ nếu có
        setGuitars([]); // Xóa danh sách cũ trước khi tìm kiếm

        try {
            const result = await getFindGuitarsByName(search);

            if (result?.data) {
                setGuitars(
                    Array.isArray(result.data) ? result.data : [result.data]
                );
            } else {
                setErrorMessage(result?.message);
            }
        } catch (error) {
            setErrorMessage("Lỗi kết nối! Vui lòng thử lại.");
        }
    };

    const handleUpdate = (guitar: Guitar) => {
        setSelectedGuitar(guitar);
        setIsOpenUpdate(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Bạn có chắc muốn xóa không ?")) return;

        const response = await deleteGuitar(id);

        if (response?.data) {
            const index = guitars.findIndex((guitar) => guitar.id === id);
            if (index !== -1) {
                const updatedGuitars = [...guitars];
                updatedGuitars.splice(index, 1); // Xóa phần tử tại index
                setGuitars(updatedGuitars);
            }
        } else {
            alert("Xóa không thành công");
        }
    };

    return (
        <nav
            className="w-full bg-[#da7f58] rounded-2xl p-3 h-auto"
            id="formGuitar"
        >
            <nav className="flex items-center">
                <h1 className="font-bold text-[25px] text-[#fff] ml-3">
                    Danh sách đàn guitar nè =
                </h1>
                <img src={imgGuitar} className="w-10" />
                <p className="text-[25px] text-[#fff]">++</p>
                <div className="flex ml-40">
                    <Input
                        className=" justify-center w-[250px] rounded-sm duration-200 bg-slate-200 hover:bg-[#FFDAB9] p-1"
                        id="inputFind"
                        placeholder="Tìm guitars"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleFind(e);
                            }
                        }}
                    />
                    <Button
                        className="bg-slate-200 ml-1 duration-200 hover:bg-[#FFDAB9]"
                        id="btnFind"
                        onClick={(e) => handleFind(e)}
                    >
                        <i className="fa-brands fa-searchengin duration-200 hover:text-[20px] text-[#111] hover:text-red-600"></i>
                    </Button>
                </div>
                <Button
                    className="bg-[#133961e3] duration-300 hover:bg-red-700 ml-[200px]"
                    id="btnAdd"
                    onClick={(e) => {
                        e.preventDefault();
                        setIsOpenCreate(true);
                    }}
                >
                    <i className="fa-solid fa-plus text-[#fff] text-[15px]"></i>
                </Button>
            </nav>
            {isOpenCreate && (
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    {isOpenCreate && (
                        <CreateGuitarForm setIsOpenCreate={setIsOpenCreate} />
                    )}
                </div>
            )}
            {isOpenUpdate && selectedGuitar && (
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    {isOpenUpdate && (
                        <UpdateGuitarForm
                            setIsOpenUpdate={setIsOpenUpdate}
                            guitar={selectedGuitar}
                        />
                    )}
                </div>
            )}
            <div className="mt-5">
                <Table className="bg-[#FAF2E8] rounded-sm ">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead className="w-[200px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="">Brand</TableHead>
                            <TableHead className="">Price</TableHead>
                            <TableHead className="w-[15px]">Update</TableHead>
                            <TableHead className="w-[15px]">Delete</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {guitars.map((guitar) => (
                            <TableRow key={guitar.id}>
                                <TableCell className="font-medium">
                                    {guitar.id}
                                </TableCell>
                                <TableCell>
                                    <img
                                        src={
                                            guitar.image.startsWith(
                                                "data:image"
                                            )
                                                ? guitar.image
                                                : images[
                                                      `../IMG/${guitar.image}`
                                                  ]
                                        }
                                        className="w-20 object-cover"
                                    />
                                </TableCell>
                                <TableCell>{guitar.name}</TableCell>
                                <TableCell className="">
                                    {guitar.brand}
                                </TableCell>
                                <TableCell className="">
                                    {guitar.price} VNĐ
                                </TableCell>
                                <TableCell className="">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleUpdate(guitar);
                                        }}
                                    >
                                        <i className="fa-regular fa-pen-to-square duration-200 hover:text-blue-600"></i>
                                    </button>
                                </TableCell>
                                <TableCell className="">
                                    <button
                                        onClick={() => handleDelete(guitar.id)}
                                    >
                                        <i className="fa-solid fa-trash duration-200 hover:text-red-600"></i>
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {errorMessage && (
                            <div className="flex justify-center  w-full mt-2">
                                <p className="text-red-500 text-center">
                                    {errorMessage}
                                </p>
                            </div>
                        )}
                    </TableBody>
                </Table>
                <div className="m-2">
                    <p className="text-white text-center">
                        Danh sách guitar và ukulele 🎸⭐.
                    </p>
                </div>
            </div>
        </nav>
    );
}

export default FormList;
