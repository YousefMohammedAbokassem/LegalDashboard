import React, { useEffect, useState } from "react";
import {
  TableCell,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faTrash } from "@fortawesome/free-solid-svg-icons";
import { DraggableProvided } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../store/slices/auth/authSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2"; // استيراد SweetAlert

const SYRIAN_PROVINCES = [
  "دمشق",
  "ريف دمشق",
  "حلب",
  "حمص",
  "حماة",
  "اللاذقية",
  "طرطوس",
  "إدلب",
  "درعا",
  "السويداء",
  "الحسكة",
  "الرقة",
  "دير الزور",
  "القنيطرة",
];

type UsersRowProps = {
  provided: DraggableProvided;
  language: String;
  item: any;
  deleteItemId: Number | null;
  deleteTodo: (id: number) => Promise<void>;
};

export default function NotficationRow({
  provided,
  language,
  item,
  deleteItemId,
  deleteTodo,
}: UsersRowProps) {
  const [open, setOpen] = useState(false);
  const [record_number, setRecord_number] = useState("");
  const [sequential_number, setSequential_number] = useState("");
  const [place, setPlace] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);

  // إرسال البيانات إلى السيرفر
  const handleSend = async () => {
    const payload = {
      agency_id: item?.agency_id,
      sequential_number: sequential_number,
      record_number: record_number,
      place_of_issue: place,
      status,
    };

    console.log("Payload:", payload);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}v1/representatives/send-notify-to-all`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      console.log("Response:", response.data);

      Swal.fire({
        title: "تم إرسال الإشعار بنجاح!",
        icon: "success",
        confirmButtonText: "حسناً",
      });
    } catch (error) {
      console.error("Error sending data:", error);

      Swal.fire({
        title: "فشل في إرسال الإشعار. يرجى المحاولة مجدداً.",
        icon: "error",
        confirmButtonText: "حسناً",
      });
    }
    setOpen(false); // إغلاق نافذة الحوار
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}v1/representatives/get-representatives`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setTodos(response.data.data.representatives);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching todos:", error);
        setLoading(false);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          dispatch(logoutUser());
          navigate("/");
        }
      }
    };

    fetchTodos();
  }, [dispatch, navigate]);

  return (
    <>
      <TableRow
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <TableCell align={`${language === "ar" ? "right" : "left"}`}>
          {item?.from}
        </TableCell>
        <TableCell align={`${language === "ar" ? "right" : "left"}`}>
          {item?.msg}
        </TableCell>
        <TableCell align={`${language === "ar" ? "right" : "left"}`}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FontAwesomeIcon icon={faPaperPlane} />}
            size="small"
            onClick={() => setOpen(true)} // فتح نافذة الحوار
          >
            Send
          </Button>
        </TableCell>
        <TableCell align={`${language === "ar" ? "left" : "right"}`}>
          <div>
            {deleteItemId === item.id ? (
              <span
                className="spinner-border spinner-border-sm mainColorText"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => deleteTodo(item.id)}
                className="mainColorText pointer"
                size="lg"
              />
            )}
          </div>
        </TableCell>
      </TableRow>

      {/* نافذة الحوار */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Send Notification</DialogTitle>
        <DialogContent>
          {/* الرقم التسلسلي */}
          <TextField
            label="الرقم التسلسلي"
            fullWidth
            margin="normal"
            value={sequential_number}
            onChange={(e) => setSequential_number(e.target.value)}
          />
          <TextField
            label="رقم السجل"
            fullWidth
            margin="normal"
            value={record_number}
            onChange={(e) => setRecord_number(e.target.value)}
          />

          {/* الحالة */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="approved">قبول</MenuItem>
              <MenuItem value="rejected">رفض</MenuItem>
            </Select>
          </FormControl>

          {/* المحافظة */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Place</InputLabel>
            <Select value={place} onChange={(e) => setPlace(e.target.value)}>
              {SYRIAN_PROVINCES.map((province) => (
                <MenuItem key={province} value={province}>
                  {province}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSend} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
