"use client";

import React, { useEffect, useState } from "react";
import ParkingSpace from "@/Components/ui/parkings";
import { parkingsStore } from "@/store/parkings";
import { userStore } from "@/store/users";

import "./edit_parkings.css";
import { toast } from "react-toastify";

export default function EditParkingsPage() {
  const {
    parkings,
    addNewParkingFirebase,
    getAllParkingSlots,
    deleteParkingSlot,
  } = parkingsStore();
  const { user } = userStore();

  const [name, setName] = useState("");
  const [cover, setCover] = useState("yes");

  useEffect(() => {
    getAllParkingSlots();
  }, [parkings, getAllParkingSlots]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !cover) {
      toast.error("Por favor rellene todos los campos");
      return;
    }

    const coverBool = cover === "yes" ? true : false;

    // Save the parking space
    await addNewParkingFirebase(coverBool, name);

    toast.success("Estacionamiento agregado correctamente");
    setName("");
    setCover("yes");
  };

  const handleDelete = async (id) => {
    const response = confirm(
      "¿Estás seguro de que quieres eliminar esta plaza?"
    );
    if (response) await deleteParkingSlot(id);
  };

  if (user?.status !== "admin" && user?.status !== "employee") {
    return <p>Necesitas permisos de admin para acceder a esta sección</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold my-5">Crear plaza</h1>

      <div className="flex flex-wrap">
        <div className="w-full sm:w-1/2">
          <ParkingSpace number={name} />
        </div>
        <div className="w-full sm:w-1/2 flex items-center justify-center">
          <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Nombre
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="cover"
              >
                ¿Plaza cubierta?
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="cover"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
              >
                <option value="yes">Si</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Añadir
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="reset"
                onClick={() => {
                  setName("");
                  setCover("");
                }}
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>
      </div>

      <h1 className="text-2xl font-semibold my-5">Lista de Plazas</h1>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cubierta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {parkings
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((parking) => (
              <tr key={parking.id}>
                <td>{parking.name}</td>
                <td>{parking.isCovered ? "Sí" : "No"}</td>
                <td>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => {
                      handleDelete(parking.id);
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
