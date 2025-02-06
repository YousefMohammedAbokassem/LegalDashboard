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
        {item?.sequential_number}
      </TableCell>
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
        {item?.record_number}
      </TableCell>
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
        {item?.lawyer_name}
      </TableCell>
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
        {item?.user_name}
      </TableCell>
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
        {item?.place_of_issue}
      </TableCell>
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
        {item?.type}
      </TableCell>
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
        {item?.status}
      </TableCell>
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
        {item?.is_active}
      </TableCell>
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
      </TableCell>

    </TableRow>
  );
}
