"use client";

import { getAuth, updatePassword } from "firebase/auth";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const changePassword = async (e: any) => {
    e.preventDefault();
    const auth = getAuth();

    const form = e.target;
    const password = e.target.elements.password.value;
    const confirmPassword = e.target.elements.confirmPassword.value;

    if (
      password !== confirmPassword ||
      password === "" ||
      confirmPassword === ""
    ) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (auth.currentUser === null) {
      toast.error("No hay un usuario logueado");
      return;
    }

    try {
      await updatePassword(auth.currentUser, password);
      toast.success("Contraseña cambiada correctamente");

      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Error al cambiar la contraseña");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ marginBottom: "20px", fontSize: "30px" }}>Cambiar contraseña</h1>
      <form
        onSubmit={changePassword}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "300px",
        }}
      >
        <label>
          Contraseña:
          <input
            type="password"
            name="password"
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </label>
        <label>
          Confirmar contraseña:
          <input
            type="password"
            name="confirmPassword"
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </label>
        <button
          type="submit"
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#007BFF",
            color: "white",
            cursor: "pointer",
          }}
        >
          Cambiar contraseña
        </button>
      </form>
    </div>
  );
}
