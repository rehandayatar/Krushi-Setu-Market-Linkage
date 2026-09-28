import { Router, type IRouter } from "express";
import healthRouter from "./health";
import krushiRouter from "./krushi";

const router: IRouter = Router();

router.use(healthRouter);
router.use(krushiRouter);

export default router;
