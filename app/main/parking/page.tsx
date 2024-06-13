"use client";

import React, { useEffect, useState } from "react";
import { parkingsStore } from "@/store/parkings";
import { userStore } from "@/store/users";
import { ParkingSlot } from "./parkingSlot";

import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import DatePicker from "./DatePicker";

export default function ParkingMainPage() {
  const { getAllReservationsAndParkings, filterParkingSlots } = parkingsStore();

  useEffect(() => {
    getAllReservationsAndParkings();
  }, []);

  // Cuando se seleccionan las fechas, se actualizan las fechas seleccionadas
  const [dates, setDates] = useState<[Date, Date] | []>([]);
  const [filteredParkings, setFilteredParkings] = useState<any[]>([]);

  const newDates = async (dates: [Date, Date]) => {
    setDates(dates);

    // Filtrar las plazas disponibles
    const filteredParkingsResult = await filterParkingSlots(dates[0], dates[1]);
    setFilteredParkings(filteredParkingsResult);
  };

  const ResetForms = () => {
    setDates([]);
    setFilteredParkings([]);

    getAllReservationsAndParkings();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold my-5 text-center">
        Selecciona las fechas en que quieres reservar
      </h1>

      <DatePicker onChangeDates={newDates} />

      <h1 className="text-2xl font-semibold my-5">
        Plazas disponibles para reservar
      </h1>
      {dates[0] && dates[1] && (
        <p className="mb-10">
          Plazas disponibles del {dates[0].toLocaleDateString()} al{" "}
          {dates[1].toLocaleDateString()}
        </p>
      )}

      {dates[0] && dates[1] ? (
        <div>
          <div className="grid grid-cols-3 gap-4 items-center border rounded-lg p-4">
            {filteredParkings.length === 0 && (
              <div className="text-center text-red-500">
                No hay plazas disponibles para las fechas seleccionadas
              </div>
            )}

            {filteredParkings
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((parking) => (
                <>
                  <div className="bg-gray-100 rounded-lg text-black p-4 flex items-center justify-center">
                    Plaza {parking.isCovered ? "cubierta " : "descubierta "}
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium">
                      Plaza {parking.name}
                    </h3>
                  </div>
                  <div className="flex justify-end">
                    <ParkingSlot
                      slot={parking}
                      onReset={ResetForms}
                      startDate={dates[0] || new Date()}
                      endDate={dates[1] || new Date()}
                    />
                  </div>
                </>
              ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-red-500">
          Por favor, selecciona las fechas en las que quieres reservar
        </div>
      )}
    </div>
  );
}
