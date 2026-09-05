import { Router, type IRouter } from "express";
import healthRouter from "./health";
import workspaceRouter from "./workspace";
import publicDataRouter from "./public-data";

const router: IRouter = Router();

router.use(healthRouter);
router.use(publicDataRouter);
router.use(workspaceRouter);

export default router;
