const URL_API = "http://142.93.53.83/api/api/auth";

document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('auth-form');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');

    // --- 1. Lógica del Ojito ---
    togglePassword.addEventListener('click', () => {
        const isPass = passwordInput.type === 'password';
        passwordInput.type = isPass ? 'text' : 'password';
        togglePassword.textContent = isPass ? '🙈' : '👁️';
    });

    // --- 2. Validación visual de contraseña (en tiempo real) ---
    passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;
        const up = /[A-Z]/.test(val);
        const num = /[0-9]/.test(val);
        const len = val.length >= 8;

        document.getElementById('req-cap').innerHTML = up ? "✅ Una mayúscula" : "❌ Una mayúscula";
        document.getElementById('req-num').innerHTML = num ? "✅ Un número" : "❌ Un número";
        document.getElementById('req-len').innerHTML = len ? "✅ Mínimo 8 caracteres" : "❌ Mínimo 8 caracteres";
        
        document.getElementById('req-cap').className = up ? 'req-item valid' : 'req-item invalid';
        document.getElementById('req-num').className = num ? 'req-item valid' : 'req-item invalid';
        document.getElementById('req-len').className = len ? 'req-item valid' : 'req-item invalid';
    });

    // --- 3. Envío del Formulario ---
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const contrasena = passwordInput.value;
        const esRegistro = document.getElementById('nombre-container').style.display !== 'none';

        // Validar Email (Formato real)
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return alert("⚠️ Por favor, ingresa un correo electrónico real.");
        }

        // Validar Contraseña (Solo si es registro)
        if (esRegistro) {
            const esFuerte = /[A-Z]/.test(contrasena) && /[0-9]/.test(contrasena) && contrasena.length >= 8;
            if (!esFuerte) return alert("⚠️ La contraseña no cumple los requisitos de seguridad.");
        }

        const ruta = esRegistro ? '/registrar' : '/login';
        const datos = { email, contrasena };
        
        if (esRegistro) {
            datos.nombre = document.getElementById('nombre').value;
            datos.telefono = document.getElementById('telefono').value;
        }

        try {
            const res = await fetch(URL_API + ruta, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            const data = await res.json();

            if (res.ok) {
                if (esRegistro) {
                    alert("✅ Registro exitoso. ¡Inicia sesión!");
                    location.reload();
                } else {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('usuario', JSON.stringify(data.usuario));
                    alert(`¡Hola de nuevo, ${data.usuario.nombre}!`);
                    window.location.href = data.usuario.rol === 'admin' ? "../admin/panel.html" : "../index.html";
                }
            } else {
                alert("❌ " + (data.mensaje || data.error));
            }
        } catch (err) {
            alert("📡 Error de conexión con el servidor.");
        }
    });
});