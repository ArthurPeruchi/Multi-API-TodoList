from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    tarefas: Mapped[list["Tarefa"]] = relationship(
        back_populates="usuario",
    )


class Tarefa(Base):
    __tablename__ = "tarefas"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    titulo: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    concluida: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    usuarioId: Mapped[int] = mapped_column(
        "usuarioId",
        Integer,
        ForeignKey("usuarios.id"),
        nullable=False,
    )

    usuario: Mapped["Usuario"] = relationship(
        back_populates="tarefas",
    )