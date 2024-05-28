import { create } from "zustand";
import { db } from "@/firebase";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

interface ParkingStore {
  parkings: Parking[];
  addNewParkingFirebase: (isCovered: boolean, name: string) => Promise<void>;
  getAllParkingSlots: () => Promise<void>;
  deleteParkingSlot: (id: string) => Promise<void>;
  addReservationDate: (id: string, date: Date, userID: string) => Promise<void>;
  viewReservationsOfUser: (userID: string) => any[];
  deleteReservation: (id: string, timestamp: any) => Promise<void>;
}

interface Parking {
  id: string;
  isCovered: boolean;
  name: string;
  reservationDates?: { userID: string; date: Date }[];
}

export const parkingsStore = create<ParkingStore>((set, get) => ({
  parkings: [],

  addNewParkingFirebase: async (isCovered, name) => {
    const parkingData = {
      id: "",
      isCovered: isCovered,
      name: name,
      reservationDates: [],
    };

    try {
      const resultDoc = await addDoc(collection(db, "parkings"), parkingData);

      // Change the id of the parking slot to the id of the document in Firestore
      parkingData.id = resultDoc.id;
      setDoc(doc(db, "parkings", resultDoc.id), parkingData);

      set((state) => ({
        parkings: [...state.parkings, parkingData],
      }));
    } catch (e) {
      console.log("Error adding parking!", e);
    }
  },

  getAllParkingSlots: async () => {
    const parkings = await getDocs(collection(db, "parkings"));

    set((state) => ({
      parkings: parkings.docs.map((doc) => doc.data() as Parking),
    }));
  },

  deleteParkingSlot: async (id: string) => {
    await deleteDoc(doc(db, "parkings", id));

    set((state) => ({
      parkings: state.parkings.filter((parking) => parking.id !== id),
    }));
  },

  addReservationDate: async (id: string, date: Date, userID: string) => {
    const parkingRef = doc(db, "parkings", id);
    const parkingSnap = await getDoc(parkingRef);

    if (parkingSnap.exists()) {
      const parkingData = parkingSnap.data() as Parking;

      const objectToSave: any = {
        userID: userID,
        date: Timestamp.fromDate(date),
      };

      parkingData.reservationDates?.push(objectToSave);

      await updateDoc(parkingRef, {
        reservationDates: parkingData.reservationDates,
      });

      set((state) => ({
        parkings: state.parkings.map((parking) =>
          parking.id === id ? parkingData : parking
        ),
      }));
    } else {
      console.log(`No parking slot found with id: ${id}`);
    }
  },

  viewReservationsOfUser(userID: string) {
    const reservations: any = [];
    const parkings = get().parkings;

    parkings.forEach((parking) => {
      parking.reservationDates?.forEach((reservation) => {
        if (reservation.userID === userID) {
          reservations.push({
            parkingName: parking.name,
            date: reservation.date,
          });
        }
      });
    });

    return reservations;
  },

  deleteReservation: async (parkingName: string, timestamp: any) => {
    const parking = get().parkings;

    let parkingID = "";
    let newReservationObject: any = [];
    parking.forEach((parkingSlot) => {
      if (parkingSlot.name === parkingName) {
        // Encontrado el parking modificar su reserva
        parkingID = parkingSlot.id;
        newReservationObject = parkingSlot.reservationDates?.filter(
          (reservation) => reservation.date !== timestamp
        );
      }
    });

    // Teniendo el nuevo objeto de reservas modificar el registro
    const parkingRef = doc(db, "parkings", parkingID);
    const parkingSnap = await getDoc(parkingRef);

    if (parkingSnap.exists()) {
      // Reemplazamos directamente reservationDates con newReservationObject
      await updateDoc(parkingRef, {
        reservationDates: newReservationObject,
      });

      console.log("Reservation updated successfully");
    } else {
      console.log("No such parking exists");
    }

    // Terminado todo actualizar el objeto Zustand
    set((state) => ({
      ...state,
      parkings: state.parkings.map((parking) =>
        parking.id === parkingID
          ? { ...parking, reservationDates: newReservationObject }
          : parking
      ),
    }));
  },
}));
