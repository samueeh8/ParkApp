"use client";

import React, { useEffect, useState } from "react";
import { parkingsStore } from "@/store/parkings";
import { userStore } from "@/store/users";
import { ParkingSlot } from "./parkingSlot";

import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";

export default function ParkingMainPage() {
  const { parkings, getAllParkingSlots } = parkingsStore();

  useEffect(() => {
    getAllParkingSlots();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold my-5">Plazas</h1>

      <div>
        <div className="grid grid-cols-3 gap-4 items-center border rounded-lg p-4">
          {parkings
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((parking) => (
              <>
                <div className="bg-gray-100 rounded-lg text-black p-4 flex items-center justify-center">
                  Plaza {parking.isCovered ? "cubierta " : "descubierta "}
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium">Plaza {parking.name}</h3>
                </div>
                <div className="flex justify-end">
                  <ParkingSlot slot={parking} />
                </div>
              </>
            ))}
        </div>
      </div>
    </div>
  );
}
