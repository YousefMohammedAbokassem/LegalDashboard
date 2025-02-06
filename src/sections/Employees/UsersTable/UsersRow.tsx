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
        {item?.name}
      </TableCell>
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
        {item?.national_number}
      </TableCell>
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
        {item?.email}
      </TableCell>
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
        {item?.address}
      </TableCell>
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
        {item?.birthdate}
      </TableCell>
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
        {item?.birthdate}
      </TableCell>
      <TableCell align={`${language === "ar" ? "right" : "left"}`}>
        {item?.gender}
      </TableCell>

    </TableRow>
  );
}
