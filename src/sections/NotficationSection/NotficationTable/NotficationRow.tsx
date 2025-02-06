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
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faTrash } from "@fortawesome/free-solid-svg-icons";
import { DraggableProvided } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../store/slices/auth/authSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import Swal from 'sweetalert2'; // استيراد SweetAlert

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
  const [representative, setRepresentative] = useState("");
  const [type, setType] = useState("");
  const [exceptions, setExceptions] = useState<string[]>([]);
  const [authorizations, setAuthorizations] = useState<string[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);

  // إرسال البيانات إلى السيرفر
  const handleSend = async () => {
    const payload = {
      agency_id: item?.agency_id,
      representative_id: representative,
      type,
      exceptions:
        exceptions.length > 0 ? JSON.stringify(exceptions) : "لا يوجد",
      authorizations:
        authorizations.length > 0 ? JSON.stringify(authorizations) : "لا يوجد",
    };

    console.log("Payload:", payload);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}v1/lawyers/send-notify-to-representative`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      console.log("Response:", response.data);
      
      // استخدام SweetAlert للإعلام بالنجاح
      Swal.fire({
        title: 'تم إرسال الإشعار بنجاح!',
        icon: 'success',
        confirmButtonText: 'حسناً'
      });
    } catch (error) {
      console.error("Error sending data:", error);
      
      // استخدام SweetAlert للإعلام بالفشل
      Swal.fire({
        title: 'فشل في إرسال الإشعار. يرجى المحاولة مجدداً.',
        icon: 'error',
        confirmButtonText: 'حسناً'
      });
    }
    setOpen(false); // إغلاق نافذة الحوار
  };

  // جلب بيانات المندوبين
  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}v1/lawyers/get-representatives`,
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

  useEffect(() => {
    fetchTodos();
  }, []);

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
          {/* المندوبين */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Representative</InputLabel>
            <Select
              value={representative}
              onChange={(e) => setRepresentative(e.target.value)}
            >
              {todos?.map((item: any) => (
                <MenuItem key={item?.id} value={item?.id}>
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* النوع */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <MenuItem value="عامة">عامة</MenuItem>
              <MenuItem value="خاصة">خاصة</MenuItem>
              <MenuItem value="شرعية">شرعية</MenuItem>
            </Select>
          </FormControl>

          {/* التفويضات */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Authorizations</InputLabel>
            <Select
              multiple
              value={authorizations}
              renderValue={(selected) => selected.join(", ")}
              input={<OutlinedInput label="Authorizations" />}
            >
              {[
                "الاسقاط",
                "الاقرار",
                "الابراء",
                "الانكار",
                "الصلح",
                "حق الطعن",
                "التسليم",
                "الاستلام",
                "دفع الغرامات",
                "السلف",
                "التامينات",
                "مشاركة بالمزاد",
                "المخالعة",
              ].map((option) => (
                <MenuItem key={option} value={option}>
                  <Checkbox
                    checked={authorizations.includes(option)}
                    onChange={() => {
                      setAuthorizations((prev) =>
                        prev.includes(option)
                          ? prev.filter((item) => item !== option)
                          : [...prev, option]
                      );
                    }}
                  />
                  <ListItemText primary={option} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* الاستثناءات */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Exceptions</InputLabel>
            <Select
              multiple
              value={exceptions}
              renderValue={(selected) => selected.join(", ")}
              input={<OutlinedInput label="Exceptions" />}
            >
              {["البيع", "الهبة"].map((option) => (
                <MenuItem key={option} value={option}>
                  <Checkbox
                    checked={exceptions.includes(option)}
                    onChange={() => {
                      setExceptions((prev) =>
                        prev.includes(option)
                          ? prev.filter((item) => item !== option)
                          : [...prev, option]
                      );
                    }}
                  />
                  <ListItemText primary={option} />
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