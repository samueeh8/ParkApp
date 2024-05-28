"use client";
import { useState, useEffect } from "react";
import { parkingsStore } from "@/store/parkings";
import { userStore } from "@/store/users";

type DateObject = {
  seconds: number;
  nanoseconds: number;
};

type Reservation = {
  parkingName: string;
  date: DateObject;
};

export default function MyReservations() {
  const { user } = userStore();
  const { viewReservationsOfUser, deleteReservation } = parkingsStore();

  const [myReservations, setMyReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const allMyReservations: Reservation[] = viewReservationsOfUser(user.id);
    setMyReservations(allMyReservations);
  }, [viewReservationsOfUser, user]);

  const handleDeleteReservation = async (parkingName: string, Date: any) => {
    await deleteReservation(parkingName, Date)
    const allMyReservations: Reservation[] = viewReservationsOfUser(user.id);
    setMyReservations(allMyReservations);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold my-5">Mis Reservas</h1>

      <div>
        <div className="grid grid-cols-3 gap-4 items-center border rounded-lg p-4">
          {myReservations.map((reservation) => (
            <>
              <div className="bg-gray-100 rounded-lg text-black p-4 flex items-center justify-center">
                Plaza {reservation.parkingName}
              </div>

              <div className="text-center">
                Reservado el{" "}
                {new Date(reservation.date.seconds * 1000).toLocaleDateString()}
              </div>

              <div className="flex justify-end">
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => 
                      handleDeleteReservation(reservation.parkingName, reservation.date)}
                >
                  Cancelar Reserva
                </button>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
