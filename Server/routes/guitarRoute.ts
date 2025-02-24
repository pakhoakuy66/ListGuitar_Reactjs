import { Router } from "express";

import {
    findAllGuitar,
    findGuitarsByName,
    createGuitar,
    updateGuitar,
    deleteGuitarByID,
} from "../controllers/guitarController";

export const guitarRoute = Router();

const guitarRouteWithId = Router({ mergeParams: true });
const guitarRouteWithName = Router({ mergeParams: true });

guitarRoute.use("/:guitar_name", guitarRouteWithName);
guitarRoute.use("/:guitar_id", guitarRouteWithId);

guitarRoute.get("/all", findAllGuitar);
guitarRoute.all("/new", createGuitar); // all mãi đính

guitarRouteWithId.patch("/", updateGuitar);
guitarRouteWithId.delete("/", deleteGuitarByID);

guitarRouteWithName.get("/", findGuitarsByName);
