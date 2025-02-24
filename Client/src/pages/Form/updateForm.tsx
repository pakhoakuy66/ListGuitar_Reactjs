import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateGuitar, Guitar } from "../../API/API_Service/Guitar_Service";

interface UpdateGuitarFormProps {
    guitar: Guitar;
    setIsOpenUpdate: React.Dispatch<React.SetStateAction<boolean>>; // Thêm prop setIsOpenUpdate
}

export function UpdateGuitarForm({
    setIsOpenUpdate,
    guitar,
}: UpdateGuitarFormProps) {
    const [showForm, setShowForm] = useState(true);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formUpdate, setFormUpdate] = useState({
        name: guitar.name,
        brand: guitar.brand,
        price: guitar.price,
        image: guitar.image,
    });

    const handleCancel = () => {
        setIsOpenUpdate(false); // Khi nhấn Cancel sẽ ẩn form
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormUpdate({ ...formUpdate, [e.target.name]: e.target.value });
    };

    const handChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormUpdate({
                    ...formUpdate,
                    image: reader.result as string,
                });
            };
            reader.readAsDataURL(file);
        }
        if (e.target.files) {
            const selectedFile = e.target.files[0];
            setImage(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile)); // Hiển thị ảnh đã chọn
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await updateGuitar(guitar.id, formUpdate);

        if (res.data) {
            alert("Cập nhật thành công");
            setIsOpenUpdate(false);
        } else {
            alert("Lỗi!");
        }
    };

    return (
        <div className="grid h-screen justify-center items-center">
            {showForm && (
                <form className="bg-[#da7f58] w-[450px] h-auto p-3 rounded-sm shadow-xl">
                    <h2 className="text-center text-[20px] font-bold shadow-xl">
                        Update sản phẩm nào ️🎸
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
                                name="name"
                                className="bg-[#f9f5f2] mt-2 duration-200 hover:bg-[#fff7f0]"
                                value={formUpdate.name}
                                onChange={handleChange}
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
                                name="brand"
                                className="bg-[#f9f5f2] mt-2 duration-200 hover:bg-[#fff7f0]"
                                value={formUpdate.brand}
                                onChange={handleChange}
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
                                name="price"
                                className="bg-[#f9f5f2] mt-2 duration-200 hover:bg-[#fff7f0]"
                                value={formUpdate.price}
                                onChange={(e) => {
                                    setFormUpdate({
                                        ...formUpdate,
                                        price: Number(e.target.value),
                                    });
                                }}
                                id="inputPrice"
                            />
                        </div>
                        <div className="mt-5">
                            <Input
                                type="file"
                                className="cursor-pointer hover:bg-[#f9f5f2] p-1"
                                onChange={handChangeFile}
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
                            onClick={handleUpdate}
                        >
                            Update
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
