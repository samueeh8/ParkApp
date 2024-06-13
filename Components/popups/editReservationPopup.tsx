"use client";

import { ReservationType } from "@/app/main/allReservations/page";
import { parkingsStore } from "@/store/parkings";
import { useState } from "react";
import { toast } from "react-toastify";

export default function EditReservationPopup({
  reservation,
  onClose,
}: {
  reservation: ReservationType;
  onClose: () => void;
}) {
  const { editReservation } = parkingsStore();

  const [startDate, setStartDate] = useState<Date>(
    new Date(reservation.startDate.seconds * 1000)
  );
  const [endDate, setEndDate] = useState<Date>(
    new Date(reservation.endDate.seconds * 1000)
  );
  const [matricula, setMatricula] = useState<string>(reservation.matricula);
  const [parkingName, setParkingName] = useState<string>(
    reservation.parkingName
  );

  const handleEditReservation = async (reservation: ReservationType) => {
    if (!startDate || !endDate || !matricula || !parkingName) {
      alert("Por favor, rellena todos los campos");
      return;
    }

    const newData = {
      startDate,
      endDate,
      matricula,
      parkingName,
    };

    await editReservation(reservation, newData);
    toast.success("Reserva editada correctamente");
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center text-black">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-4">Editar Reserva</h1>

        <div className="mb-4">
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Fecha de inicio
          </label>
          <input
            type="date"
            id="startDate"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ml-2"
            value={startDate.toISOString().split("T")[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700"
          >
            Fecha de fin
          </label>
          <input
            type="date"
            id="endDate"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ml-2"
            value={endDate.toISOString().split("T")[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
        </div>

        <div className="my-2">
          <label htmlFor="matricula">Matrícula</label>
          <input
            type="text"
            id="matricula"
            value={matricula}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ml-2"
            onChange={(e) => setMatricula(e.target.value)}
          />
        </div>

        <div className="my-2">
          <label htmlFor="parkingName">Plaza</label>
          <input
            type="text"
            id="parkingName"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ml-2"
            value={parkingName}
            onChange={(e) => setParkingName(e.target.value)}
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => handleEditReservation(reservation)}
          >
            Guardar cambios
          </button>
          <button
            type="button"
            className="ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
