import React, { useEffect, useState } from "react";
import { GenericTableTypeEnum } from "../constants";
import { register } from "module";

interface TableColumn {
  key: string;
  header: string;
  width?: string;
}

interface GenericTableProps {
  type: GenericTableTypeEnum;
  data: Record<string, unknown>[];
  title: string;
  className?: string;
  emptyMessage?: string;
}

// Reservation Stations Columns
const reservationStationsColumns = [
  { key: "tag", header: "Station" },
  { key: "op", header: "Operation" },
  { key: "VJ", header: "Vj" },
  { key: "VK", header: "Vk" },
  { key: "QJ", header: "Qj" },
  { key: "QK", header: "Qk" },
  { key: "busy", header: "Busy" },
  { key: "cyclesRemaining", header: "Cycles Remaining" },
];

// Load Buffer Table
const loadBufferColumns = [
  { key: "tag", header: "Tag" },
  { key: "busy", header: "Busy" },
  { key: "address", header: "Address" },
  { key: "cyclesRemaining", header: "Cycles Remaining" },
];

// Store Buffer Table
const storeBufferColumns = [
  { key: "tag", header: "Tag" },
  { key: "busy", header: "Busy" },
  { key: "address", header: "Address" },
  { key: "v", header: "V" },
  { key: "q", header: "Q" },
  { key: "cyclesRemaining", header: "Cycles Remaining" },
];

// Instruction Memory Table
const dataMemoryColumns = [
	{ key: "tag", header: "Tag" },
	{ key: "Q", header: "Q" },
	{ key: "content", header: "Data" },
];

const GenericTable: React.FC<GenericTableProps> = ({
  type,
  data,
  title,
  className = "",
  emptyMessage = "No data available",
}) => {
  const [columns, setColumns] = useState<TableColumn[]>([]);

	useEffect(() => {
		if (type === GenericTableTypeEnum.ReservationStations) {
			setColumns(reservationStationsColumns);
		} else if (type === GenericTableTypeEnum.LoadBuffer) {
			setColumns(loadBufferColumns);
		} else if (type === GenericTableTypeEnum.StoreBuffer) {
			setColumns(storeBufferColumns);
		} else if (type === GenericTableTypeEnum.RegisterFile) {
			setColumns(registerFileColumns);
		}
	}, [type]);

	return (
		<div
			className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
		>
			<h2 className="text-xl font-bold bg-gray-100 p-3 border-b">
				{title}
			</h2>
			{data?.length === 0 ? (
				<div className="text-center p-4 text-gray-500">
					{emptyMessage}
				</div>
			) : (
				<table className="w-full">
					<thead>
						<tr className="bg-gray-50">
							{columns.map((column) => (
								<th
									key={column.key}
									className="p-3 text-left font-semibold text-gray-600 border-b"
									style={{ width: column.width }}
								>
									{column.header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data?.map((row, rowIndex) => (
							<tr
								key={rowIndex}
								className="hover:bg-gray-100 transition-colors"
							>
								{columns.map((column) => (
									<td
										key={column.key}
										className="p-3 border-b"
									>
										{String(row[column.key] ?? "")}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default GenericTable;
