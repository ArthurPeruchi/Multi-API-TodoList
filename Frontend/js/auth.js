import { login, cadastrar, logout } from "./authService.js";

const authScreen = document.getElementById("authScreen");
const todoScreen = document.getElementById("todoScreen");
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authDescription = document.getElementById("authDescription");
const authSubmit = document.getElementById("authSubmit");
const authToggle = document.getElementById("authToggle");
const authMessage = document.getElementById("authMessage");
const nameGroup = document.getElementById("nameGroup");
const authName = document.getElementById("authName");
const authPassword = document.getElementById("authPassword");

let modoCadastro = false;

function mostrarLogin() {
    authScreen.classList.remove("hidden");
    todoScreen.classList.add("hidden");
}

function mostrarTarefas() {
    authScreen.classList.add("hidden");
    todoScreen.classList.remove("hidden");

    // Atualiza as tarefas depois da autenticação.
    window.dispatchEvent(new Event("usuarioAutenticado"));
}

authToggle.addEventListener("click", () => {
    modoCadastro = !modoCadastro;
    authMessage.textContent = "";

    nameGroup.classList.toggle("hidden", !modoCadastro);
    authName.required = modoCadastro;

    authTitle.textContent = modoCadastro ? "Criar conta" : "Entrar";
    authDescription.textContent = modoCadastro
        ? "Cadastre-se para organizar suas tarefas."
        : "Acesse sua lista de tarefas.";

    authSubmit.textContent = modoCadastro ? "Cadastrar" : "Entrar";
    authToggle.textContent = modoCadastro
        ? "Já tem conta? Entrar"
        : "Não tem conta? Cadastre-se";

    authPassword.autocomplete = modoCadastro
        ? "new-password"
        : "current-password";
});

authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    authMessage.textContent = "";

    const email = document.getElementById("authEmail").value.trim();
    const senha = authPassword.value;

    try {
        if (modoCadastro) {
            const nome = authName.value.trim();

            await cadastrar(nome, email, senha);

            modoCadastro = false;
            nameGroup.classList.add("hidden");
            authName.required = false;
            authTitle.textContent = "Entrar";
            authDescription.textContent = "Conta criada! Entre para continuar.";
            authSubmit.textContent = "Entrar";
            authToggle.textContent = "Não tem conta? Cadastre-se";
            authForm.reset();
            authMessage.textContent = "Cadastro realizado. Faça login.";
            return;
        }

        await login(email, senha);
        authForm.reset();
        mostrarTarefas();
    } catch (erro) {
        authMessage.textContent = erro.message;
    }
});

if (localStorage.getItem("token")) {
    mostrarTarefas();
} else {
    logout();
    mostrarLogin();
}

const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", () => {
    logout();
    mostrarLogin();
});