export default function RoomColumn({ room_number, house_name }) {
    return (
        <>
            <div className="flex flex-col">
                <span className="font-semibold text-sm/3">
                    {room_number ?? "-"}
                </span>
                <span className="text-xs text-gray-500">
                    {room_number ? house_name : ""} 
                </span>
            </div>
        </>
    );
}
