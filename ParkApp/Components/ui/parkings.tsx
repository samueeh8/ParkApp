import "./parkingStyles.css";

export default function ParkingSpace({ number }: { number: number }) {
  return (
    <div className="flex-center">
      <div className="bg-gray">
        <div className="relativeParkingCenter">
          <div className="text">{number}</div>
        </div>
      </div>
    </div>
  );
}
