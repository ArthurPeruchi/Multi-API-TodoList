import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import tarefaRoutes from "./routes/tarefa.routes";
import { tratarErro } from "./middlewares/erro.middleware";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tarefas", tarefaRoutes);

app.get("/", (_req, res) => {
    res.json({
        mensagem: "API de Tarefas funcionando."
    });
});

app.get("/teste-erro", (_req, _res) => {
    throw new Error("Erro inesperado para teste do middleware.");
});

app.use(tratarErro);

app.listen(PORT, () => {
    console.log(`API disponível em http://localhost:${PORT}`);
});