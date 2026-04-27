// ================================
// CONFIG SUPABASE
// ================================
const SUPABASE_URL = "https://ovvtjqwkfdwymbczcanm.supabase.co";
const SUPABASE_KEY = "sb_publishable_-ug71BjVdFs9OLHKBBvCXA_U2FJkOrL";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ================================
// API FASTAPI
// ================================
const API_URL = "https://agrolyz-backend-production.up.railway.app/predecir";

// ================================
// CUANDO CARGA EL DOM
// ================================
document.addEventListener('DOMContentLoaded', async () => {

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

    const fileInput = document.getElementById('foto-hoja');
    const previewImg = document.getElementById('preview-img');

    // ================================
    // ESTADO INICIAL
    // ================================
    loginSection.style.display = "block";
    dashboardSection.style.display = "none";
    registerCard.classList.add('hidden');
    loginCard.classList.remove('hidden');

    // ================================
    // VERIFICAR SESIÓN
    // ================================
    try {

        const { data: { user } } = await client.auth.getUser();

        if (user) {
            loginSection.style.display = "none";
            dashboardSection.style.display = "block";
        }

    } catch (error) {

        console.log("No hay sesión");

    }

    // ================================
    // MOSTRAR IMAGEN SELECCIONADA
    // ================================
    if (fileInput && previewImg) {

        fileInput.addEventListener('change', function () {

            if (this.files && this.files[0]) {

                const reader = new FileReader();

                reader.onload = function (e) {

                    previewImg.src = e.target.result;
                    previewImg.style.display = "block";

                };

                reader.readAsDataURL(this.files[0]);

            }

        });

    }

    // ================================
    // CAMBIO LOGIN / REGISTER
    // ================================
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

    // ================================
    // REGISTRO
    // ================================
    if (btnRegister) {

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

                alert("Error: " + error.message);
                return;

            }

            alert("Registro exitoso");

            registerCard.classList.add('hidden');
            loginCard.classList.remove('hidden');

        };

    }

    // ================================
    // LOGIN
    // ================================
    if (btnLogin) {

        btnLogin.onclick = async () => {

            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            const { error } = await client.auth.signInWithPassword({

                email,
                password

            });

            if (error) {

                alert("Error: " + error.message);
                return;

            }

            loginSection.style.display = "none";
            dashboardSection.style.display = "block";

        };

    }

    // ================================
    // LOGOUT
    // ================================
    if (btnLogout) {

        btnLogout.onclick = async () => {

            await client.auth.signOut();

            location.reload();

        };

    }

    // ================================
    // ANALIZAR IMAGEN
    // ================================
    if (btnAnalizar) {

        btnAnalizar.onclick = analizarHoja;

    }

});


// ================================
// FUNCIÓN IA
// ================================
async function analizarHoja() {

    const fileInput = document.getElementById('foto-hoja');
    const resultadoBox = document.getElementById('resultado-box');

    if (!fileInput.files.length) {

        alert("Debes seleccionar una imagen");

        return;

    }

    const formData = new FormData();

    formData.append(
        "imagen",
        fileInput.files[0]
    );

    resultadoBox.innerText =
        "⏳ Analizando con IA...";

    try {

        const res = await fetch(
            API_URL,
            {
                method: "POST",
                body: formData
            }
        );

        if (!res.ok) {

            throw new Error(
                "Servidor no respondió"
            );

        }

        const data = await res.json();

        console.log("Respuesta IA:", data);

        if (!data.valido) {

            resultadoBox.innerHTML =
                "⚠️ " + data.mensaje;

            return;

        }

        resultadoBox.innerHTML = `
            🌿 <b>Diagnóstico:</b> ${data.diagnostico}
            <br>
            🎯 <b>Confianza:</b> ${data.confianza}%
        `;

    } catch (error) {

        console.log(error);

        resultadoBox.innerHTML =
            "❌ Error con el servidor";

    }

}
