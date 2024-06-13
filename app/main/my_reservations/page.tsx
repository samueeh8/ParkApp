"use client";

import { useState, useEffect } from "react";
import { parkingsStore } from "@/store/parkings";
import { userStore } from "@/store/users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import EditMatriculaPopup from "@/Components/popups/editMatriculaPopup";

type DateObject = {
  seconds: number;
  nanoseconds: number;
};

type Reservation = {
  reservationID: string;
  parkingName: string;
  startDate: DateObject;
  endDate: DateObject;
  matricula: string;
};

export default function MyReservations() {
  const { user } = userStore();
  const { viewReservationsOfUser, deleteReservation, getAllReservationsAndParkings } = parkingsStore();

  const [myReservations, setMyReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    viewReservationsOfUser(user.id).then((reservations) => {
      setMyReservations(reservations);
    });
  }, []);

  const handleDeleteReservation = async (ReservationID: string) => {
    const confirm = window.confirm(
      "¿Estás seguro de que quieres cancelar la reserva?"
    );

    if (!confirm) {
      return;
    }

    await deleteReservation(ReservationID);
    await getAllReservationsAndParkings();
    
    viewReservationsOfUser(user.id).then((reservations) => {
      setMyReservations(reservations);
    });
  };

  const checkIfIsTheSameDay = (startDate: any, endDate: any) => {
    const startDateAsDate = new Date(startDate.seconds * 1000);
    const endDateAsDate = new Date(endDate.seconds * 1000);

    // Delete the time part of the date and compare
    return (
      startDateAsDate.getFullYear() === endDateAsDate.getFullYear() &&
      startDateAsDate.getMonth() === endDateAsDate.getMonth() &&
      startDateAsDate.getDate() === endDateAsDate.getDate()
    );
  };

  const [showPopupEditMatricula, setShowPopupEditMatricula] = useState(false);

  return (
    <div>
      <h1 className="text-2xl font-semibold my-5">Mis Reservas</h1>

      <div>
        <div className="grid grid-cols-4 gap-4 items-center border rounded-lg p-4">
          {myReservations.map((reservation) => (
            <>
              <div className="bg-gray-100 rounded-lg text-black p-4 flex items-center justify-center">
                Plaza {reservation.parkingName}
              </div>
              {checkIfIsTheSameDay(
                reservation.startDate,
                reservation.endDate
              ) ? (
                <div className="text-center">
                  <p className="text-lg font-medium">
                    Reservado para el{" "}
                    {reservation.startDate
                      ? new Date(
                          reservation.startDate.seconds * 1000
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              ) : (
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
              )}

              <p className="text-lg font-medium text-center">
                <span>
                  {reservation?.matricula}
                  <FontAwesomeIcon className="ml-2 cursor-pointer"
                    onClick={() => setShowPopupEditMatricula(true)}
                  icon={faPencil} />
                </span>
              </p>

              <div className="flex justify-end">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  onClick={() =>
                    handleDeleteReservation(reservation.reservationID)
                  }
                >
                  Cancelar Reserva
                </button>
              </div>
            </>
          ))}
        </div>
      </div>

      {showPopupEditMatricula && (
        <EditMatriculaPopup
          reservation={myReservations[0]}
          onClose={() => setShowPopupEditMatricula(false)}
        />
      )}
    </div>
  );
}
