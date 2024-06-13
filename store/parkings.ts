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
import { v4 as uuidv4 } from "uuid";

interface ParkingStore {
  parkings: Parking[];
  reservations: any[];
  addNewParkingFirebase: (isCovered: boolean, name: string) => Promise<void>;
  getAllParkingSlots: () => Promise<void>;
  getAllReservationsAndParkings: () => Promise<void>;
  deleteParkingSlot: (id: string) => Promise<void>;
  filterParkingSlots: (dateFrom: Date, dateTo: Date) => Promise<any[]>;
  addReservationDate: (
    id: string,
    dateFrom: Date,
    dateTo: Date,
    userID: string,
    matricula: string
  ) => Promise<void>;
  viewReservationsOfUser: (userID: string) => Promise<any[]>;
  deleteReservation: (reservationID: string) => Promise<void>;
  editReservation: (reservation: any, newData: any) => Promise<void>;
  editarMatricula: (reservation: any, newMatricula: any) => Promise<void>;
}

interface Parking {
  id: string;
  isCovered: boolean;
  name: string;
  reservationDates?: {
    reservationID: string;
    userID: string;
    dateFrom: Date;
    dateTo: Date;
    matricula: string;
  }[];
}

export const parkingsStore = create<ParkingStore>((set, get) => ({
  parkings: [],
  reservations: [],

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

  getAllReservationsAndParkings: async () => {
    // First get all the parkings
    await get().getAllParkingSlots();

    let reservations: any = [];

    get().parkings.forEach((parking) => {
      parking.reservationDates?.forEach((reservation) => {
        reservations.push({
          parkingName: parking.name,
          reservationID: reservation.reservationID,
          startDate: reservation.dateFrom,
          endDate: reservation.dateTo,
          userID: reservation.userID,
          matricula: reservation.matricula,
        });
      });
    });

    //@ts-ignore
    set((state) => ({
      reservations: reservations,
    }));
  },

  filterParkingSlots: async (dateFrom: Date, dateTo: Date) => {
    await get().getAllReservationsAndParkings();

    const parkings = get().parkings;
    const filteredParkings = parkings.map((parking) => {

      // If there are no reservation dates, return the parking slot
      if (!parking.reservationDates) {
        return parking;
      }

      // See each reservation date
      let isAvail = true;
      parking.reservationDates.forEach((reservation) => {
        //@ts-ignore
        const resDateFrom = new Date(reservation.dateFrom.seconds * 1000);
        //@ts-ignore
        const resDateTo = new Date(reservation.dateTo.seconds * 1000);

        // If at least one reservation date is within the selected range, the parking slot is not available
        if (
          (dateFrom >= resDateFrom && dateFrom <= resDateTo) ||
          (dateTo >= resDateFrom && dateTo <= resDateTo)
        ) {
          isAvail = false;
        }

        // If the selected range is within a reservation date, the parking slot is not available
        if (dateFrom <= resDateFrom && dateTo >= resDateTo) {
          isAvail = false;
        }
      });

      if (isAvail) {
        return parking;
      }
    });

    // Filter out the undefined values
    const result = filteredParkings.filter((parking) => parking !== undefined);
    return result;
  },

  deleteParkingSlot: async (id: string) => {
    await deleteDoc(doc(db, "parkings", id));

    set((state) => ({
      parkings: state.parkings.filter((parking) => parking.id !== id),
    }));
  },

  addReservationDate: async (
    id: string,
    dateFrom: Date,
    dateTo: Date,
    userID: string,
    matricula: string
  ) => {
    const parkingRef = doc(db, "parkings", id);
    const parkingSnap = await getDoc(parkingRef);

    if (parkingSnap.exists()) {
      const parkingData = parkingSnap.data() as Parking;
      const id = uuidv4();

      const objectToSave: any = {
        reservationID: id,
        userID: userID,
        dateFrom: Timestamp.fromDate(dateFrom),
        dateTo: Timestamp.fromDate(dateTo),
        matricula: matricula,
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

  viewReservationsOfUser: async (userID: string) => {
    await get().getAllReservationsAndParkings();

    return get().reservations.filter(
      (reservation) => reservation.userID === userID
    );
  },

  deleteReservation: async (reservationID: string) => {
    const parking = get().parkings;

    parking.forEach(async (parking) => {
      const newReservationDates = parking.reservationDates?.filter(
        (reservation) => reservation.reservationID !== reservationID
      );

      await updateDoc(doc(db, "parkings", parking.id), {
        reservationDates: newReservationDates,
      });

      set((state) => ({
        parkings: state.parkings.map((parking) =>
          parking.id === parking.id
            ? { ...parking, reservationDates: newReservationDates }
            : parking
        ),
      }));
    });
  },

  editReservation: async (reservationToEdit: any, newData: any) => {
    const parkings = get().parkings;
    const parkingName = reservationToEdit.parkingName;

    // Buscamos todo el parking que contiene la reserva que queremos editar por nombre
    const parking = parkings.find((parking) => parking.name === parkingName);
    const allReservations = parking?.reservationDates;

    // Buscamos la reserva que queremos editar
    const reservation = allReservations?.find(
      (reservation) => reservation.reservationID === reservationToEdit.reservationID
    );

    // Actualizamos los datos de la reserva
    if (!reservation || !reservation.dateFrom || !reservation.dateTo || !reservation.matricula) return;

    reservation.dateFrom = newData.startDate;
    reservation.dateTo = newData.endDate;
    reservation.matricula = newData.matricula;

    // Actualizamos el parking con la nueva reserva
    const newParking = {
      ...parking,
      reservationDates: allReservations,
    };

    if (!newParking || !parking || !parking.id) return;

    // Actualizamos el parking en Firestore
    await updateDoc(doc(db, "parkings", parking.id), newParking);

    // Actualizamos el estado del parking en el store
    // @ts-ignore
    set((state) => ({
      parkings: state.parkings.map((parking) =>
        parking.id === newParking.id ? newParking : parking
      ),
    }));

  },

  editarMatricula: async (reservationToEdit: any, newMatricula: any) => {
    const parkings = get().parkings;
    const parkingName = reservationToEdit.parkingName;

    // Buscamos todo el parking que contiene la reserva que queremos editar por nombre
    const parking = parkings.find((parking) => parking.name === parkingName);
    const allReservations = parking?.reservationDates;

    // Buscamos la reserva que queremos editar
    const reservation = allReservations?.find(
      (reservation) => reservation.reservationID === reservationToEdit.reservationID
    );

    // Actualizamos los datos de la reserva
    if (!reservation || !reservation.dateFrom || !reservation.dateTo || !reservation.matricula) return;

    reservation.matricula = newMatricula;

    // Actualizamos el parking con la nueva reserva
    const newParking = {
      ...parking,
      reservationDates: allReservations,
    };

    if (!newParking || !parking || !parking.id) return;

    // Actualizamos el parking en Firestore
    await updateDoc(doc(db, "parkings", parking.id), newParking);

    // Actualizamos el estado del parking en el store
    // @ts-ignore
    set((state) => ({
      parkings: state.parkings.map((parking) =>
        parking.id === newParking.id ? newParking : parking
      ),
    }));

  },
}));
