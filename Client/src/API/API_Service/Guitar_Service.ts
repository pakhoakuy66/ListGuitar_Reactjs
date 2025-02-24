import { ResponsePayload } from "./response-payload";

export type Guitar = {
    id: string;
    name: string;
    image: string;
    price: number;
    brand: string;
};

export const getAllGuitars = async () => {
    const res = await fetch("http://localhost:3000/guitars");

    if (!res.ok) {
        console.error("Failed to fetch guitars");
        return { data: null };
    }

    const data = await res.json();

    return { data: data }; // Đảm bảo trả về đúng định dạng
};

export const getFindGuitarsByName = async (name: string) => {
    const res = await fetch(`http://localhost:3000/guitar/${name}`);

    if (!res.ok) {
        console.error("Error fetching guitars by name");
        return {
            data: null,
            message: "Không tìm thấy guitar nào",
        } as ResponsePayload<Guitar[] | null>;
    }

    const data = await res.json();

    return data as ResponsePayload<Guitar | null>;
};

export const createGuitar = async (guitar: Guitar) => {
    const res = await fetch("http://localhost:3000/guitar/new", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(guitar),
    });

    const data = await res.json();

    return data as ResponsePayload<Guitar | null>;
};

export const updateGuitar = async (id: string, guitar: Partial<Guitar>) => {
    const res = await fetch(`http://localhost:3000/guitar/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(guitar),
    });

    const data = await res.json();

    return data as ResponsePayload<Guitar | null>;
};

export const deleteGuitar = async (id: string) => {
    try {
        const res = await fetch(`http://localhost:3000/guitar/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            console.error("Lỗi khi xóa guitar");
            return { data: null };
        }

        return await res.json(); // Trả về response khi xóa thành công
    } catch (error) {
        console.error("Có lỗi khi kết nối đến server:", error);
        return { data: null };
    }
};

