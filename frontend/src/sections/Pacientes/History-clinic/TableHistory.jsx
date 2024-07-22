import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

const dataExample = [
  {
    fecha: "01/01/2024",
    hora: "10:00",
    motivo: "Extracción de molares",
  },
  {
    fecha: "01/01/2024",
    hora: "12:00",
    motivo: "Dolor de diente",
  },
];

export default function TableHistory() {
  const [turnos, setTurnos] = useState([]);
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("fecha", {
      header: () => "FECHA",
      cell: (info) => info.getValue(), // Obtiene el valor de la celda
    }),
    columnHelper.accessor("hora", {
      header: () => "HORA",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("motivo", {
      header: () => "MOTIVO",
      cell: (info) => info.getValue(),
    }),
  ];

  useEffect(() => {
    setTurnos(dataExample);
  }, []);

  const table = useReactTable({
    data: turnos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full table-auto">
      <thead className="w-full">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="flex gap-2.5 px-4 py-3">
            {headerGroup.headers.map((column) => (
              <th
                key={column.id}
                className={`px-3.5 py-3 bg-[#e6f7ff] rounded text-[#005FDB] text-lg font-semibold
                ${column.id === "motivo" ? "flex-1" : "flex-none w-1/6"}
                `}
              >
                <div>
                  {flexRender(
                    column.column.columnDef.header,
                    column.getContext()
                  )}
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="flex flex-col gap-2.5">
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className="flex gap-2.5 cursor-pointer px-4 hover:opacity-70"
          >
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.column.id}
                className={`px-2.5 py-3 text-[#192739] bg-white text-center rounded text-lg font-medium ${
                  cell.column.id === "motivo" ? "flex-1" : "flex-none w-1/6"
                }`}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
