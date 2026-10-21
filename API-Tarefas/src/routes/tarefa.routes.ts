import { Router } from "express";
import { autenticarToken } from "../middlewares/auth.middleware";

import {
    criarTarefa,
    listarTarefas,
    editarTarefa,
    concluirTarefa,
    excluirTarefa
} from "../controllers/tarefa.controller";

const router = Router();

router.use(autenticarToken);

router.post("/", criarTarefa);
router.get("/", listarTarefas);
router.patch("/:id/concluir", concluirTarefa);
router.patch("/:id", editarTarefa);
router.delete("/:id", excluirTarefa);

export default router;
