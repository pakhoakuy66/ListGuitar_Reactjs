import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createGuitar, Guitar } from "../../API/API_Service/Guitar_Service";

interface CreateGuitarFormProps {
    setIsOpenCreate: React.Dispatch<React.SetStateAction<boolean>>; // Thêm prop setIsOpenCreate
}

export function CreateGuitarForm({ setIsOpenCreate }: CreateGuitarFormProps) {
    const [showForm, setShowForm] = useState(true);
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState<number | string>(""); // Sử dụng string để dễ dàng xử lý các giá trị nhập
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleCancel = () => {
        setIsOpenCreate(false); // Khi nhấn Cancel sẽ ẩn form
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !brand || !price || !image) {
            alert("Vui lòng nhập hết tất cả các trường! ☺️😝");
            return;
        }

        const reader = new FileReader(); // image base64 nói trỉn
        reader.readAsDataURL(image);
        reader.onloadend = async () => {
            const newGuitar: Guitar = {
                id: "",
                name,
                brand,
                price: Number(price),
                image: reader.result as string,
            };

            try {
                const result = await createGuitar(newGuitar);

                if (result.data) {
                    alert("Thêm sản phẩm mới thành công 😉");

                    setName("");
                    setBrand("");
                    setPrice("");
                    setImage(null);
                    setImagePreview(null);

                    setIsOpenCreate(false);
                } else {
                    alert("Thêm sản phẩm thất bại 🤧");
                }
            } catch (error) {
                console.error(error);
                alert("Lỗi 😵");
            }
        };
    };

    // Hàm xử lý khi người dùng chọn ảnh
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFile = e.target.files[0];
            setImage(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile)); // Hiển thị ảnh đã chọn
        }
    };

    return (
        <div className="grid h-screen justify-center items-center">
            {showForm && (
                <form className="bg-[#da7f58] w-[450px] h-auto p-3 rounded-sm shadow-xl">
                    <h2 className="text-center text-[20px] font-bold shadow-xl">
                        Thêm sản phẩm nào ️🎸
                    </h2>
                    <nav className="mt-6">
                        <div>
                            <label
                                htmlFor=""
                                className="text-[18px] text-[#000]"
                            >
                                Name:
                            </label>{" "}
                            <br />
                            <Input
                                type="text"
                                className="bg-[#f9f5f2] mt-2 duration-200 hover:bg-[#fff7f0]"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                id="inputName"
                            />
                        </div>
                        <div className="mt-3">
                            <label
                                htmlFor=""
                                className="text-[18px] text-[#000]"
                            >
                                Brand:
                            </label>{" "}
                            <br />
                            <Input
                                type="text"
                                className="bg-[#f9f5f2] mt-2 duration-200 hover:bg-[#fff7f0]"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                id="inputBrand"
                            />
                        </div>
                        <div className="mt-3">
                            <label
                                htmlFor=""
                                className="text-[18px] text-[#000]"
                            >
                                Price:
                            </label>{" "}
                            <br />
                            <Input
                                type="number"
                                className="bg-[#f9f5f2] mt-2 duration-200 hover:bg-[#fff7f0]"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                id="inputPrice"
                            />
                        </div>
                        <div className="mt-5">
                            <Input
                                type="file"
                                className="cursor-pointer hover:bg-[#f9f5f2] p-1"
                                onChange={handleImageChange}
                                id="chooseFile"
                            />
                            {imagePreview && (
                                <div className="mt-3">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-[100px] h-[100px] object-cover border rounded-sm"
                                    />
                                </div>
                            )}
                        </div>
                    </nav>
                    <div className="flex mt-5 justify-around">
                        <Button
                            id="btnCancel"
                            className="bg-red-500 duration-300 hover:bg-red-700"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            id="btnCreate"
                            className="bg-blue-500 duration-300 hover:bg-blue-700"
                            type="submit"
                            onClick={handleCreate}
                        >
                            Create
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
