"use client";

import React, { useState } from "react";
import { parkingsStore } from "@/store/parkings";
import { userStore } from "@/store/users";

import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import { toast } from "react-toastify";

export function ParkingSlot({
  slot,
  startDate,
  endDate,
  onReset,
}: {
  slot: any;
  startDate: Date;
  endDate: Date;
  onReset: () => void;
}) {
  const { user } = userStore();
  const { addReservationDate } = parkingsStore();

  const [selectedMatricula, setSelectedMatricula] = useState("");

  const handleReservation = async () => {
    // Check if the user is logged in
    if ("id" in user && user.id === "") {
      console.log("No user logged in!");
      toast.error("Por favor inicia sesión para reservar");
      return;
    }

    // Check if the user has selected a matricula
    if (selectedMatricula === "") {
      console.log("No matricula selected!");
      toast.error("Por favor selecciona una matrícula");
      return;
    }

    try {
      // Add a reservation date for the parking slot
      await addReservationDate(slot.id, startDate, endDate, user.id, selectedMatricula);

      toast.success("¡Reserva realizada!");
      // Reset all the values
      onReset();

    } catch (error) {
      console.log("Error adding reservation date!", error);
      toast.error("Ocurrió un error, por favor intenta de nuevo más tarde");
      return;
    }
  };

  const handleChangeMatricula = (event: any) => {
    setSelectedMatricula(event.target.value);
  };

  return (
    <div className="flex gap-2">
      <select
        className="p-2.5 rounded-md border border-gray-300 text-black"
        value={selectedMatricula}
        onChange={handleChangeMatricula}
      >
        <option value="">Selecciona tu matrícula</option>{" "}
        {/* Opción agregada */}
        {user.matricula.map((matricula) => (
          <option key={matricula} value={matricula}>
            {matricula}
          </option>
        ))}
      </select>
      <button
        className="p-2.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
        onClick={handleReservation}
      >
        Reservar
      </button>
    </div>
  );
}
