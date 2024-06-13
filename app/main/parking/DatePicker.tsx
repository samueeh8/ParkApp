"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";

export default function MyDatePicker({
  onChangeDates,
}: {
  onChangeDates: (dates: [Date, Date]) => void;
}) {
  const [dates, setDates] = useState([new Date(), new Date()]);

  const handleDateChange = (update: [Date | null, Date | null]) => {
    if (update && Array.isArray(update)) {
      const newDates = update as [Date, Date];
      setDates(newDates);
      onChangeDates(newDates);
    }
  };

  return (
    <div className="flex justify-center">
      <DatePicker
        selected={dates[0]}
        onChange={handleDateChange}
        startDate={dates[0]}
        endDate={dates[1]}
        selectsRange
        inline
        calendarClassName="border rounded p-2 bg-white shadow react-datepicker-fixed-height"
        className="border-2 border-blue-500 rounded-lg text-blue-500 font-bold p-2"
      />
    </div>
  );
}
