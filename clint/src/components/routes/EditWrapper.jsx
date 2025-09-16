import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";
import RoomForm from "../Rooms/RoomForm";

export default function RoomFormEditWrapper() {

  const { id } = useParams();
  const [initial, setInitial] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/rooms/${id}`).then(res => setInitial(res.data));
  }, [id]);

  if (!initial) return <div className="text-center py-10">Loading...</div>;

  return <RoomForm initial={initial} onSuccess={() => navigate("/admin/rooms")} />;
}