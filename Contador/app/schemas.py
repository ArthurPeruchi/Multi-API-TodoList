from pydantic import BaseModel, ConfigDict

class EstatisticasTarefas(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    usuario_id: int
    total: int
    concluidas: int
    pendentes: int
