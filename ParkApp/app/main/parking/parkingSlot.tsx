"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { parkingsStore } from "@/store/parkings";
import { userStore } from "@/store/users";

import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import { toast } from "react-toastify";

export function ParkingSlot({ slot }: { slot: any }) {
  const { user } = userStore();
  const { addReservationDate } = parkingsStore();

  const [selectedDate, setSelectedDate] = useState<Date>();

  const convertFirebaseDate = (date: any) => {
    return new Date(date.seconds * 1000);
  };

  const reservationDates = slot.reservationDates.map((date: any) =>
    convertFirebaseDate(date.date)
  );

  const handleReservation = async () => {
    // Check if the user is logged in
    if ("id" in user && user.id === "") {
      console.log("No user logged in!");
      toast.error("Por favor inicia sesión para reservar");
      return;
    }

    // Check if there is a selected date
    if (!selectedDate) {
      console.log("No date selected!");
      toast.error("Por favor elige una fecha para reservar");
      return;
    }

    try {
      // Add a reservation date for the parking slot
      await addReservationDate(slot.id, selectedDate, user.id);

      toast.success("¡Reserva realizada!");
      setSelectedDate(undefined);
    } catch (error) {
      console.log("Error adding reservation date!", error);
      toast.error("Ocurrió un error, por favor intenta de nuevo más tarde");
      return;
    }
  };

  return (
    <div className="flex gap-5">
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date) => setSelectedDate(date)}
        excludeDates={reservationDates}
        className="custom-datepicker"
      />
      <button onClick={handleReservation}>Reservar</button>
    </div>
  );
}
