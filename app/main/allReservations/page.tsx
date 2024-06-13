"use client";

import { useState, useEffect } from "react";
import { parkingsStore } from "@/store/parkings";
import EditReservationPopup from "@/Components/popups/editReservationPopup";

type DateObject = {
  seconds: number;
  nanoseconds: number;
};

export type ReservationType = {
  reservationID: string;
  parkingName: string;
  startDate: DateObject;
  endDate: DateObject;
  matricula: string;
};

export default function AllReservationsAdminPage() {
  const { getAllReservationsAndParkings, reservations, deleteReservation } =
    parkingsStore();

  const [allReservations, setAllReservations] = useState<ReservationType[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<
    ReservationType[]
  >([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [reservationToEdit, setReservationToEdit] = useState<ReservationType>();
  const [filterFromDate, setFilterFromDate] = useState("");

  const setAllReservationsFunction = async () => {
    await getAllReservationsAndParkings();
    setAllReservations(reservations);
  };

  useEffect(() => {
    setAllReservationsFunction();
  }, []);

  useEffect(() => {
    const filteredAndSortedReservations = allReservations.filter(
      (reservation) => {
        const reservationStartDate = new Date(
          reservation.startDate.seconds * 1000
        );
        const reservationEndDate = reservation.endDate
          ? new Date(reservation.endDate.seconds * 1000)
          : reservationStartDate; // Usa startDate si endDate no está disponible
        const filterFromDateObj = filterFromDate
          ? new Date(filterFromDate)
          : null;
        // Verifica si la reserva se superpone con el rango de fechas seleccionado
        const overlaps =
          filterFromDateObj === null || reservationEndDate >= filterFromDateObj;

        return overlaps;
      }
    );

    setFilteredReservations(filteredAndSortedReservations);
  }, [filterFromDate, allReservations]);

  const handleDeleteReservation = async (ReservationID: string) => {
    const confirm = window.confirm(
      "¿Estás seguro de que quieres cancelar la reserva?"
    );

    if (!confirm) {
      return;
    }

    await deleteReservation(ReservationID);
    await setAllReservationsFunction();
  };

  const handleEditReservation = async (reservation: ReservationType) => {
    setShowPopup(true);
    setReservationToEdit(reservation);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold my-5">Reservas</h1>

      <div>
        <div className="grid grid-cols-1 gap-4 items-center border rounded-lg p-4 mb-2">
          <div className="flex flex-col justify-end gap-2">
            <label className="text-lg text-center font-medium">
              Filtrar por fecha
            </label>
            <input
              type="date"
              placeholder="Desde"
              value={filterFromDate}
              onChange={(e) => setFilterFromDate(e.target.value)}
              className="border rounded-lg p-2 w-full text-black my-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 items-center border rounded-lg p-4">
          {filteredReservations
            .sort((a, b) => a.startDate.seconds - b.startDate.seconds)
            .map((reservation) => (
              <>
                <div className="bg-gray-100 rounded-lg text-black p-4 flex items-center justify-center">
                  Plaza {reservation.parkingName}
                </div>

                <div className="text-center">
                  <p className="text-lg font-medium">
                    Reservado desde{" "}
                    {reservation.startDate
                      ? new Date(
                          // @ts-ignore
                          reservation.startDate.toDate()
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p className="text-lg font-medium">
                    hasta{" "}
                    {reservation.endDate
                      ? new Date(
                          // @ts-ignore
                          reservation.endDate.toDate()
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                <p className="text-lg font-medium text-center">
                  {reservation?.matricula}
                </p>

                <div className="flex justify-end gap-2">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    onClick={() =>
                      handleDeleteReservation(reservation.reservationID)
                    }
                  >
                    Cancelar Reserva
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => handleEditReservation(reservation)}
                  >
                    Editar Reserva
                  </button>
                </div>
              </>
            ))}
        </div>
      </div>

      {showPopup && reservationToEdit && (
        <EditReservationPopup
          reservation={reservationToEdit}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}
