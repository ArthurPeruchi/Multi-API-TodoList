import os

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Tarefa
from app.schemas import EstatisticasTarefas

load_dotenv()

app = FastAPI(
    title="Contador de Tarefas",
    description="API para consultar estatísticas de tarefas por usuário.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=False,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

security = HTTPBearer()
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"

def obter_usuario_id(
    credenciais: HTTPAuthorizationCredentials = Depends(security),
) -> int:
    if not JWT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="JWT_SECRET não está configurado.",
        )

    token = credenciais.credentials

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
        )

        sub = payload.get("sub")

        if not isinstance(sub, str):
            raise HTTPException(
                status_code=401,
                detail="Token inválido.",
            )

        usuario_id = int(sub)

        if usuario_id <= 0:
            raise ValueError("ID inválido.")

        return usuario_id

    except (JWTError, ValueError):
        raise HTTPException(
            status_code=401,
            detail="Token inválido ou expirado.",
        )

@app.get(
    "/stats",
    response_model=EstatisticasTarefas,
    tags=["Estatísticas"],
)
def obter_estatisticas(
    usuario_id: int = Depends(obter_usuario_id),
    db: Session = Depends(get_db),
):
    consulta = select(
        func.count(Tarefa.id).label("total"),
        func.count(Tarefa.id)
        .filter(Tarefa.concluida.is_(True))
        .label("concluidas"),
        func.count(Tarefa.id)
        .filter(Tarefa.concluida.is_(False))
        .label("pendentes"),
    ).where(Tarefa.usuarioId == usuario_id)

    resultado = db.execute(consulta).one()

    return EstatisticasTarefas(
        usuario_id=usuario_id,
        total=resultado.total,
        concluidas=resultado.concluidas,
        pendentes=resultado.pendentes,
    )

@app.get("/")
def inicio():
    return {"mensagem": "Serviço Contador está funcionando."}