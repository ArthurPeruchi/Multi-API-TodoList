import {
    getTodos,
    createTodo,
    editTodo,
    toggleTodo,
    deleteTodo,
    getStats
} from "./todoService.js";

const form = document.getElementById("todoForm");
const todoList = document.getElementById("todoList");
const totalSpan = document.getElementById("total");
const completedSpan = document.getElementById("completed");

async function renderTodos() {
    const resultado = await getTodos();

    const todos = Array.isArray(resultado)
        ? resultado
        : resultado?.tarefas ?? resultado?.data ?? [];

    todoList.innerHTML = "";

    todos.forEach(todo => {
        const li = document.createElement("li");

        if (todo.concluida) {
            li.classList.add("completed");
        }

        const titulo = document.createElement("span");

        titulo.textContent = todo.titulo;

        const actions = document.createElement("div");
        actions.classList.add("actions");

        const btnComplete = document.createElement("button");
        btnComplete.classList.add("btn-complete");
        btnComplete.textContent = "✔";
        btnComplete.type = "button";
        btnComplete.disabled = todo.concluida;

        const btnDelete = document.createElement("button");
        btnDelete.classList.add("btn-delete");
        btnDelete.textContent = "✖";
        btnDelete.type = "button";

        const btnEdit = document.createElement("button");
        btnEdit.classList.add("btn-edit");
        btnEdit.textContent = "✎";
        btnEdit.type = "button";
        btnEdit.title = "Editar título";
        btnEdit.setAttribute("aria-label", `Editar ${todo.titulo}`);

        btnComplete.addEventListener("click", async () => {
            try {
                await toggleTodo(todo.id);
                await refresh();
            } catch (erro) {
                console.error("Erro ao concluir tarefa:", erro);
                alert("Não foi possível concluir a tarefa.");
            }
        });

        btnDelete.addEventListener("click", async () => {
            try {
                await deleteTodo(todo.id);
                await refresh();
            } catch (erro) {
                console.error("Erro ao excluir tarefa:", erro);
                alert("Não foi possível excluir a tarefa.");
            }
        });

        btnEdit.addEventListener("click", async () => {
            const novoTitulo = prompt("Digite o novo título:", todo.titulo);

            if (novoTitulo === null || !novoTitulo.trim()) {
                return;
            }

            if (novoTitulo.trim() === todo.titulo) {
                return;
            }

            try {
                await editTodo(todo.id, novoTitulo.trim());
                await refresh();
            } catch (erro) {
                console.error("Erro ao editar tarefa:", erro);
                alert("Não foi possível editar a tarefa.");
            }
        });

        actions.append(btnComplete, btnEdit, btnDelete);
        li.append(titulo, actions);
        todoList.appendChild(li);
    });
}

async function renderStats() {
    const stats = await getStats();

    totalSpan.textContent = stats.total;
    completedSpan.textContent = stats.concluidas;
}

async function refresh() {
    try {
        await Promise.all([
            renderTodos(),
            renderStats()
        ]);
    } catch (erro) {
        console.error("Erro ao atualizar a interface:", erro);
        alert(
            "Não foi possível carregar as tarefas e estatísticas. " +
            "Verifique se você está autenticado e se os serviços estão ativos."
        );
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titleInput = document.getElementById("title");
    const title = titleInput.value.trim();

    if (!title) {
        alert("Digite o título da tarefa.");
        return;
    }

    try {
        await createTodo({ title });

        form.reset();
        await refresh();
    } catch (erro) {
        console.error("Erro ao criar tarefa:", erro);
        alert("Não foi possível criar a tarefa.");
    }
});

window.addEventListener("usuarioAutenticado", refresh);