import { Request, Response, NextFunction, Handler } from "express";
import { ResponsePayload } from "./response";
import GuitarModel from "../models/guitarsModel";

export const findAllGuitar: Handler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    GuitarModel.aggregate()
        .sort({ id: 1 })
        .then((guitars) => {
            console.log("Guitars fetched from DB:", guitars);
            const payload: ResponsePayload = {
                status: "ok",
                message: "successfully found all guitars",
                data: guitars,
            };
            console.log(guitars);

            res.json(payload);
        })
        .catch(next);
};

export const findGuitarsByName: Handler = async (
    req: Request<{ guitar_name?: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const name = req.params.guitar_name;

        if (!name) {
            res.status(400).json({
                status: "fail",
                message: "Guitar name is required",
                data: null,
            });
            return; // Đảm bảo hàm trả về `void`
        }

        // Tìm kiếm theo tên chứa từ khóa (không phân biệt hoa/thường)
        const guitars = await GuitarModel.find({
            name: { $regex: name, $options: "i" }, // "i" => không phân biệt hoa/thường
        });

        if (guitars.length === 0) {
            res.status(404).json({
                status: "fail",
                message: `No guitars found with name ${name}`,
                data: [],
            });
            return;
        }

        res.json({
            status: "ok",
            message: `Successfully found ${guitars.length} guitars with name ${name}`,
            data: guitars,
        });
    } catch (error) {
        next(error);
    }
};

export const createGuitar: Handler = (req, res, next) => {
    // Tìm ID lớn nhất trong cơ sở dữ liệu hiện tại
    GuitarModel.findOne()
        .sort({ id: -1 })
        .limit(1)
        .then((lastGuitar) => {
            let newId = "GUI001"; // Mặc định là 'GUI001' nếu không có bản ghi nào

            if (lastGuitar) {
                // Tạo ID mới dựa trên ID lớn nhất hiện tại
                const lastId = lastGuitar.id;
                const numericPart = parseInt(lastId.replace("GUI", ""), 10);
                const nextId = numericPart + 1;
                newId = `GUI${nextId.toString().padStart(3, "0")}`; // Tạo ID mới với định dạng 'GUI001', 'GUI002', ...
            }

            // Thêm ID mới vào dữ liệu guitar trước khi lưu vào DB
            const guitarData = {
                id: newId,
                ...req.body,
            };

            // Tạo bản ghi mới với ID mới
            GuitarModel.create(guitarData)
                .then((guitar) => {
                    const payload: ResponsePayload = {
                        status: "ok",
                        message: "Successfully created guitar",
                        data: guitar,
                    };

                    res.status(201).json(payload);
                })
                .catch(next);
        })
        .catch(next);
};

// TEST CREATE GUITAR
// const mockReq = {
//     body: {
//         name: "Test Guitar LO",
//         price: 500,
//         brand: "Test Brand",
//         description: "A test guitar",
//     },
// } as Request;

// const mockRes = {
//     status: (code: number) => {
//         console.log("Status:", code);
//         return mockRes;
//     },
//     json: (data: any) => console.log("Response:", data),
// } as Response;

// const mockNext = (error: any) => console.error("Error:", error);

// // Gọi hàm để test
// createGuitar(mockReq, mockRes, mockNext);

export const updateGuitar: Handler = (
    req: Request<{ guitar_id?: string }>,
    res,
    next
) => {
    const id = req.params.guitar_id;

    GuitarModel.findOneAndUpdate(
        { id },
        { $set: req.body },
        { runValidators: true, new: true }
    )
        .then((guitar) => {
            if (guitar === null) {
                const payload: ResponsePayload = {
                    status: "fail",
                    message: `there are no guitar with id ${id}`,
                    data: null,
                };

                return res.status(404).json(payload);
            }

            const payload: ResponsePayload = {
                status: "ok",
                message: `successfully update guitar with id ${id}`,
                data: guitar,
            };

            res.json(payload);
        })
        .catch(next);
};

// TEST UPDATE
// const mockReq = {
//     params: { guitar_id: "GUI015" }, // Thay ID tùy ý
//     body: {
//         name: "Guitar Hel2",
//         image: "Hello",
//         price: 100,
//         brand: "Brand XML",
//     }, // Dữ liệu update
// } as unknown as Request;

// const mockRes = {
//     status: (code: number) => {
//         console.log("Status:", code);
//         return mockRes;
//     },
//     json: (data: any) => console.log("Response:", data),
// } as Response;

// const mockNext = (error: any) => console.error("Error:", error);

// // Gọi hàm update để test
// updateGuitar(mockReq, mockRes, mockNext);

export const deleteGuitarByID: Handler = (
    req: Request<{ guitar_id?: string }>,
    res,
    next
) => {
    const id = req.params.guitar_id;

    GuitarModel.findOneAndDelete({ id })
        .then((guitar) => {
            if (guitar === null) {
                const payload: ResponsePayload = {
                    status: "fail",
                    message: `there are no guitar with id ${id}`,
                    data: null,
                };

                return res.status(404).json(payload);
            }

            const payload: ResponsePayload = {
                status: "ok",
                message: `successfully delete guitar with id ${id}`,
                data: guitar,
            };
            res.json(payload);
        })
        .catch(next);
};

// TEST DELETE
// Giả lập request và response cho delete
// const mockReq = {
//     params: { guitar_id: "GUI019" }, // Thay ID tùy ý
// } as unknown as Request;

// // Giả lập response để kiểm tra kết quả trả về
// const mockRes = {
//     status: (code: number) => {
//         console.log("Status:", code);
//         return mockRes;
//     },
//     json: (data: any) => {
//         console.log("Response:", data);
//     },
// } as Response;

// // Giả lập next để xử lý lỗi
// const mockNext = (error: any) => console.error("Error:", error);

// // Gọi hàm delete để test
// deleteGuitarByID(mockReq, mockRes, mockNext);
