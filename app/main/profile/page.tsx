"use client";

import { userStore } from "@/store/users";
import { getAuth, updatePassword } from "firebase/auth";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { user, addMatricula, deleteMatricula } = userStore();

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

  const handleDeleteMatricula = async (matricula: string) => {
    const confirm = window.confirm(
      `¿Estás seguro que quieres eliminar la matricula ${matricula}?`
    );

    if (!confirm) return;
    await deleteMatricula(user.id, matricula);
  };

  const handleAddMatricula = async (e: any) => {
    e.preventDefault();

    const matricula = e.target.elements.matricula.value;
    await addMatricula(user.id, matricula);
    e.target.reset();
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
      <h1 style={{ marginBottom: "20px", fontSize: "30px" }}>
        Cambiar contraseña
      </h1>
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
              color: "black",
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
              color: "black",
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

      <div className="mt-10 border border-gray-300 p-10">
        <h1 className="text-3xl font-bold text-center">Mis matrículas</h1>

        {user.matricula.length === 0 ? (
          <p className="text-center text-gray-600 mt-5">No tienes matrículas</p>
        ) : (
          <ul className="mt-5 space-y-2">
            {user.matricula.map((matricula, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow"
              >
                <span className="text-gray-700">{matricula}</span>
                <button
                  className="ml-2 text-white bg-red-500 hover:bg-red-600 p-2 rounded-full"
                  onClick={() => {
                    handleDeleteMatricula(matricula);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        <form
          className="flex flex-col gap-2.5 w-72 mt-10"
          onSubmit={(e) => {
            handleAddMatricula(e);
          }}
        >
          <label className="block">
            Agregar Matricula:
            <input
              type="text"
              name="matricula"
              required
              className="mt-1 p-2.5 rounded-md border border-gray-300 w-full text-black"
            />
          </label>
          <button className="p-2.5 rounded-md bg-blue-600 text-white cursor-pointer hover:bg-blue-700">
            Añadir matricula
          </button>
        </form>
      </div>
    </div>
  );
}
