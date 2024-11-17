import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
} from "react-beautiful-dnd";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../store/slices/auth/authSlice";
import { NavigateFunction } from "react-router-dom";
import UsersRow from "./UsersRow";
type socialType = {
  loading: Boolean;
  todos: never[];
  setTodos: React.Dispatch<React.SetStateAction<never[]>>;
  navigate: NavigateFunction;
  fetchTodos: () => Promise<void>;
  language: string;
};
const tableHead = [
  { nameHead: "fullName", bool: true },
  { nameHead: "nationalNum", bool: true },
  { nameHead: "email", bool: true },
  { nameHead: "address", bool: true },
  { nameHead: "birth", bool: true },
  { nameHead: "birthPlace", bool: true },
  { nameHead: "gender", bool: true },
  { nameHead: "", bool: false },
];
export default function UsersProducts({
  loading,
  todos,
  setTodos,
  navigate,
  fetchTodos,
  language,
}: socialType) {
  // console.log(todos)
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const updatedTodos = Array.from(todos);
    const [reorderedItem] = updatedTodos.splice(result.source.index, 1);
    updatedTodos.splice(result.destination.index, 0, reorderedItem);
    setTodos(updatedTodos);
    const fetchTodo = updatedTodos.map((todo: any, i) => {
      return {
        id: todo.id,
        sort: i + 1,
      };
    });

    try {
      // إرسال طلب إلى الخادم لتحديث ترتيب العناصر
      await axios.post(
        `${process.env.REACT_APP_API_URL}admin/socialMedia/sort_images`,
        {
          sort: JSON.stringify(fetchTodo),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      // تحديث العناصر في الواجهة المستخدم
    } catch (error) {
      console.error("Error updating todos:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        dispatch(logoutUser());
        navigate("/");
      }
    }
  };

  //   change page table
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  //   delete
  const [deleteItemId, setDeleteItemId] = useState<Number | null>(null);

  const deleteTodo = async (id: number) => {
    setDeleteItemId(id);
    try {
      await axios.get(
        `${process.env.REACT_APP_API_URL}admin/socialMedia/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      // refresh api in the page
      await fetchTodos();
      setDeleteItemId(null);
    } catch (error) {
      console.error("Error deleting todo:", error);
      setDeleteItemId(null);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        dispatch(logoutUser());
        navigate("/");
      }
    }
  };

  return (
    <TableContainer component={Paper} className="tableContainer">
      <Table className="subTable">
        <TableHead>
          <TableRow className="text-center">
            {tableHead.map((e: { nameHead: string; bool: boolean }, i) => {
              return (
                <TableCell
                  key={i}
                  align={`${language === "ar" ? "right" : "left"}`}
                >
                  {t(e?.nameHead)}
                </TableCell>
              );
            })}
            {/* <TableCell>{t("Delete")}</TableCell> */}
          </TableRow>
        </TableHead>
        {loading ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={tableHead.length} className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        ) : todos.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="todos">
              {(provided) => (
                <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                  {todos
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    ?.map((item: any, index: number) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id?.toString()}
                        index={index}
                      >
                        {(provided: DraggableProvided) => (
                          <>
                            <UsersRow
                              provided={provided}
                              language={language}
                              item={item}
                              deleteItemId={deleteItemId}
                              deleteTodo={deleteTodo} 
                            />
                          </>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={tableHead.length}
                className="noData fw-bold text-capitalize text-center position-absolute"
              >
                {t("noData")}
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={todos?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{ color: "var(--clr-product)" }}
      />
    </TableContainer>
  );
}
