import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TableCell, TableRow } from "@mui/material";
import React from "react";
import { DraggableProvided } from "react-beautiful-dnd";
type UsersRowProps = {
  provided: DraggableProvided;
  language: String;
  item: any;
  deleteItemId: Number | null;
  deleteTodo: (id: number) => Promise<void>;
};
export default function UsersRow({
  provided,
  language,
  item,
  deleteItemId,
  deleteTodo,
}: UsersRowProps) {
  return (
    <TableRow
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
        1234
      </TableCell>
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
        yousef
      </TableCell>
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
        youseff2000q@gmail.com
      </TableCell>
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
        Damascus
      </TableCell>
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
        5/6/2001
      </TableCell>
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
        Damascus
      </TableCell>
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
        Male
      </TableCell>
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
        phone
      </TableCell>
      <TableCell align={`${language === "ar" ? "left" : "right"}`}>
        <div
        // className="d-flex"
        // style={{
        // width: "fit-content",
        // margin: "0",
        // }}
        >
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
  );
}
