"use client";

import { ReservationType } from "@/app/main/allReservations/page";
import { parkingsStore } from "@/store/parkings";
import { userStore } from "@/store/users";
import { useState } from "react";
import { toast } from "react-toastify";

export default function EditMatriculaPopup({
  reservation,
  onClose,
}: {
  reservation: ReservationType;
  onClose: () => void;
}) {
  const { editarMatricula } = parkingsStore();
  const { user } = userStore();

  const [newMatricula, setNewMatricula] = useState<string>("");

  const handleEditMatricula = async () => {
    if (newMatricula === "") {
      toast.error("La matrícula no puede estar vacía");
      return;
    }

    await editarMatricula(reservation, newMatricula);
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center text-black">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-4">Editar Matrícula</h1>

        <div className="mb-4">
          <label
            htmlFor="matricula"
            className="block text-sm font-medium text-gray-700"
          >
            Matrícula
          </label>
          <select
            id="matricula"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            onChange={(e) => setNewMatricula(e.target.value)}
          >
            {user.matricula.map((matricula, index) => (
              <option
                key={index}
                value={matricula}
              >
                {matricula}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleEditMatricula}
          >
            Guardar cambios
          </button>
          <button
            onClick={onClose}
            type="button"
            className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
