// ================================
// CONFIG SUPABASE
// ================================
const SUPABASE_URL = "https://ovvtjqwkfdwymbczcanm.supabase.co";
const SUPABASE_KEY = "sb_publishable_-ug71BjVdFs9OLHKBBvCXA_U2FJkOrL"; // 👈 reemplaza esto


const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const API_URL = "https://agrolyz-backend-production.up.railway.app/predecir";

document.addEventListener('DOMContentLoaded', () => {

    const loginCard = document.getElementById('login-card');
    const registerCard = document.getElementById('register-card');
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');

    const showLogin = document.getElementById('show-login');
    const showRegister = document.getElementById('show-register');

    const btnLogin = document.getElementById('btn-login');
    const btnRegister = document.getElementById('btn-register');
    const btnLogout = document.getElementById('btn-logout');
    const btnAnalizar = document.getElementById('btn-analizar');

    if (showLogin) {
        showLogin.onclick = (e) => {
            e.preventDefault();
            registerCard.classList.add('hidden');
            loginCard.classList.remove('hidden');
        };
    }

    if (showRegister) {
        showRegister.onclick = (e) => {
            e.preventDefault();
            loginCard.classList.add('hidden');
            registerCard.classList.remove('hidden');
        };
    }

    btnRegister.onclick = async () => {

        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;
        const nombre = document.getElementById("reg-nombre").value;
        const ubicacion = document.getElementById("reg-ubicacion").value;

        const { error } = await client.auth.signUp({
            email,
            password,
            options: {
                data: {
                    nombre_completo: nombre,
                    ubicacion_cultivo: ubicacion
                }
            }
        });

        if (error) {
            alert(error.message);
            return;
        }

        alert("Registro exitoso");
    };

    btnLogin.onclick = async () => {

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const { error } = await client.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert(error.message);
            return;
        }

        loginSection.style.display = "none";
        dashboardSection.style.display = "block";
    };

    btnLogout.onclick = async () => {
        await client.auth.signOut();
        location.reload();
    };

    btnAnalizar.onclick = analizarHoja;
});

async function analizarHoja() {

    const fileInput = document.getElementById('foto-hoja');
    const resultadoBox = document.getElementById('resultado-box');

    const formData = new FormData();
    formData.append("imagen", fileInput.files[0]);

    resultadoBox.innerText = "Analizando...";

    const res = await fetch(API_URL, {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    resultadoBox.innerHTML = `
        🌿 ${data.diagnostico || data.mensaje}<br>
        🎯 ${data.confianza || 0}%
    `;
}
